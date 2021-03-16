import React from 'react';
import { useLocation } from 'react-router';
import { RouteNames } from 'appConstants';
import { defaultGradient, gradients } from './gradients';
import { Wrapper, BackgroundSvg, LinearGradient, VariableColorStop } from './parts';

interface ClassNameProps {
    className?: string;
}

export const RouteDependentBackground: React.FC<ClassNameProps> = ({ className, children }) => {
    const location = useLocation();

    const { angle, stops } = gradients[location.pathname as RouteNames] ?? defaultGradient;

    return (
        <Wrapper className={className}>
            <BackgroundSvg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
            >
                <LinearGradient
                    id="background-grad-generated"
                    gradientUnits="userSpaceOnUse"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                    gradientTransform={`rotate(${angle})`}
                >
                    <VariableColorStop offset={`${stops[0].offset * 100}%`} stopColor={stops[0].color} />
                    <VariableColorStop offset={`${stops[1].offset * 100}%`} stopColor={stops[1].color} />
                    <VariableColorStop offset={`${stops[2].offset * 100}%`} stopColor={stops[2].color} />
                </LinearGradient>
                <rect x="0" y="0" width="1" height="1" fill="url(#background-grad-generated)" />
            </BackgroundSvg>
            {children}
        </Wrapper>
    );
};
