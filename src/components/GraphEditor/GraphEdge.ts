import { v4 as uuid } from 'uuid';
import { IEdge } from 'react-digraph';

export class GraphEdge implements IEdge {
    id: string = uuid();
    type = 'default';

    get handleText() {
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
