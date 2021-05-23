import { v4 as uuid } from 'uuid';
import { IEdge } from 'react-digraph';

export class GraphEdge implements IEdge {
    id: string = uuid();
    type = 'default';

    get handleText() {
        if (this.min !== 0 && this.max !== undefined)
            return `◊ ${this.weight}`;

        if (this.max !== undefined)
            return `∧ ${this.weight}`;

        if (this.min !== 0)
            return `∨ ${this.weight}`;

        return this.weight.toString();
    }

    get handleTooltipText() {
        return `Koszt trasy: ${this.weight}`;
    }

    constructor(
        public source: string,
        public target: string,
        public weight: number,
        public min: number = 0,
        public max?: number,
    ) {}
}
