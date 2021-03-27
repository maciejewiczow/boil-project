import React from 'react';
import Form from 'react-bootstrap/Form';
import { GraphEdge } from '../GraphEdge';
import { GraphNode } from '../GraphNode';
import { Arrow, FormWrapper, Subtitle, Title } from './parts';

interface GraphEdgeDetailsProps {
    selectedEdge: GraphEdge;
    onEdgeChange: (edge: GraphEdge) => void;
    nodes: GraphNode[];
}

export const GraphEdgeDetails: React.FC<GraphEdgeDetailsProps> = ({ nodes, selectedEdge, onEdgeChange }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
    }, [selectedEdge.id]);

    const sourceNode = React.useMemo(() => nodes.find(n => n.id === selectedEdge.source), [nodes, selectedEdge.source]);
    const targetNode = React.useMemo(() => nodes.find(n => n.id === selectedEdge.target), [nodes, selectedEdge.target]);

    if (!sourceNode || !targetNode)
        return null;

    const updateEdge = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdgeChange(
            Object.assign(
                selectedEdge,
                { weight: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber },
            ),
        );
    };

    return (
        <React.Fragment>
            <Subtitle>Trasa</Subtitle>
            <Title>{sourceNode.title} <Arrow /> {targetNode.title}</Title>
            <FormWrapper>
                <Form.Group controlId="edgeWeight">
                    <Form.Label>Koszt</Form.Label>
                    <Form.Control
                        ref={inputRef}
                        type="number"
                        min="0"
                        value={selectedEdge.weight}
                        onChange={updateEdge}
                    />
                </Form.Group>
            </FormWrapper>
        </React.Fragment>
    );
};
