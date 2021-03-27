import { INode } from 'react-digraph';
import { CustomerNode, GraphNode, SupplierNode } from './GraphNode';

export const updateNodeNumbers = (nodeToDelete: GraphNode, nodes: GraphNode[]) => {
    nodes
        .filter(n => n.constructor === nodeToDelete.constructor)
        .forEach(n => {
            if (n.sequenceNumber > nodeToDelete.sequenceNumber)
                n.sequenceNumber--;
        });
};

export const getNextSequenceNumberForNodeType = (nodes: GraphNode[], nodeType: typeof GraphNode | GraphNode) => (
    Math.max(
        0,
        ...nodes
            .filter(node => (
                typeof nodeType === 'function' ? (
                    node instanceof nodeType
                ) : (
                    node.constructor === nodeType.constructor
                )
            ))
            .map(node => node.sequenceNumber),
    ) + 1
);

export const isValidEdge = (source: INode, target: INode) => !(
    (
        source instanceof SupplierNode && target instanceof SupplierNode
    ) || (
        source instanceof CustomerNode && target instanceof CustomerNode
    )
);
