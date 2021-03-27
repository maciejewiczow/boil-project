import React from 'react';
import { GraphEdge } from '../GraphEdge';
import { GraphNode } from '../GraphNode';
import { GraphEdgeDetails } from './GraphEdgeDetails';
import { GraphNodeDetails } from './GraphNodeDetails';
import { Wrapper } from './parts';

interface GraphEntityDetailsProps {
    className?: string;
    selectedEntity: GraphNode | GraphEdge | null;
    nodes: GraphNode[];
    onEntityChange: (entity: GraphNode | GraphEdge) => void;
}

export const GraphEntityDetails: React.FC<GraphEntityDetailsProps> = ({ className, nodes, selectedEntity, onEntityChange }) => {
    if (selectedEntity === null)
        return null;

    return (
        <Wrapper className={className}>
            {selectedEntity instanceof GraphEdge ? (
                <GraphEdgeDetails
                    selectedEdge={selectedEntity}
                    onEdgeChange={onEntityChange}
                    nodes={nodes}
                />
            ) : (
                <GraphNodeDetails
                    selectedNode={selectedEntity}
                    onNodeChange={onEntityChange}
                />
            )}
        </Wrapper>
    );
};
