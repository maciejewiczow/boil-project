import styled from 'styled-components';
import { PageWrapper as OriginalPageWrapper, PageContent as OriginalPageContent } from 'views/PageLayoutParts';

export const PageWrapper = styled(OriginalPageWrapper)`
    grid-template-areas:
        "header header header"
        "graph-sidebar content .";

    grid-column-gap: 12px;
`;


export const PageContent = styled(OriginalPageContent)`
    padding: 0;
    overflow: hidden;
`;
