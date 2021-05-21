declare module 'colormap' {
    type ColorMapName = (
        'jet' |
        'hsv' |
        'hot' |
        'cool' |
        'spring' |
        'summer' |
        'autumn' |
        'winter' |
        'bone' |
        'copper' |
        'greys' |
        'YIGnBu' |
        'greens' |
        'YIOrRd' |
        'bluered' |
        'RdBu' |
        'picnic' |
        'rainbow' |
        'portland' |
        'blackbody' |
        'earth' |
        'electric' |
        'viridis' |
        'inferno' |
        'magma' |
        'plasma' |
        'warm' |
        'cool' |
        'rainbow-soft' |
        'bathymetry' |
        'cdom' |
        'chlorophyll' |
        'density' |
        'freesurface-blue' |
        'freesurface-red' |
        'oxygen' |
        'par' |
        'phase' |
        'salinity' |
        'temperature' |
        'turbidity' |
        'velocity-blue' |
        'velocity-green' |
        'cubehelix'
    );

    interface ColormapOptions {
        colormap: ColorMapName;
        nshades: number;
    }

    interface ColormapStringOptions extends ColormapOptions {
        format: 'hex' | 'rgbaString';
    }

    interface ColormapArrayOptions extends ColormapOptions {
        format: 'rba' | 'float';
    }

    function colormap(opts?: ColormapStringOptions): string[];
    function colormap(opts?: ColormapArrayOptions): [number, number, number, number][];

    export = colormap;
}
