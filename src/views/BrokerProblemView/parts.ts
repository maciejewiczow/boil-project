import styled from 'styled-components';
import { PageContent as OriginalPageContent } from 'views/PageLayoutParts';

export const PageTextInput = styled.input`

`;

export const PageTextParagraph = styled.span`

`;

export const PageButton = styled.button`

`;

export const PageContent = styled(OriginalPageContent)`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto auto;

    grid-template-areas:
        "suppliers customers"
        "costs costs";
`;

export const CostsWrapper = styled.div`
    grid-area: costs;
`;

export const CustomersWrapper = styled.div`
    grid-area: customers;

   
`;

export const Row = styled.div`
    display: flex;
`;

export const SuppliersWrapper = styled.div`
    grid-area: suppliers;

    display: flex;
    flex-flow: column nowrap;
    align-items: space-around;
`;
