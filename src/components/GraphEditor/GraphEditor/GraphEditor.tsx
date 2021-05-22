import React, { useState } from 'react';
import { GraphView, IEdge, INode } from 'react-digraph';
import { BsChevronRight } from 'react-icons/bs';
import { GraphEditorProps } from '../constants';
import GraphNodeContent from '../GraphNodeContent/GraphNodeContent';
import { GraphEdge } from '../GraphEdge';
import { BrokerNode, GraphNode } from '../GraphNode';
import { HelpTooltip } from '../HelpTooltip/HelpTooltip';
import { Wrapper, GraphClickWrapper, GoButton } from './parts';
import { getNextSequenceNumberForNodeType, isValidEdge, updateNodeNumbers as updateNodeNumbersAfterDeletion } from '../utils';

const GraphEditor: React.FC<GraphEditorProps> = ({ graph, onGraphChange, selected, onSelectionChange, onCalculateClick }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const selectNode = (node: INode | null) => {
        onSelectionChange(node as GraphNode | null);
    };

    const selectEdge = (edge: IEdge | null) => {
        onSelectionChange(edge as GraphEdge | null);
    };

    const addNode = (x: number, y: number) => {
        const sequenceNum = getNextSequenceNumberForNodeType(graph.nodes, BrokerNode);

        const newNode = new BrokerNode(sequenceNum, x, y);

        onGraphChange({
            ...graph,
            nodes: [
                ...graph.nodes,
                newNode,
            ],
        });
        onSelectionChange(newNode);
    };

    const deleteNode = (id: string) => {
        const nodeToDelete = graph.nodes.find(n => n.id === id);

        if (!nodeToDelete)
            return;

        const newGraph = {
            edges: graph.edges.filter(edge => edge.target !== id && edge.source !== id),
            nodes: graph.nodes.filter(node => node.id !== id),
        };

        updateNodeNumbersAfterDeletion(nodeToDelete, newGraph.nodes);

        onGraphChange(newGraph);
        onSelectionChange(null);
    };

    const addEdge = (source: INode, target: INode) => {
        if (!isValidEdge(source, target))
            return;

        const newEdge = new GraphEdge(source.id, target.id, 0);

        onGraphChange({
            ...graph,
            edges: [
                ...graph.edges,
                newEdge,
            ],
        });
        onSelectionChange(newEdge);
    };

    const deleteEdge = (edge: IEdge) => {
        onGraphChange({
            ...graph,
            edges: graph.edges.filter(e => e.id !== edge.id),
        });
        onSelectionChange(null);
    };

    return (
        <Wrapper>
            <HelpTooltip isTootlipOpen={isHelpOpen} onIconClick={() => setIsHelpOpen(prev => !prev)} />
            <GraphClickWrapper onClick={() => setIsHelpOpen(false)}>
                <GraphView
                    nodeKey="id"
                    nodes={graph.nodes}
                    edges={graph.edges}
                    selected={selected}
                    onSelectNode={selectNode}
                    onCreateNode={addNode}
                    onDeleteNode={(_, id, __) => deleteNode(id)}
                    onSelectEdge={selectEdge}
                    onCreateEdge={addEdge}
                    onDeleteEdge={deleteEdge}
                    renderNodeText={(data, id, isSelected) => <GraphNodeContent node={data} id={id} isSelected={isSelected} />}
                    rotateEdgeHandle={false}
                    showGraphControls={false}
                    canSwapEdge={() => false}
                    nodeTypes={{
                        default: {
                            shapeId: '#defaultNode',
                            shape: (
                                <symbol viewBox="0 0 100 100" width="100" height="100" id="defaultNode">
                                    <circle cx="50" cy="50" r="48" />
                                </symbol>
                            ),
                        },
                    }}
                    edgeTypes={{
                        default: {
                            shapeId: '#defaultEdge',
                            shape: (
                                <symbol viewBox="0 0 70 30" id="defaultEdge" key="0">
                                    <rect x="0" y="0" width="70" height="30" fill="currentColor" />
                                </symbol>
                            ),
                        },
                    }}
                    nodeSubtypes={{
                        none: {
                            shapeId: '',
                            // used as a way to insert things into <defs>
                            shape: (
                                <marker id="end-arrow-not-selected" viewBox="0 -4 8 8" refX="4" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,-4L8,0L0,4" width="8" height="8" />
                                </marker>
                            ),
                        },
                    }}
                />
                <GoButton
                    variant="primary"
                    disabled={!(graph.nodes.length > 0 && graph.edges.length > 0)}
                    onClick={onCalculateClick}
                >
                    Optymalizuj <BsChevronRight />
                </GoButton>
            </GraphClickWrapper>
        </Wrapper>
    );
};

export default GraphEditor;
