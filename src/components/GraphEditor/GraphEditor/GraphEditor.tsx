import React, { useState } from 'react';
import { GraphView, IEdge, INode } from 'react-digraph';
import { GraphEditorProps } from '../constants';
import GraphNodeContent from '../GraphNodeContent/GraphNodeContent';
import { GraphEdge } from '../GraphEdge';
import { BrokerNode, GraphNode } from '../GraphNode';
import { HelpTooltip } from '../HelpTooltip/HelpTooltip';
import { Wrapper, GraphClickWrapper, EdgeTip, SelectedEdgeTip } from './parts';
import { getNextSequenceNumberForNodeType, isValidEdge, updateNodeNumbers as updateNodeNumbersAfterDeletion } from '../utils';

const GraphEditor: React.FC<GraphEditorProps> = ({ graph, onGraphChange, selected, onSelectionChange }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const selectNode = (node: INode | null) => {
        console.log('node selected', node);
        onSelectionChange(node as GraphNode | null);
    };

    const selectEdge = (edge: IEdge | null) => {
        console.log('edge selected', edge);
        onSelectionChange(edge as GraphEdge | null);
    };

    const addNode = (x: number, y: number) => {
        console.log(`node created at ${x}, ${y}`);

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
        console.log(`node ${id} deleted`);

        const nodeToDelete = graph.nodes.find(n => n.id === id);

        if (!nodeToDelete)
            return;

        const newGraph = {
            ...graph,
            nodes: graph.nodes.filter(node => node.id !== id),
        };

        updateNodeNumbersAfterDeletion(nodeToDelete, graph.nodes);

        onGraphChange(newGraph);
    };

    const addEdge = (source: INode, target: INode) => {
        if (!isValidEdge(source, target))
            return;

        console.log(`Edge from ${source.id} to ${target.id}`);

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
        console.log('edge deleted', edge);

        onGraphChange({
            ...graph,
            edges: graph.edges.filter(e => e.id !== edge.id),
        });
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
                    showGraphControls={false}
                    rotateEdgeHandle={false}
                    maxZoom={20}
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
                                <symbol viewBox="0 0 70 25" id="defaultEdge" key="0">
                                    <rect x="0" y="0" width="70" height="25" fill="currentColor" />
                                </symbol>
                            ),
                        },
                    }}
                    nodeSubtypes={{
                        none: {
                            shapeId: '',
                            // used to add additional items to <defs>
                            shape: (
                                <React.Fragment>
                                    <marker id="end-no-arrow" viewBox="0 -4 8 8" refX="4" markerWidth="8" markerHeight="8" orient="auto">
                                        <EdgeTip d="M0,0L8,0" width="10" height="8" />
                                    </marker>
                                    <marker id="end-no-arrow-selected" viewBox="0 -4 8 8" refX="4" markerWidth="8" markerHeight="8" orient="auto">
                                        <SelectedEdgeTip d="M0,0L8,0" width="10" height="8" />
                                    </marker>
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            </GraphClickWrapper>
        </Wrapper>
    );
};

export default GraphEditor;