import styled from 'styled-components';

export const NodeTypeText = styled.text`
    font-size: 10px;
`;

export const Name = styled.text`
    font-size: 20px;
`;

export const NodeValue = styled.text`
    font-size: 10px;
`;

export const Wrapper = styled.g<{ isSelected?: boolean }>`
    cursor: pointer;

    text {
        fill: ${({ isSelected }) => (isSelected ? 'white' : 'black')};
        alignment-baseline: middle;
        text-anchor: middle;
    }

    ${NodeTypeText} {
        fill: ${({ isSelected }) => (isSelected ? '#ccc' : '#888')};
    }
`;
