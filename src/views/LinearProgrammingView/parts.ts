import styled from 'styled-components';
import { PageWrapper as OriginalPageWrapper, PageContent as OriginalPageContent } from 'views/PageLayoutParts';
import { GraphEntityDetails as OriginalGraphEntityDetails } from 'components/GraphEditor';

export const PageWrapper = styled(OriginalPageWrapper)`
    grid-template-rows: auto auto 1fr;

    grid-template-areas:
        "header header header"
        "graph-sidebar content ."
        ". content .";

`;

export const GraphEntityDetails = styled(OriginalGraphEntityDetails)`
    grid-area: graph-sidebar;
`;

export const PageContent = styled(OriginalPageContent)`
    padding: 0;
    overflow: hidden;
`;
