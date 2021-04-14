import { Supplier, Customer } from './interfaces';

export const initialSuppliers: Supplier[] = [
    {
        supply: 20,
        price: 10,
    },
    {
        supply: 30,
        price: 12,
    },
];

export const initialCustomers: Customer[] = [
    {
        demand: 10,
        price: 30,
    },
    {
        demand: 28,
        price: 25,
    },
    {
        demand: 27,
        price: 30,
    },
];

// export const initialCosts: number[][] = initialSuppliers.map(_ => (
//    new Array(initialCustomers.length).fill(3)
// ));

export const initialCosts: number[][] = [
    [8, 14, 17],
    [12, 9, 19],
];
