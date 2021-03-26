import React from 'react';
import { BrokerNode, CustomerNode, GraphNode, SupplierNode } from '../GraphNode';
import { Wrapper, NodeTypeText, Name, NodeValue } from './parts';

interface GraphNodeProps {
    className?: string;
    node: GraphNode;
    id: string | number;
    isSelected: boolean;
}

const GraphNodeContent: React.FC<GraphNodeProps> = ({
    node,
    className,
    isSelected,
}) => (
    <Wrapper className={className} isSelected={isSelected}>
        <NodeTypeText y="-25">
            {node instanceof SupplierNode && 'Dostawca'}
            {node instanceof CustomerNode && 'Odbiorca'}
            {node instanceof BrokerNode && 'Pośrednik'}
        </NodeTypeText>
        <Name>{node.title}</Name>
        <NodeValue y="25">
            {node instanceof SupplierNode && <>Podaż: {node.supply}</>}
            {node instanceof CustomerNode && <>Popyt: {node.demand}</>}
        </NodeValue>
    </Wrapper>
);

export default GraphNodeContent;
