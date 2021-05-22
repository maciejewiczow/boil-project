import { GLPK, LP as OptimizationProblem } from 'glpk.js';
import {
    BrokerNode,
    CustomerNode,
    Graph,
    GraphEdge,
    SupplierNode,
} from 'components/GraphEditor';
import cloneDeep from 'lodash/cloneDeep';

let glpk: GLPK | undefined;

// this library cannot be imported in other way
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prom = require('glpk.js').then((lib: GLPK) => {
    glpk = lib;
});

type VariablesDefinition = OptimizationProblem['subjectTo'][0]['vars'];

const getConstraintVariablesFromEdges = (edges: GraphEdge[], nodeId: string, outboundCoefficient = 1, inboundCoefficient = -1): VariablesDefinition => ([
    // D_k - krawędzie wchodzące do węzła
    ...edges.filter(e => e.target === nodeId).map(edge => ({
        name: edge.id,
        coef: inboundCoefficient,
    })),
    // W_k - krawędzie wychodzące z węzła
    ...edges.filter(e => e.source === nodeId).map(edge => ({
        name: edge.id,
        coef: outboundCoefficient,
    })),
]);

export const optimize = async (graph: Graph): Promise<Graph> => {
    if (!glpk)
        await prom;

    if (!glpk)
        throw Error('GLPK failed to load');

    const { nodes, edges } = graph;

    // Because TS does not see the above 'throw' as enough apparently
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const problem: OptimizationProblem = {
        name: 'Minimalizacja kosztów',
        objective: {
            name: 'Sumaryczny koszt transportu',
            direction: glpk.GLP_MIN,
            vars: edges.map(({ id, weight }) => ({ name: id, coef: weight })),
        },
        subjectTo: [
            // odbiorcy
            ...nodes.filter(node => node instanceof CustomerNode).map(node => ({
                name: `${node.title} (${node.id})`,
                vars: getConstraintVariablesFromEdges(edges, node.id, -1, 1),
                bnds: {
                    type: glpk!.GLP_LO, // lower bound only
                    lb: (node as CustomerNode).demand,
                    ub: 0,
                },
            })),
            // dostawcy
            ...nodes.filter(node => node instanceof SupplierNode).map(node => ({
                name: `${node.title} (${node.id})`,
                vars: getConstraintVariablesFromEdges(edges, node.id, 1, -1),
                bnds: {
                    type: glpk!.GLP_UP, // upper bound only
                    lb: 0,
                    ub: (node as SupplierNode).supply,
                },
            })),
            // pośrednicy
            ...nodes.filter(node => node instanceof BrokerNode).map(node => ({
                name: `${node.title} (${node.id})`,
                vars: getConstraintVariablesFromEdges(edges, node.id, 1, -1),
                bnds: {
                    type: glpk!.GLP_FX, // fixed variable (= 0)
                    lb: 0,
                    ub: 0,
                },
            })),
            // ograniczenia przepustowości tras
            ...edges.map(edge => ({
                name: `Ograniczenie przeływu na krawędzi ${edge.id}`,
                vars: [
                    {
                        name: edge.id,
                        coef: 1,
                    },
                ],
                bnds: (
                    edge.max !== undefined ? (
                        {
                            type: glpk!.GLP_DB,
                            lb: edge.min,
                            ub: edge.max,
                        }
                    ) : (
                        {
                            type: glpk!.GLP_LO,
                            lb: edge.min,
                            ub: 0,
                        }
                    )
                ),
            })),
        ],
    };
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    console.log(problem);

    const solution = glpk.solve(problem, { msglev: glpk.GLP_MSG_DBG });

    console.log(solution);

    const newGraph = cloneDeep(graph);

    for (const [id, value] of Object.entries(solution.result.vars)) {
        const edge = newGraph.edges.find(e => e.id === id);

        if (edge)
            edge.weight = value;
    }

    return newGraph;
};
