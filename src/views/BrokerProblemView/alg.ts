import cloneDeep from 'lodash/cloneDeep';
import {
    zeros,
    map,
    matrix,
    Matrix,
    index,
    range,
    lusolve,
    squeeze,
    subset,
    sum,
    dotMultiply,
    flatten,
} from 'mathjs';
import { Supplier, Customer, DualVariables, Results } from './interfaces';

const isBalanced = (suppliers: Supplier[], customers: Customer[]) => sum(suppliers.map(s => s.supply)) === sum(customers.map(s => s.demand));

const getOptimalityFactor = (profitTable: Matrix, dualVariables: DualVariables) => (
    map(
        profitTable,
        (_, [i, j]: [number, number]) => profitTable.get([i, j]) - dualVariables.alphas[i] - dualVariables.betas[j],
    )
);

const generateProfitTable = (suppliers: Supplier[], customers: Customer[], costs: Matrix) => (
    map(
        matrix(zeros(suppliers.length, customers.length)),
        (_, [i, j]: [number, number]) => customers[j].price - costs.get([i, j]) - suppliers[i].price,
    )
);

const findAndApplyCycle = (solution: Matrix, deltas: Matrix) => {
    const sortedDeltas = (deltas.toArray() as number[][])
        .flatMap((row, i) => row.map((value, j) => ({ value, i, j })))
        .filter(v => v.value > 0)
        .sort((a, b) => b.value - a.value);

    const solutionArray = solution.toArray() as (number | undefined)[][];
    const deltasArray = deltas.toArray() as number[][];

    const [rows, cols] = deltas.size();
    for (const delta of sortedDeltas) {
        for (let i = 0; i < rows; i++) {
            if (deltasArray[i][delta.j] === 0) {
                for (let j = 0; j < cols; j++) {
                    if (deltasArray[i][j] === 0 && deltasArray[delta.i][j] === 0) {
                        const value = Math.min(solutionArray[i][delta.j] ?? 0, solutionArray[delta.i][j] ?? 0);

                        solutionArray[i][delta.j] = (solutionArray[i][delta.j] ?? 0) - value;
                        solutionArray[delta.i][j] = (solutionArray[delta.i][j] ?? 0) - value;
                        solutionArray[delta.i][delta.j] = (solutionArray[delta.i][delta.j] ?? 0) + value;
                        solutionArray[i][j] = (solutionArray[i][j] ?? 0) + value;

                        // Leaves one of the zeroes in the base solution if there are two zeroes in the negative semicycle
                        if (solutionArray[i][delta.j] === 0 && solutionArray[delta.i][j] !== 0)
                            solutionArray[i][delta.j] = undefined;

                        if (solutionArray[delta.i][j] === 0)
                            solutionArray[delta.i][j] = undefined;

                        console.log(`Znaleziono cykl: (${delta.i}, ${delta.j}) -> (${delta.i}, ${j}) -> (${i}, ${j}) -> (${i}, ${delta.j})`);

                        // Because typings for mathjs are wrong and matrix can contain any values, not just numberss
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return matrix(solutionArray);
                    }
                }
            }
        }
    }

    console.warn('No cycle was found!');

    // Same as above
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    const solution = (zeros(localSuppliers.length, localCustomers.length) as Matrix).map(_ => undefined);

    if (!balanced) {
        profits.resize([suppliers.length - 1, localCustomers.length - 1]);
        profits.resize([suppliers.length, localCustomers.length], -Infinity);
    }

    const sortedProfits = (profits.toArray() as number[][])
        .flatMap((row, i) => row.map((value, j) => ({ value, i, j })))
        .sort((a, b) => b.value - a.value);

    for (const profit of sortedProfits) {
        if (sum(localCustomers.map(c => c.demand)) === 0 || sum(suppliers.map(s => s.supply)) === 0)
            break;

        if (localSuppliers[profit.i].supply > 0 && localCustomers[profit.j].demand > 0) {
            const routeValue = Math.min(localSuppliers[profit.i].supply, localCustomers[profit.j].demand);

            localSuppliers[profit.i].supply -= routeValue;
            localCustomers[profit.j].demand -= routeValue;
            solution.set([profit.i, profit.j], routeValue !== 0 ? routeValue : undefined);
        }
    }

    const missingValuesCount = (suppliers.length + customers.length - 1) - (flatten(solution).toArray() as number[]).filter(el => el !== undefined).length;

    if (missingValuesCount > 0) {
        const [rows, cols] = solution.size();

        for (let i = 0, replacedValues = 0; i < rows && replacedValues < missingValuesCount; i++) {
            for (let j = 0; j < cols && replacedValues < missingValuesCount; j++) {
                if (solution.get([i, j]) === undefined) {
                    solution.set([i, j], 0);
                    replacedValues++;
                }
            }
        }
    }

    return solution;
};

const calculateDualVariables = (transportTable: Matrix, profits: Matrix): DualVariables => {
    const [nSuppliers, nCustomers] = transportTable.size();
    const size = nSuppliers + nCustomers - 1;
    const transportArr = transportTable.toArray() as (number | undefined)[][];

    let A = zeros(size, size + 1) as Matrix;

    let currentRow = 0;
    transportTable.forEach((val: number | undefined, [i, j]: any) => {
        if (val !== undefined) {
            A.set([currentRow, i], 1); // alpha
            A.set([currentRow, nSuppliers + j], 1); // beta
            currentRow++;
        }
    });

    const B = transportArr
        .flatMap((row, i) => (
            row.map((val, j) => (val !== undefined ? profits.get([i, j]) : undefined))
        ))
        .filter(val => val !== undefined);

    console.assert(B.length === size);

    const [rows, cols] = A.size();
    A = subset(A, index(range(0, rows), range(1, cols)));

    const x = squeeze(lusolve(A, B) as Matrix).toArray() as number[];

    return {
        alphas: [0, ...x.slice(0, nSuppliers - 1)],
        betas: x.slice(nSuppliers - 1),
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
            supply: sum(customers.map(s => s.demand)),
        });
        localCustomers.push({
            price: 0,
            demand: sum(suppliers.map(s => s.supply)),
        });
        localCosts.resize([localSuppliers.length, localCustomers.length], 0);
        profitTable.resize([localSuppliers.length, localCustomers.length], 0);
    }

    let transportTable = generateInitialSolution(localSuppliers, localCustomers, profitTable, balanced);

    let i = 1;
    do {
        console.groupCollapsed(`Iteracja ${i}`);
        console.table(transportTable.toArray());

        const dualVariables = calculateDualVariables(transportTable, profitTable);
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
    transportTable = transportTable.map(val => (val === undefined ? 0 : val));
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
