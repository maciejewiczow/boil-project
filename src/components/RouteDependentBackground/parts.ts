import styled from 'styled-components';

export const Wrapper = styled.div`
    min-width: 100vw;
    min-height: 100vh;
    position: relative;
`;

export const BackgroundSvg = styled.svg`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    pointer-events: none;
`;

export const transition = '1.5s ease-in-out';

export const VariableColorStop = styled.stop`
    transition: stop-color ${transition}, offset ${transition};
`;

export const LinearGradient = styled.linearGradient`
    transition: transform ${transition};
    transform-origin: center center;
`;
