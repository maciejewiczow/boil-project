import React, { useState } from 'react';
import { PageHeader } from 'views/PageLayoutParts';
import GraphEditor, {
    Graph,
    GraphEdge,
    BrokerNode,
    CustomerNode,
    GraphNode,
    SupplierNode,
} from 'components/GraphEditor';
import { getNextSequenceNumberForNodeType, isValidEdge, updateNodeNumbers } from 'components/GraphEditor/utils';
import { GraphDisplayer } from 'components/GraphEditor/GraphDisplayer/GraphDisplayer';
import { toast } from 'react-toastify';
import {
    GraphEntityDetails,
    PageContent,
    PageWrapper,
    SolutionButtons,
    Button,
    SolutionDetails,
} from './parts';
import { optimize, Solutions } from './algorithm';

const nodes: GraphNode[] = [
    // new SupplierNode(250, 1, 0, 0),
    // new SupplierNode(300, 2, 0, 300),
    // new CustomerNode(120, 1, 500, -100),
    // new CustomerNode(250, 2, 500, 150),
    // new CustomerNode(100, 3, 500, 400),
    // new BrokerNode(1, 250, 150),
];

const edges: GraphEdge[] = [
    // new GraphEdge(nodes[0].id, nodes[1].id, 3, 30, 50),
    // new GraphEdge(nodes[0].id, nodes[2].id, 3, 30, 50),
    // new GraphEdge(nodes[0].id, nodes[5].id, 5, 0, 150),
    // new GraphEdge(nodes[1].id, nodes[5].id, 6, 40),
    // new GraphEdge(nodes[1].id, nodes[4].id, 2),
    // new GraphEdge(nodes[2].id, nodes[3].id, 8),
    // new GraphEdge(nodes[3].id, nodes[4].id, 4),
    // new GraphEdge(nodes[5].id, nodes[2].id, 5),
    // new GraphEdge(nodes[5].id, nodes[3].id, 4),
    // new GraphEdge(nodes[5].id, nodes[4].id, 1),
    // new GraphEdge(nodes[1].id, nodes[0].id, 2),
];

// FIXME: refactor graph state to useReducer and actions, move logic out to custom hooks
const DeliveryNetworkView: React.FC = () => {
    const [graph, setGraph] = useState<Graph>({
        nodes,
        edges,
    });
    const [showMaxFlowSolution, setShowMaxFlowSolution] = useState(false);
    const [solutions, setSolutions] = useState<Solutions | null>(null);
    const [selected, setSelected] = useState<GraphNode | GraphEdge | null>(null);

    const updateEntity = (entity: GraphNode | GraphEdge) => {
        if (entity instanceof GraphNode) {
            const newGraph = {
                ...graph,
                nodes: [...graph.nodes.filter(node => node.id !== entity.id)],
            };

            const oldNode = graph.nodes.find(n => n.id === entity.id);

            if (!oldNode)
                return;

            if (oldNode.constructor !== entity.constructor) {
                const invalidEdges = newGraph.edges
                    .filter(edge => edge.target === entity.id || edge.source === entity.id)
                    .map(edge => ({
                        ...edge,
                        source: newGraph.nodes.find(node => node.id === edge.source) ?? entity,
                        target: newGraph.nodes.find(node => node.id === edge.target) ?? entity,
                    }))
                    .filter(({ source, target }) => !isValidEdge(source, target));

                if (invalidEdges.length > 0) {
                    // Nie będę robił interfejsu dla tego jednego okienka dialogowego
                    // eslint-disable-next-line no-alert
                    if (!window.confirm('Zmiana typu węzła spowoduje, że niektóre krawędzie zostaną usunięte. Czy kontynuować?'))
                        return;

                    newGraph.edges = newGraph.edges.filter(edge => !invalidEdges.find(e => e.id === edge.id));
                }

                updateNodeNumbers(oldNode, newGraph.nodes);
                entity.sequenceNumber = getNextSequenceNumberForNodeType(graph.nodes, entity);
            }

            newGraph.nodes.push(entity);

            setGraph(newGraph);
        } else {
            setGraph({
                ...graph,
                edges: [
                    ...graph.edges.filter(edge => edge.id !== entity.id),
                    entity,
                ],
            });
        }
        setSelected(entity);
    };

    const updateGraph = (g: Graph) => {
        setGraph(g);
    };

    return (
        <PageWrapper>
            <PageHeader>Optymalizacja sieci dostaw</PageHeader>
            <PageContent>
                {solutions !== null ? (
                    <React.Fragment>
                        <SolutionButtons>
                            <Button
                                variant="outline-primary"
                                active={!showMaxFlowSolution}
                                onClick={() => {
                                    setSelected(null);
                                    setShowMaxFlowSolution(false);
                                }}
                            >
                                Min. koszt
                            </Button>
                            <Button
                                variant="outline-primary"
                                active={showMaxFlowSolution}
                                onClick={() => {
                                    setSelected(null);
                                    setShowMaxFlowSolution(true);
                                }}
                            >
                                Max. przepływ
                            </Button>
                        </SolutionButtons>
                        <GraphDisplayer
                            graph={!showMaxFlowSolution ? solutions.minCost.graph : solutions.maxFlow.graph}
                            colormap={showMaxFlowSolution ? 'freesurface-blue' : 'freesurface-red'}
                            selected={selected}
                            onSelectionChange={s => setSelected(s)}
                            onReset={() => setSolutions(null)}
                        />
                    </React.Fragment>
                ) : (
                    <GraphEditor
                        graph={graph}
                        onGraphChange={updateGraph}
                        selected={selected}
                        onSelectionChange={s => setSelected(s)}
                        onCalculateClick={async () => {
                            try {
                                setSolutions(await optimize(graph));
                                setSelected(null);
                            } catch (e) {
                                toast.error(e.message);
                            }
                        }}
                    />
                )}
            </PageContent>
            <GraphEntityDetails
                selectedEntity={selected}
                onEntityChange={updateEntity}
                nodes={graph.nodes}
                readOnly={solutions !== null}
                edgeWeightName={solutions !== null ? 'Przepływ' : 'Koszt'}
            />
            {solutions !== null && (
                !showMaxFlowSolution ? (
                    <SolutionDetails>
                        <h5>Minimalizacja kosztów</h5>
                        <b>Koszt: {solutions.minCost.cost}</b>
                        Przepływ: {solutions.minCost.flow}
                    </SolutionDetails>
                ) : (
                    <SolutionDetails>
                        <h5>Maksymalizacja przepływu</h5>
                        Koszt: {solutions.maxFlow.cost}<br />
                        <b>Przepływ: {solutions.maxFlow.flow}</b>
                    </SolutionDetails>
                )
            )}
        </PageWrapper>
    );
};

export default DeliveryNetworkView;
