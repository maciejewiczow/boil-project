import { INode } from 'react-digraph';
import { v4 as uuid } from 'uuid';

export abstract class GraphNode implements INode {
    id: string = uuid();
    // property used by react-digraph, but we are ignoring it's type system
    type = 'default';

    constructor(
        public sequenceNumber: number,
        public x?: number,
        public y?: number,
    ) {}

    abstract get title(): string;
}

export class BrokerNode extends GraphNode {
    get title(): string {
        return `P ${this.sequenceNumber}`;
    }
}

export class CustomerNode extends GraphNode {
    get title(): string {
        return `O ${this.sequenceNumber}`;
    }

    constructor(
        public demand: number,
        sequenceNumber: number,
        x?: number,
        y?: number,
    ) {
        super(sequenceNumber, x, y);
    }
}

export class SupplierNode extends GraphNode {
    get title(): string {
        return `D ${this.sequenceNumber}`;
    }

    constructor(
        public supply: number,
        sequenceNumber: number,
        x?: number,
        y?: number,
    ) {
        super(sequenceNumber, x, y);
    }
}
