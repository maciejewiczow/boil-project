import { RouteNames } from 'appConstants';
import { matchPath, RouteProps, useLocation } from 'react-router';

interface GradientStop {
    color: string;
    offset: number;
}

interface ThreeStopGradient {
    stops: [GradientStop, GradientStop, GradientStop];
    angle: number;
}

const defaultGradient: ThreeStopGradient = {
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

type RouteGradientConfig = {
    route: string | string[] | Omit<RouteProps, 'render' | 'component' | 'children'>;
    gradient: ThreeStopGradient;
}[];

const routeGradients: RouteGradientConfig = [
    {
        route: RouteNames.BrokerProblem,
        gradient: {
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
    },
    {
        route: RouteNames.DeliveryNetwork,
        gradient: {
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
    },
    {
        route: RouteNames.Home,
        gradient: defaultGradient,
    },
];

export const useLocationGradient = (): ThreeStopGradient => {
    const location = useLocation();

    return routeGradients
        .find(({ route }) => matchPath(location.pathname, route) !== null)?.gradient ?? defaultGradient;
};
