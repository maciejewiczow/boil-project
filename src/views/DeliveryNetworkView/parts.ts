import styled from 'styled-components';
import { PageWrapper as OriginalPageWrapper, PageContent as OriginalPageContent } from 'views/PageLayoutParts';
import { GraphEntityDetails as OriginalGraphEntityDetails } from 'components/GraphEditor';
import { Wrapper as EntityDetailsWrapper } from 'components/GraphEditor/GraphEntityDetails/parts';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import BsButton from 'react-bootstrap/Button';

export const PageWrapper = styled(OriginalPageWrapper)`
    grid-template-rows: auto auto 1fr;

    grid-template-areas:
        "header header header"
        "graph-sidebar content solution-details"
        ". content .";

`;

export const GraphEntityDetails = styled(OriginalGraphEntityDetails)`
    grid-area: graph-sidebar;
`;

export const PageContent = styled(OriginalPageContent)`
    padding: 0;
    overflow: hidden;
    position: relative;
`;

export const SolutionButtons = styled(ButtonGroup)`
    position: absolute;
    top: 22px;
    left: 28px;
`;

export const Button = styled(BsButton)`
    z-index: 1;
    background: white;
`;

export const SolutionDetails = styled(EntityDetailsWrapper)`
    grid-area: solution-details;
    height: fit-content;

    border-radius: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    margin-left: 24px;
    margin-right: 0;
`;
