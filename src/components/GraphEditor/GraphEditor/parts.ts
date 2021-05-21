import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

export const Wrapper = styled.div`
    position: relative;
    height: 100%;

    * {
        outline-width: 0 !important;
    }

    #end-arrow-not-selected {
        fill: #555;
    }

    .edge {
        stroke: #555;
        marker-end: url(#end-arrow-not-selected);

        .edge-handle-text {
            fill: black;
            stroke: none;
        }

        &.selected .edge-handle-text {
            stroke: none;
        }

        &.selected {
            marker-end: url(#end-arrow)
        }
    }
`;

export const GraphClickWrapper = styled.div`
    height: inherit;
`;

export const GoButton = styled(Button)`
    position: absolute;
    bottom: 24px;
    right: 28px;
`;
