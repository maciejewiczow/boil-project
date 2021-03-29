import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { GrAdd } from 'react-icons/gr';
import { BsFillPlayFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { join } from 'path';
import { PageHeader, PageWrapper } from '../PageLayoutParts';
import {
    PageContent,
    PageTextInput,
    PageTextParagraph,
    PageButton,
    CostsWrapper,
    SuppliersWrapper,
    CustomersWrapper,
    Row,
} from './parts';

/*
    dostawcy         odbiorcy
    D1 [] []
    D2 [] []
    D3 [] []
      [+]

    Koszty tras
 */

interface Supplier {
    supply: number;
    price: number;
}

interface Customer {
    demand: number;
    price: number;
}

const initialSuppliers: Supplier[] = [
    {
        supply: 0,
        price: 0,
    },
    {
        supply: 0,
        price: 0,
    },
    {
        supply: 0,
        price: 0,
    },
];

const initialCustomers: Customer[] = [
    {
        demand: 0,
        price: 0,
    },
    {
        demand: 0,
        price: 0,
    },
    {
        demand: 0,
        price: 0,
    },
];

const initialCosts: number[][] = initialSuppliers.map(_ => (
    new Array(initialSuppliers.length).fill(0)
));

const BrokerProblemView: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [costs, setCosts] = useState<number[][]>(initialCosts);

    const addSupplier = () => {
        setSuppliers([
            ...suppliers,
            {
                price: 0,
                supply: 0,
            },
        ]);
        setCosts([
            ...costs,
            new Array(customers.length).fill(0),
        ]);
    };

    const addCustomer = () => {
        setCustomers([
            ...customers,
            {
                price: 0,
                demand: 0,
            },
        ]);
        setCosts(costs.map(row => [...row, 0]));
    };

    return (
        <PageWrapper>
            <PageHeader>Zagadnienie pośrednika</PageHeader>
            <PageContent>
                <SuppliersWrapper>
                    <Row>
                        <div>Dostawca</div> <div>podaż</div> <div>koszt</div>
                    </Row>
                    {suppliers.map(({ price, supply }, index) => (
                        <Row>
                            <span>D {index + 1}</span>
                            <PageTextInput
                                type="number"
                                value={supply}
                                min="0"
                                onChange={e => {
                                    const newArr = [...suppliers];
                                    newArr[index].supply = e.target.valueAsNumber;
                                    setSuppliers(newArr);
                                }}
                            />
                            <PageTextInput
                                type="number"
                                value={price}
                                min="0"
                                onChange={e => {
                                    const newArr = [...suppliers];
                                    newArr[index].price = e.target.valueAsNumber;
                                    setSuppliers(newArr);
                                }}
                            />
                            <Button variant="danger"><AiFillDelete /></Button>
                        </Row>
                    ))}
                    <Row>
                        <Button variant="success" onClick={addSupplier}><GrAdd /></Button>
                    </Row>
                </SuppliersWrapper>
                <CustomersWrapper>
                    <div>Odbiorca popyt cena</div>
                    {customers.map(({ price, demand }, index) => (
                        <Row key={index}>
                            <span>O {index + 1}</span>
                            <PageTextInput
                                type="number"
                                value={demand}
                                min="0"
                                onChange={e => {
                                    const newArr = [...customers];
                                    newArr[index].demand = e.target.valueAsNumber;
                                    setCustomers(newArr);
                                }}
                            />
                            <PageTextInput
                                type="number"
                                value={price}
                                min="0"
                                onChange={e => {
                                    const newArr = [...customers];
                                    newArr[index].price = e.target.valueAsNumber;
                                    setCustomers(newArr);
                                }}
                            />
                        </Row>
                    ))}
                    <Row>
                        <Button variant="success" onClick={addCustomer}><GrAdd /></Button>
                    </Row>
                </CustomersWrapper>
                <CostsWrapper>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <td>bayo yayo</td>
                                {customers.map((c, i) => <td>O {i + 1}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {costs.map((row, i) => (
                                <tr>
                                    <td>D {i + 1}</td>
                                    {row.map((cost, j) => (
                                        <td>
                                            <PageTextInput
                                                type="number"
                                                value={cost}
                                                min="0"
                                                onChange={e => {
                                                    const newArr = [...costs];
                                                    newArr[i][j] = e.target.valueAsNumber;
                                                    setCosts(newArr);
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Row>
                        <Button variant="success"><BsFillPlayFill /></Button>
                    </Row>
                </CostsWrapper>
            </PageContent>
        </PageWrapper>
    );
};

export default BrokerProblemView;
