import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { GraphEdge } from '../GraphEdge';
import { GraphNode } from '../GraphNode';
import {
    AddConstraintsWrapper,
    Arrow,
    ConstraintsHeader,
    ConstraintsText,
    FormWrapper,
    Subtitle,
    Title,
} from './parts';

interface GraphEdgeDetailsProps {
    selectedEdge: GraphEdge;
    onEdgeChange: (edge: GraphEdge) => void;
    nodes: GraphNode[];
    readOnly?: boolean;
    edgeWeightName?: string;
}

export const GraphEdgeDetails: React.FC<GraphEdgeDetailsProps> = ({ nodes, selectedEdge, onEdgeChange, readOnly = false, edgeWeightName = 'Koszt' }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showFlowConstraints, setShowFlowConstraints] = useState(false);

    React.useEffect(() => {
        if (!readOnly) {
            inputRef.current?.focus();
            setShowFlowConstraints(false);
        }
    }, [selectedEdge.id, readOnly]);

    const sourceNode = React.useMemo(() => nodes.find(n => n.id === selectedEdge.source), [nodes, selectedEdge.source]);
    const targetNode = React.useMemo(() => nodes.find(n => n.id === selectedEdge.target), [nodes, selectedEdge.target]);

    if (!sourceNode || !targetNode)
        return null;

    const updateEdgeWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdgeChange(
            Object.assign(
                selectedEdge,
                { weight: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber },
            ),
        );
    };

    const updateEdgeMinFlow = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEdge = Object.assign(
            selectedEdge,
            { min: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber },
        );

        if (newEdge.max !== undefined && newEdge.min > newEdge.max)
            newEdge.min = newEdge.max;

        onEdgeChange(newEdge);
    };

    const updateEdgeMaxFlow = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEdge = Object.assign(
            selectedEdge,
            { max: Number.isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber },
        );

        if (newEdge.max !== undefined && newEdge.min > newEdge.max)
            newEdge.max = newEdge.min;

        onEdgeChange(newEdge);
    };

    return (
        <React.Fragment>
            <Subtitle>Trasa</Subtitle>
            <Title>{sourceNode.title} <Arrow /> {targetNode.title}</Title>
            <FormWrapper>
                <Form.Group controlId="edgeWeight">
                    <Form.Label>{edgeWeightName}</Form.Label>
                    <Form.Control
                        ref={inputRef}
                        type="number"
                        min="0"
                        value={selectedEdge.weight}
                        onChange={updateEdgeWeight}
                        disabled={readOnly}
                        readOnly={readOnly}
                    />
                </Form.Group>
                {((selectedEdge.min === 0 && selectedEdge.max === undefined) && !showFlowConstraints) ? (
                    !readOnly && (
                        <AddConstraintsWrapper>
                            <ConstraintsText>Ogranicz przepływ</ConstraintsText>
                            <Button variant="outline-success" onClick={() => setShowFlowConstraints(true)}>+</Button>
                        </AddConstraintsWrapper>
                    )
                ) : (
                    <React.Fragment>
                        <ConstraintsHeader>Ograniczenia przepływu</ConstraintsHeader>
                        <Form.Group controlId="minFlow">
                            <Form.Label>Minimalny</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={selectedEdge.min}
                                onChange={updateEdgeMinFlow}
                                disabled={readOnly}
                                readOnly={readOnly}
                            />
                        </Form.Group>
                        <Form.Group controlId="maxFlow">
                            <Form.Label>Maksymalny</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={selectedEdge.max}
                                onChange={updateEdgeMaxFlow}
                                disabled={readOnly}
                                readOnly={readOnly}
                            />
                        </Form.Group>
                    </React.Fragment>
                )}
            </FormWrapper>
        </React.Fragment>
    );
};
