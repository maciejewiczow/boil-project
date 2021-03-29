import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import { PageContent as OriginalPageContent } from 'views/PageLayoutParts';

export const PageContent = styled(OriginalPageContent)`
    padding: 24px 32px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

    grid-row-gap: 24px;
    grid-column-gap: 32px;

    grid-template-areas:
        "suppliers customers"
        "costs costs"
        "submit submit";
`;

export const TableInput = styled(Form.Control)`
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 0;
    border-width: 0;
    background: transparent;
`;

export const GridTable = styled.div`
    display: grid;
    grid-template-columns: auto 1fr 1fr auto;
    grid-gap: 8px;
    grid-auto-rows: min-content;
`;

export const ScrollTable = styled(GridTable)`
    overflow-y: auto;
    max-height: 400px;
`;

export const GridCell = styled.div<{ col: number }>`
    grid-column: ${({ col }) => col};
`;

export const StickyGridCell = styled(GridCell)`
    position: sticky;
    top: 0;
    background: white;
`;

export const SectionHeader = styled.h3`
    margin-bottom: 16px;
`;

export const CustomersWrapper = styled.div`
    grid-area: customers;
`;

export const SuppliersWrapper = styled.div`
    grid-area: suppliers;
`;

export const CostsWrapper = styled.div`
    grid-area: costs;

    overflow-x: auto;

    td {
        min-width: 70px;
        padding: 0;
        position: relative;
    }

    th {
        white-space: nowrap;
    }
`;

export const SubmitArea = styled.div`
    grid-area: submit;

    display: flex;
    justify-content: flex-end;
`;
