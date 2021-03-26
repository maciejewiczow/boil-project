import { IEdge } from 'react-digraph';

export class GraphEdge implements IEdge {
    type = 'default';

    get handleText() {
        return this.weight.toString();
    }

    get handleTooltipText() {
        return `Koszt połączenia: ${this.weight}`;
    }

    constructor(
        public source: string,
        public target: string,
        public weight: number,
    ) {}
}
