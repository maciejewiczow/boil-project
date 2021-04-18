import {
    zeros,
    map,
    matrix,
    Matrix,
    subset,
    index,
    range,
    lusolve,
    squeeze,
    sum,
    dotMultiply,
} from 'mathjs';
import cloneDeep from 'lodash/cloneDeep';
import { Supplier, Customer, DualVariables, Results } from './interfaces';

const isBalanced = (suppliers: Supplier[], customers: Customer[]) => {
    const totalSupply = suppliers.map(s => s.supply).reduce((a, b) => a + b);
    const totalDemand = customers.map(s => s.demand).reduce((a, b) => a + b);
    return totalDemand === totalSupply;
};

const getOptimalityFactor = (profitTable: Matrix, dualVariables: DualVariables) => (
    map(
        matrix(zeros(profitTable.size())),
        (_, [i, j]: [number, number]) => profitTable.get([i, j]) - dualVariables.alphas[i] - dualVariables.betas[j],
    )
);

const generateProfitTable = (suppliers: Supplier[], customers: Customer[], costs: Matrix) => (
    map(
        zeros(suppliers.length, customers.length) as Matrix,
        (_, [i, j]: [number, number]) => customers[j].price - costs.get([i, j]) - suppliers[i].price,
    )
);

const findAndApplyCycle = (solution: Matrix, deltas: Matrix) => {
    const sortedDeltas = (deltas.toArray() as number[][])
        .flatMap((row, i) => row.map((value, j) => ({ value, i, j })))
        .filter(v => v.value > 0)
        .sort((a, b) => b.value - a.value);

    const solutionArray = solution.toArray() as number[][];
    const deltasArray = deltas.toArray() as number[][];

    const [rows, cols] = deltas.size();
    for (const delta of sortedDeltas) {
        for (let i = 0; i < rows; i++) {
            if (deltasArray[i][delta.j] !== 0) {
                for (let j = 0; j < cols; j++) {
                    if (deltasArray[i][j] === 0 && deltasArray[delta.i][j] === 0) {
                        const value = Math.min(solutionArray[i][delta.j], solutionArray[delta.i][j]);

                        solutionArray[i][delta.j] -= value;
                        solutionArray[delta.i][j] -= value;
                        solutionArray[delta.i][delta.j] += value;
                        solutionArray[i][j] += value;

                        console.log(`Znaleziono cykl: (${delta.i}, ${delta.j}) -> (${delta.i}, ${j}) -> (${i}, ${j}) -> (${i}, ${delta.j})`);

                        return matrix(solutionArray);
                    }
                }
            }
        }
    }

    console.warn('No cycle was found!');
    return matrix(solutionArray);
};

const isSolutionOptimal = (deltas: Matrix) => {
    let isOptimal = true;
    deltas.forEach(value => {
        if (value > 0)
            isOptimal = false;
    });
    return isOptimal;
};

const generateInitialSolution = (suppliers: Supplier[], customers: Customer[], profitsTable: Matrix, balanced: boolean) => {
    const localSuppliers = cloneDeep(suppliers);
    const localCustomers = cloneDeep(customers);
    const profits = profitsTable.clone();
    const solution = zeros(suppliers.length, localCustomers.length) as Matrix;

    if (!balanced) {
        profits.resize([suppliers.length - 1, localCustomers.length - 1]);
        profits.resize([suppliers.length, localCustomers.length], -Infinity);
    }

    const sortedProfits = (profits.toArray() as number[][])
        .flatMap((row, i) => row.map((value, j) => ({ value, i, j })))
        .sort((a, b) => b.value - a.value);

    for (const profit of sortedProfits) {
        if (localCustomers.reduce((total, b) => total + b.demand, 0) === 0 || suppliers.reduce((total, b) => total + b.supply, 0) === 0)
            break;

        if (suppliers[profit.i].supply > 0 && localCustomers[profit.j].demand > 0) {
            const routeValue = Math.min(localSuppliers[profit.i].supply, localCustomers[profit.j].demand);

            localSuppliers[profit.i].supply -= routeValue;
            localCustomers[profit.j].demand -= routeValue;
            solution.set([profit.i, profit.j], routeValue);
        }
    }

    return solution;
};

const calculateDualVariables = (suppliers: Supplier[], customers: Customer[], transportTable: Matrix, profits: Matrix): DualVariables => {
    const size = suppliers.length + customers.length - 1;
    const transportArr = transportTable.toArray() as number[][];

    let A = zeros(size, size + 1) as Matrix;

    let currentRow = 0;
    transportTable.forEach((val: any, [i, j]: any) => {
        if (val > 0) {
            A.set([currentRow, i], 1); // alpha
            A.set([currentRow, suppliers.length + j], 1); // beta
            currentRow++;
        }
    });

    const B = transportArr
        .flatMap((row, i) => (
            row.map((val, j) => (val > 0 ? profits.get([i, j]) : undefined))
        ))
        .filter(val => val !== undefined);

    console.assert(B.length === size);

    const [rows, cols] = A.size();
    A = subset(A, index(range(0, rows), range(1, cols)));

    const x = squeeze(lusolve(A, B) as Matrix).toArray() as number[];

    return {
        alphas: [0, ...x.slice(0, suppliers.length - 1)],
        betas: x.slice(suppliers.length - 1),
    };
};

export const calculateOptimalTransportTable = (suppliers: Supplier[], customers: Customer[], costs: number[][]): Results => {
    const localCustomers = cloneDeep(customers);
    const localSuppliers = cloneDeep(suppliers);
    const localCosts = matrix(cloneDeep(costs));
    const balanced = isBalanced(suppliers, customers);

    const profitTable = generateProfitTable(localSuppliers, localCustomers, localCosts);

    console.log('Zyski');
    console.table(profitTable.toArray());

    if (!balanced) {
        localSuppliers.push({
            price: 0,
            supply: customers.reduce((total, b) => total + b.demand, 0),
        });
        localCustomers.push({
            price: 0,
            demand: suppliers.reduce((total, b) => total + b.supply, 0),
        });
        localCosts.resize([localSuppliers.length, localCustomers.length], 0);
        profitTable.resize([localSuppliers.length, localCustomers.length], 0);
    }

    let transportTable = generateInitialSolution(localSuppliers, localCustomers, profitTable, balanced);

    let i = 1;
    do {
        console.groupCollapsed(`Iteracja ${i}`);
        console.table(transportTable.toArray());

        const dualVariables = calculateDualVariables(localSuppliers, localCustomers, transportTable, profitTable);
        console.log('Alfa beta', dualVariables);

        const deltas = getOptimalityFactor(profitTable, dualVariables);
        console.log('Delty', deltas);

        if (isSolutionOptimal(deltas))
            break;

        transportTable = findAndApplyCycle(transportTable, deltas);
        console.groupEnd();
        i++;
        if (i > 1000)
            break;
    // eslint-disable-next-line no-constant-condition
    } while (true);

    console.groupEnd();

    const totalProfit = sum(dotMultiply(transportTable, profitTable) as Matrix);

    console.log('Wynik');
    console.table(transportTable.toArray());
    console.log('Profit', totalProfit);

    // strip fictional suppliers and customers before returning the results
    transportTable.resize([suppliers.length, customers.length]);
    return {
        transportTable: transportTable.toArray() as number[][],
        totalProfit,
    };
};
