import styled from 'styled-components';

export const Wrapper = styled.div`
    position: relative;
    height: 100%;

    * {
        outline-width: 0 !important;
    }

    .edge {
        stroke: #555;

        .edge-handle-text {
            fill: black;
            stroke: none;
        }

        &.selected .edge-handle-text {
            stroke: none;
        }
    }
`;

export const GraphClickWrapper = styled.div`
    height: inherit;
`;
