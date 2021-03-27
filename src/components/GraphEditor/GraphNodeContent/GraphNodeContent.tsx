import React from 'react';
import { CustomerNode, GraphNode, SupplierNode } from '../GraphNode';
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
            {node.typeName}
        </NodeTypeText>
        <Name>{node.title}</Name>
        <NodeValue y="25">
            {node instanceof SupplierNode && <React.Fragment>Podaż: {node.supply}</React.Fragment>}
            {node instanceof CustomerNode && <React.Fragment>Popyt: {node.demand}</React.Fragment>}
        </NodeValue>
    </Wrapper>
);

export default GraphNodeContent;
