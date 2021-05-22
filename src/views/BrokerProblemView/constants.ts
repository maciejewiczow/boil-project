import { Supplier, Customer } from './interfaces';

// export const initialSuppliers: Supplier[] = [
//     {
//         supply: 10,
//         price: 6,
//     },
//     {
//         supply: 30,
//         price: 9,
//     },
// ];

// export const initialCustomers: Customer[] = [
//     {
//         demand: 10,
//         price: 15,
//     },
//     {
//         demand: 10,
//         price: 14,
//     },
//     {
//         demand: 11,
//         price: 16,
//     },
// ];

// export const initialCosts: number[][] = [
//     [4, 7, 2],
//     [8, 10, 4],
// ];

// export const initialSuppliers: Supplier[] = [
//     {
//         supply: 20,
//         price: 10,
//     },
//     {
//         supply: 30,
//         price: 12,
//     },
// ];

// export const initialCustomers: Customer[] = [
//     {
//         demand: 20,
//         price: 60,
//     },
//     {
//         demand: 28,
//         price: 25,
//     },
//     {
//         demand: 27,
//         price: 30,
//     },
// ];

// export const initialCosts: number[][] = [
//     [8, 14, 17],
//     [12, 9, 19],
// ];

export const initialSuppliers: Supplier[] = [
    {
        price: 0,
        supply: 0,
    },
    {
        price: 0,
        supply: 0,
    },
];
export const initialCustomers: Customer[] = [
    {
        price: 0,
        demand: 0,
    },
    {
        price: 0,
        demand: 0,
    },
    {
        price: 0,
        demand: 0,
    },
];

export const initialCosts: number[][] = initialSuppliers.map(_ => (
    new Array(initialCustomers.length).fill(0)
));
