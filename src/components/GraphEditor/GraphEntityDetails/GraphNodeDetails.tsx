import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import { BrokerNode, CustomerNode, GraphNode, SupplierNode } from '../GraphNode';
import { FormWrapper, Subtitle, Title } from './parts';

interface GraphNodeDetailsProps {
    selectedNode: GraphNode;
    onNodeChange: (node: GraphNode) => void;
    readOnly?: boolean;
}

export const GraphNodeDetails: React.FC<GraphNodeDetailsProps> = ({ selectedNode, onNodeChange, readOnly = false }) => {
    const inputRef = React.useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (!readOnly)
            inputRef.current?.focus();
    }, [selectedNode.id, readOnly]);

    const updateNodeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let newNode: GraphNode;
        switch (e.target.value) {
            case BrokerNode.name:
                newNode = new BrokerNode(0);
                break;
            case CustomerNode.name:
                newNode = new CustomerNode(0, 0);
                break;
            case SupplierNode.name:
                newNode = new SupplierNode(0, 0);
                break;
            default:
                return;
        }

        onNodeChange(Object.assign(newNode, selectedNode));
    };

    const updateCustomerNodeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const demand = Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

        onNodeChange(
            Object.assign(
                new CustomerNode(0, 0),
                selectedNode,
                { demand },
            ),
        );
    };

    const updateSupplierNodeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const supply = Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

        onNodeChange(
            Object.assign(
                new SupplierNode(0, 0),
                selectedNode,
                { supply },
            ),
        );
    };

    return (
        <React.Fragment>
            <Subtitle>Węzeł</Subtitle>
            <Title>{selectedNode.typeName} {selectedNode.sequenceNumber}</Title>
            <FormWrapper>
                <FormGroup controlId="nodeType">
                    <Form.Label>Typ węzła</Form.Label>
                    <Form.Control disabled={readOnly} readOnly={readOnly} ref={inputRef} as="select" value={selectedNode.constructor.name} onChange={updateNodeType}>
                        <option value={SupplierNode.name}>Dostawca</option>
                        <option value={BrokerNode.name}>Pośrednik</option>
                        <option value={CustomerNode.name}>Odbiorca</option>
                    </Form.Control>
                </FormGroup>
                {selectedNode instanceof BrokerNode || (
                    <FormGroup controlId="nodeValue">
                        {selectedNode instanceof SupplierNode && (
                            <React.Fragment>
                                <Form.Label>Podaż</Form.Label>
                                <Form.Control disabled={readOnly} readOnly={readOnly} type="number" min="0" value={selectedNode.supply} onChange={updateSupplierNodeValue} />
                            </React.Fragment>
                        )}
                        {selectedNode instanceof CustomerNode && (
                            <React.Fragment>
                                <Form.Label>Popyt</Form.Label>
                                <Form.Control disabled={readOnly} readOnly={readOnly} type="number" min="0" value={selectedNode.demand} onChange={updateCustomerNodeValue} />
                            </React.Fragment>
                        )}
                    </FormGroup>
                )}
            </FormWrapper>
        </React.Fragment>
    );
};
