/* eslint-disable class-methods-use-this */
import { INode } from 'react-digraph';
import { v4 as uuid } from 'uuid';

export abstract class GraphNode implements INode {
    id: string = uuid();
    // property used by react-digraph, but we are ignoring it's type system
    readonly type = 'default';

    constructor(
        public sequenceNumber: number,
        public x?: number,
        public y?: number,
    ) {}

    abstract get title(): string;
    abstract get typeName(): string;
    abstract get nodeType(): NodeType;
}

export enum NodeType {
    Supplier = 'Supplier',
    Broker = 'Broker',
    Customer = 'Customer',
}

export class BrokerNode extends GraphNode {
    get nodeType() {
        return NodeType.Broker;
    }

    get title() {
        return `P ${this.sequenceNumber}`;
    }

    get typeName() {
        return 'Pośrednik';
    }
}

export class CustomerNode extends GraphNode {
    get nodeType() {
        return NodeType.Customer;
    }

    get typeName(): string {
        return 'Odbiorca';
    }

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
    get nodeType() {
        return NodeType.Supplier;
    }

    get typeName(): string {
        return 'Dostawca';
    }

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
