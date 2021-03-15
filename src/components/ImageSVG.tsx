import React from 'react';
import styled from 'styled-components';

export interface ImageSVGProps {
    src?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    className?: string;
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ImageSvg: React.FC<ImageSVGProps> = ({ src, children, className }) => {
    if (!src && !children)
        return <Wrapper className={className} />;

    // because condition above ensures that src or children will be defined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Component = src!;

    return (
        <Wrapper className={className}>
            {children || <Component />}
        </Wrapper>
    );
};
