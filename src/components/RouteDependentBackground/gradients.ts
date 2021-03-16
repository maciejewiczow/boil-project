import { RouteNames } from 'appConstants';

interface GradientStop {
    color: string;
    offset: number;
}

interface ThreeStopGradient {
    stops: [GradientStop, GradientStop, GradientStop];
    angle: number;
}

export const defaultGradient: ThreeStopGradient = {
    stops: [
        {
            color: '#2C5364',
            offset: 0,
        },
        {
            color: '#203A43',
            offset: 0.5,
        },
        {
            color: '#0F2027',
            offset: 1,
        },
    ],
    angle: 230,
};

export const gradients: Partial<Record<RouteNames, ThreeStopGradient>> = {
    [RouteNames.Home]: defaultGradient,
    [RouteNames.BrokerProblem]: {
        stops: [
            {
                color: '#677478',
                offset: 0,
            },
            {
                color: '#485260',
                offset: 0.5,
            },
            {
                color: '#283048',
                offset: 1,
            },
        ],
        angle: 300,
    },
    [RouteNames.LinearProgramming]: {
        stops: [
            {
                color: 'rgba(73,93,109,1)',
                offset: 0.189,
            },
            {
                color: 'rgb(61,74,96)',
                offset: 0.5,
            },
            {
                color: 'rgba(49,55,82,1)',
                offset: 0.911,
            },
        ],
        angle: 200,
    },
};
