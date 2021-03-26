import { GraphEdge } from './GraphEdge';
import { GraphNode } from './GraphNode';

export interface Graph {
    edges: GraphEdge[];
    nodes: GraphNode[];
}

export interface GraphEditorProps {
    className?: string;
    graph: Graph;
    onGraphChange: (graph: Graph) => void;
    selected: GraphNode | GraphEdge | null;
    onSelectionChange: (selected: GraphNode | GraphEdge | null) => void;
}
