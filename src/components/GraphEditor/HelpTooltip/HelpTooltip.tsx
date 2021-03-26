import React from 'react';
import { Wrapper, Icon, HelpBody } from './parts';

interface HelpTooltipProps {
    isTootlipOpen?: boolean;
    onIconClick?: React.MouseEventHandler<SVGElement>;
    className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
    isTootlipOpen,
    onIconClick,
    className,
}) => (
    <Wrapper className={className}>
        <Icon onClick={onIconClick} />
        <HelpBody hidden={!isTootlipOpen}>
            DEL - usuniecie zaznaczonego elementu<br />
            SHIFT + kliknięcie - nowy węzeł<br />
            SHIFT + kliknięcie na węzeł + przeciągnięcie - utworzenie nowej krawędzi <br />
        </HelpBody>
    </Wrapper>
);
