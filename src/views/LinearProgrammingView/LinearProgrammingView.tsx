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
import { GraphEntityDetails, PageContent, PageWrapper } from './parts';

const nodes: GraphNode[] = [
    new SupplierNode(2137, 1, 0, 0),
    new SupplierNode(300, 2, 0, 150),
    new SupplierNode(500, 3, 0, 300),
    new CustomerNode(300, 1, 700, 0),
    new CustomerNode(200, 2, 700, 150),
    new CustomerNode(400, 3, 700, 300),
    new BrokerNode(1, 350, 150),
];

const edges: GraphEdge[] = [
    new GraphEdge(nodes[0].id, nodes[6].id, 400),
    new GraphEdge(nodes[1].id, nodes[6].id, 300),
    new GraphEdge(nodes[2].id, nodes[6].id, 5600),
    new GraphEdge(nodes[3].id, nodes[6].id, 400),
    new GraphEdge(nodes[4].id, nodes[6].id, 10),
    new GraphEdge(nodes[5].id, nodes[6].id, 4300),
    new GraphEdge(nodes[0].id, nodes[3].id, 20),
    new GraphEdge(nodes[2].id, nodes[5].id, 40),
];

// FIXME: refactor graph state to useReducer and actions, move logic out to custom hooks
const LinearProgrammingView: React.FC = () => {
    const [graph, setGraph] = useState<Graph>({
        nodes,
        edges,
    });
    const [selected, setSelected] = useState<GraphNode | GraphEdge | null>(null);

    const updateEntity = (entity: GraphNode | GraphEdge) => {
        console.log('entity updated', entity);

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
                    console.log('Edges to delete', invalidEdges);
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

    return (
        <PageWrapper>
            <PageHeader>Grafowanie</PageHeader>
            <PageContent>
                <GraphEditor
                    graph={graph}
                    onGraphChange={g => setGraph(g)}
                    selected={selected}
                    onSelectionChange={s => setSelected(s)}
                />
            </PageContent>
            <GraphEntityDetails
                selectedEntity={selected}
                onEntityChange={updateEntity}
                nodes={graph.nodes}
            />
        </PageWrapper>
    );
};

export default LinearProgrammingView;
