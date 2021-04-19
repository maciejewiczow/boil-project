import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsFillPlayFill } from 'react-icons/bs';
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import Table from 'react-bootstrap/Table';
import { PageHeader, PageWrapper } from '../PageLayoutParts';
import { Supplier, Customer, Results } from './interfaces';
import { initialSuppliers, initialCustomers, initialCosts } from './constants';
import { calculateOptimalTransportTable } from './alg';
import {
    PageContent,
    CostsWrapper,
    SuppliersWrapper,
    CustomersWrapper,
    ResultsWrapper,
    TableInput,
    GridCell,
    StickyGridCell,
    SubmitArea,
    ScrollTable,
    SectionHeader,
    ProfitWrapper,
    ProfitLabel,
    ProfitText,
    SectionHeaderText,
} from './parts';

const BrokerProblemView: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [costs, setCosts] = useState<number[][]>(initialCosts);
    const [results, setResults] = useState<Results | undefined>(undefined);

    const updateSupplier = (index: number, prop: keyof Supplier) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newArr = [...suppliers];
        newArr[index][prop] = e.target.valueAsNumber;
        setSuppliers(newArr);
    };

    const updateCustomer = (index: number, prop: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newArr = [...customers];
        newArr[index][prop] = e.target.valueAsNumber;
        setCustomers(newArr);
    };

    const updateCosts = (i: number, j: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newArr = [...costs];
        newArr[i][j] = e.target.valueAsNumber;
        setCosts(newArr);
    };

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

    const removeCutomer = (index: number) => () => {
        setCustomers([...customers.filter((_, i) => i !== index)]);
        setCosts(costs.map(row => row.filter((_, i) => i !== index)));
    };

    const removeSupplier = (index: number) => () => {
        setSuppliers([...suppliers.filter((_, i) => i !== index)]);
        setCosts([...costs.filter((_, i) => i !== index)]);
    };

    return (
        <PageWrapper>
            <PageHeader>Zagadnienie pośrednika</PageHeader>
            <PageContent>
                <SuppliersWrapper>
                    <SectionHeader><SectionHeaderText>Dostawcy</SectionHeaderText></SectionHeader>
                    <ScrollTable>
                        <StickyGridCell col={1}>Dostawca</StickyGridCell>
                        <StickyGridCell col={2}>Podaż</StickyGridCell>
                        <StickyGridCell col={3}>Cena kupna</StickyGridCell>
                        <StickyGridCell col={4}>
                            <Button variant="success" onClick={addSupplier}><AiOutlinePlusCircle /></Button>
                        </StickyGridCell>
                        {suppliers.map(({ price, supply }, index) => (
                            <React.Fragment key={index}>
                                <GridCell col={1}>D {index + 1}</GridCell>
                                <GridCell col={2}>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={supply}
                                        onChange={updateSupplier(index, 'supply')}
                                    />
                                </GridCell>
                                <GridCell col={3}>
                                    <Form.Control
                                        type="number"
                                        value={price}
                                        min="0"
                                        onChange={updateSupplier(index, 'price')}
                                    />
                                </GridCell>
                                <GridCell col={4}>
                                    {suppliers.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            onClick={removeSupplier(index)}
                                            tabIndex={-1}
                                        >
                                            <AiFillDelete />
                                        </Button>
                                    )}
                                </GridCell>
                            </React.Fragment>
                        ))}
                    </ScrollTable>
                </SuppliersWrapper>
                <CustomersWrapper>
                    <SectionHeader><SectionHeaderText>Odbiorcy</SectionHeaderText></SectionHeader>
                    <ScrollTable>
                        <StickyGridCell col={1}>Odbiorca</StickyGridCell>
                        <StickyGridCell col={2}>Popyt</StickyGridCell>
                        <StickyGridCell col={3}>Cena sprzedaży</StickyGridCell>
                        <StickyGridCell col={4}>
                            <Button variant="success" onClick={addCustomer}><AiOutlinePlusCircle /></Button>
                        </StickyGridCell>
                        {customers.map(({ price, demand }, index) => (
                            <React.Fragment key={index}>
                                <GridCell col={1}>O {index + 1}</GridCell>
                                <GridCell col={2}>
                                    <Form.Control
                                        type="number"
                                        value={demand}
                                        min="0"
                                        onChange={updateCustomer(index, 'demand')}
                                    />
                                </GridCell>
                                <GridCell col={3}>
                                    <Form.Control
                                        type="number"
                                        value={price}
                                        min="0"
                                        onChange={updateCustomer(index, 'price')}
                                    />
                                </GridCell>
                                <GridCell col={4}>
                                    {customers.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            onClick={removeCutomer(index)}
                                            tabIndex={-1}
                                        >
                                            <AiFillDelete />
                                        </Button>
                                    )}
                                </GridCell>
                            </React.Fragment>
                        ))}
                    </ScrollTable>
                </CustomersWrapper>
                <CostsWrapper>
                    <SectionHeader><SectionHeaderText>Koszty</SectionHeaderText></SectionHeader>
                    <Table bordered striped cellPadding="0">
                        <thead>
                            <tr>
                                <th />
                                {customers.map((_, i) => <th>O {i + 1}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {costs.map((row, i) => (
                                <tr>
                                    <th>D {i + 1}</th>
                                    {row.map((cost, j) => (
                                        <td>
                                            <TableInput
                                                type="number"
                                                value={cost}
                                                min="0"
                                                onChange={updateCosts(i, j)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CostsWrapper>
                <SubmitArea>
                    <Button
                        variant="success"
                        onClick={() => setResults(calculateOptimalTransportTable(suppliers, customers, costs))}
                    >
                        Oblicz <BsFillPlayFill />
                    </Button>
                </SubmitArea>
                {results && (
                    <ResultsWrapper>
                        <SectionHeader>
                            <SectionHeaderText>
                                Wynik
                            </SectionHeaderText>
                            <ProfitWrapper>
                                <ProfitLabel>Zysk</ProfitLabel>
                                <ProfitText>{results.totalProfit}</ProfitText>
                            </ProfitWrapper>
                        </SectionHeader>
                        <Table bordered striped cellPadding="0">
                            <thead>
                                <tr>
                                    <th />
                                    {customers.map((_, i) => <th>O {i + 1}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {results.transportTable.map((row, i) => (
                                    <tr>
                                        <th>D {i + 1}</th>
                                        {row.map(value => (<td>{value}</td>))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ResultsWrapper>
                )}
            </PageContent>
        </PageWrapper>
    );
};

export default BrokerProblemView;
