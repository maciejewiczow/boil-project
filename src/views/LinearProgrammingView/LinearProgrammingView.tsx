import React from 'react';
import styled from 'styled-components';
import { PageContent as OriginalPageContent, PageHeader } from 'views/PageLayoutParts';
import { PageWrapper } from './parts';

const PageContent = styled(OriginalPageContent)`
    padding: 0;
    overflow: hidden;
`;

const LinearProgrammingView: React.FC = () => (
    <PageWrapper>
        <PageHeader>Grafowanie</PageHeader>
        <PageContent />
    </PageWrapper>
);

export default LinearProgrammingView;
