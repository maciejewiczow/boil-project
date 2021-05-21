import React from 'react';
import Color from 'color';
import { GraphView, IEdge } from 'react-digraph';
import colormap from 'colormap';
import { BsChevronLeft } from 'react-icons/bs';
import { Graph } from '../constants';
import GraphNodeContent from '../GraphNodeContent/GraphNodeContent';
import { GraphEdge } from '../GraphEdge';
import { BackButton, Wrapper } from './parts';

interface GraphDisplayerProps {
    graph: Graph;
    onReset?: () => void;
}

const getEdgeColor = (colors: string[], weight: number, min: number, max: number): Color => {
    let ratio = 1;

    if (min !== max)
        ratio = (weight - min) / (max - min);

    const ind = ratio * (colors.length - 1);
    const indexLower = Math.floor(ind);

    if (ind === indexLower)
        return new Color(colors[ind]);

    const indexUpper = Math.ceil(ind);

    return new Color(colors[indexLower]).mix(new Color(colors[indexUpper]), (ind - indexLower));
};

const colors = colormap({
    colormap: 'freesurface-blue',
    nshades: 100,
    format: 'hex',
}).reverse().slice(20);

export const GraphDisplayer: React.FC<GraphDisplayerProps> = ({ graph, onReset }) => {
    const minVal = Math.min(...graph.edges.map(edge => edge.weight));
    const maxVal = Math.max(...graph.edges.map(edge => edge.weight));

    const setEdgeColor = (_: string, __: React.ElementType, edge: IEdge, egdeContainer: SVGGElement) => {
        const color = getEdgeColor(colors, (edge as GraphEdge).weight, minVal, maxVal);

        const edgePath = egdeContainer.querySelector('.edge-path') as SVGPathElement | null;

        if (!edgePath)
            return;

        edgePath.style.stroke = color.toString();
        edgePath.style.markerEnd = `url(#end-arrow-${edge.id})`;

        const edgeTextWrapper = egdeContainer.querySelector('.edge > use') as SVGUseElement | null;

        if (!edgeTextWrapper)
            return;

        edgeTextWrapper.style.stroke = color.toString();
    };

    return (
        <Wrapper>
            <GraphView
                nodeKey="id"
                nodes={graph.nodes}
                edges={graph.edges}
                renderNodeText={(data, id, isSelected) => <GraphNodeContent node={data} id={id} isSelected={false} />}
                rotateEdgeHandle={false}
                showGraphControls={false}
                afterRenderEdge={setEdgeColor}
                canCreateEdge={() => false}
                canSwapEdge={() => false}
                nodeTypes={{
                    default: {
                        shapeId: '#defaultNode',
                        shape: (
                            <symbol viewBox="0 0 100 100" width="100" height="100" id="defaultNode">
                                <circle cx="50" cy="50" r="48" stroke="#333" />
                            </symbol>
                        ),
                    },
                }}
                edgeTypes={{
                    default: {
                        shapeId: '#defaultEdge',
                        shape: (
                            <symbol viewBox="0 0 70 30" id="defaultEdge" key="0">
                                <rect x="0" y="0" width="70" height="30" fill="currentColor" />
                            </symbol>
                        ),
                    },
                }}
                nodeSubtypes={{
                    none: {
                        shapeId: '',
                        // used as a way to insert things into <defs>
                        shape: (
                            <React.Fragment>
                                <marker id="end-arrow-not-selected" viewBox="0 -4 8 8" refX="4" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,-4L8,0L0,4" width="8" height="8" />
                                </marker>
                                {graph.edges.map(edge => (
                                    <marker key={edge.id} id={`end-arrow-${edge.id}`} viewBox="0 -4 8 8" refX="4" markerWidth="8" markerHeight="8" orient="auto">
                                        <path d="M0,-4L8,0L0,4" width="8" height="8" fill={getEdgeColor(colors, edge.weight, minVal, maxVal).toString()} />
                                    </marker>
                                ))}
                            </React.Fragment>
                        ),
                    },
                }}
            />
            <BackButton variant="outline-primary" onClick={onReset}><BsChevronLeft /> Wróć do edycji</BackButton>
        </Wrapper>
    );
};
