import { GLPK, LP as OptimizationProblem, Result } from 'glpk.js';
import cloneDeep from 'lodash/cloneDeep';
import zip from 'lodash/zip';
import {
    BrokerNode,
    CustomerNode,
    Graph,
    GraphEdge,
    SupplierNode,
} from 'components/GraphEditor';

let glpk: GLPK | undefined;

// this library cannot be imported in other way
// eslint-disable-next-line @typescript-eslint/no-var-requires
const libraryLoad = require('glpk.js').then((lib: GLPK) => {
    glpk = lib;
});

type VariablesDefinition = OptimizationProblem['subjectTo'][0]['vars'];

export interface Solution {
    graph: Graph;
    cost: number;
    flow: number;
}

export interface Solutions {
    minCost: Solution;
    maxFlow: Solution;
}

const getVariableDefsFromEdges = (edges: GraphEdge[], nodeId: string, outboundCoefficient = 1, inboundCoefficient = -1): VariablesDefinition => ([
    //  D_k- krawędzie wchodzące do węzła
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

const verifySolutionStatus = (solution: Result): void => {
    if (!glpk)
        return;

    const { status } = solution.result;

    if (status === glpk.GLP_UNDEF)
        throw new Error('Zagadnienie nie ma rozwiązania');

    if (status === glpk.GLP_INFEAS)
        throw new Error('Znalezione rozwiązanie jest niewykonalne');

    if (status === glpk.GLP_NOFEAS)
        throw new Error('Zagadnienie nie posiada wykonalnego rozwiązania');

    if (status === glpk.GLP_UNBND)
        throw new Error('Zagadnienie wydaje się być nieograniczone');
};

export const optimize = async (graph: Graph): Promise<Solutions> => {
    if (!glpk)
        await libraryLoad;

    if (!glpk)
        throw new Error('GLPK failed to load');

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
                vars: getVariableDefsFromEdges(edges, node.id, -1, 1),
                bnds: {
                    type: glpk!.GLP_LO, // lower bound only
                    lb: (node as CustomerNode).demand,
                    ub: 0,
                },
            })),
            // dostawcy
            ...nodes.filter(node => node instanceof SupplierNode).map(node => ({
                name: `${node.title} (${node.id})`,
                vars: getVariableDefsFromEdges(edges, node.id, 1, -1),
                bnds: {
                    type: glpk!.GLP_UP, // upper bound only
                    lb: 0,
                    ub: (node as SupplierNode).supply,
                },
            })),
            // pośrednicy
            ...nodes.filter(node => node instanceof BrokerNode).map(node => ({
                name: `${node.title} (${node.id})`,
                vars: getVariableDefsFromEdges(edges, node.id, 1, -1),
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

    const minCostSolution = glpk.solve(problem, { msglev: glpk.GLP_MSG_DBG });

    verifySolutionStatus(minCostSolution);

    console.log(minCostSolution);

    problem.name = 'Maksymalizacja przepływu';
    problem.objective = {
        direction: glpk.GLP_MAX,
        name: 'Sumaryczny przepływ dóbr w sieci',
        vars: nodes.filter(node => node instanceof SupplierNode).flatMap(node => getVariableDefsFromEdges(graph.edges, node.id, 1, -1)),
    };

    console.log(problem);

    const maxFlowSolution = glpk.solve(problem, { msglev: glpk.GLP_MSG_ALL });

    verifySolutionStatus(maxFlowSolution);

    console.log(maxFlowSolution);

    const minCostGraph = cloneDeep(graph);
    const maxFlowGraph = cloneDeep(graph);

    for (const [id, value] of Object.entries(minCostSolution.result.vars)) {
        const edge = minCostGraph.edges.find(e => e.id === id);

        if (edge)
            edge.weight = value;
    }

    for (const [id, value] of Object.entries(maxFlowSolution.result.vars)) {
        const edge = maxFlowGraph.edges.find(e => e.id === id);

        if (edge)
            edge.weight = value;
    }

    return {
        minCost: {
            graph: minCostGraph,
            flow: minCostGraph.nodes.filter(node => node instanceof SupplierNode).map(node => ({
                inflow: minCostGraph.edges.filter(e => e.target === node.id).reduce((total, edge) => total + edge.weight, 0),
                out: minCostGraph.edges.filter(e => e.source === node.id).reduce((total, edge) => total + edge.weight, 0),
            }))
                .reduce((total, { inflow, out }) => total + (out - inflow), 0),
            cost: minCostSolution.result.z,
        },
        maxFlow: {
            graph: maxFlowGraph,
            flow: maxFlowSolution.result.z,
            cost: zip(graph.edges, maxFlowGraph.edges).reduce((total, [e1, e2]) => total + (e1?.weight ?? 0) * (e2?.weight ?? 0), 0),
        },
    };
};
