import React from 'react';
import { ReactComponent as GraphIcon } from 'assets/graph.svg';
import { ReactComponent as TransportIcon } from 'assets/transport-icon-6.svg';
import { CardDescription, CardImageWrapper, LinkCard, Wrapper } from './parts';

const LandingView: React.FC = () => (
    <Wrapper>
        <LinkCard to="/carrier">
            <CardImageWrapper src={TransportIcon} />
            <CardDescription>
                Problem przewoźnika
            </CardDescription>
        </LinkCard>
        <LinkCard to="/linear">
            <CardImageWrapper src={GraphIcon} />
            <CardDescription>Cośtam sieciowe</CardDescription>
        </LinkCard>
    </Wrapper>
);

export default LandingView;
