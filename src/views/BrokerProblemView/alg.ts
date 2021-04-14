import { matrix, zeros } from 'mathjs';
import { Supplier, Customer } from './interfaces';

export const isBalanced = (suppliers: Supplier[], customers: Customer[]) => {
    const totalSupply = suppliers.map(s => s.supply).reduce((a, b) => a + b);
    const totalDemand = customers.map(s => s.demand).reduce((a, b) => a + b);
    return totalDemand === totalSupply;
};

const generateProfitTable = (suppliers: Supplier[], customers: Customer[], costs: number[][]) => {
    const profitTable = zeros(suppliers.length, customers.length);
    return profitTable.map((value:any, [i, j]:any) => customers[j].price - costs[i][j] - suppliers[i].price);
};

export const script = (suppliers: Supplier[], customers: Customer[], costs:number[][]) => {
    const localCustomers = [...customers];
    const localSuppliers = [...suppliers];

    console.log(suppliers, customers, costs);
    console.log(isBalanced(suppliers, customers));
    if (!isBalanced(suppliers, customers)) {
        localSuppliers.push({
            price: 0,
            supply: customers.map(s => s.demand).reduce((a, b) => a + b),
        });
        localCustomers.push({
            price: 0,
            demand: suppliers.map(s => s.supply).reduce((a, b) => a + b),
        });
    }
    const profitTable = generateProfitTable(suppliers, customers, costs);
    console.log(profitTable);
};
