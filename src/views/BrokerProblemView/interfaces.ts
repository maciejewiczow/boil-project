import { Matrix } from 'mathjs';

export interface Supplier {
    supply: number;
    price: number;
}

export interface Customer {
    demand: number;
    price: number;
}

export interface DualVariables {
    alphas: number[];
    betas: number[];
}

export interface Results {
    transportTable: number[][];
    totalProfit: number;
}
