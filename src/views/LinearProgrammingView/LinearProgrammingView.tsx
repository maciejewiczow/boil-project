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
import { GraphEntityDetails, PageContent, PageWrapper } from './parts';

const nodes: GraphNode[] = [
    new SupplierNode(2137, 1, 0, 0),
    new SupplierNode(300, 2, 0, 150),
    new SupplierNode(500, 1, 0, 300),
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

const LinearProgrammingView: React.FC = () => {
    const [graph, setGraph] = useState<Graph>({
        nodes,
        edges,
    });
    const [selected, setSelected] = useState<GraphNode | GraphEdge | null>(null);

    const updateEntity = (entity: GraphNode | GraphEdge | null) => {

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
        </PageWrapper>
    );
};

export default LinearProgrammingView;
