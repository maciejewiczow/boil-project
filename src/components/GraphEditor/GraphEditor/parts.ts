import styled from 'styled-components';

export const EdgeTip = styled.path``;
export const SelectedEdgeTip = styled.path``;

export const Wrapper = styled.div`
    position: relative;
    height: 100%;

    * {
        outline-width: 0 !important;
    }

    .edge {
        marker-end: url(#end-no-arrow);
        stroke: #555;

        &.selected {
            marker-end: url(#end-no-arrow-selected);
        }

        .edge-handle-text {
            fill: black;
            stroke: none;
        }
    }

    ${EdgeTip} {
        stroke: #555;
    }

    ${SelectedEdgeTip} {
        stroke: #1e90ff;
    }
`;

export const GraphClickWrapper = styled.div`
    height: inherit;
`;
