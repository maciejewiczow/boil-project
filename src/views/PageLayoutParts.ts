import styled from 'styled-components';

export const PageWrapper = styled.div`
    min-height: 100vh;
    // whithout this "height: 100%" does not work in child elements
    height: 1px;

    display: grid;
    grid-template-columns: auto 65% auto;
    grid-template-rows: auto 1fr;

    grid-template-areas:
        "header header header"
        ". content .";
`;

export const PageHeader = styled.header`
    color: white;
    font-size: 42px;
    text-align: center;
    padding: 32px 0;
    letter-spacing: 2px;

    grid-area: header;
`;

export const PageContent = styled.div`
    flex-grow: 1;
    background: white;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    padding: 12px 18px;

    grid-area: content;
`;
