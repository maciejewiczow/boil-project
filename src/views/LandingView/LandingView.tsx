import React from 'react';
import { ReactComponent as GraphIcon } from 'assets/graph.svg';
import { ReactComponent as TransportIcon } from 'assets/transport-icon-6.svg';
import { RouteNames } from 'appConstants';
import { CardDescription, CardImageWrapper, LinkCard, Wrapper } from './parts';

const LandingView: React.FC = () => (
    <Wrapper>
        <LinkCard to={RouteNames.BrokerProblem}>
            <CardImageWrapper src={TransportIcon} />
            <CardDescription>Zagadnienie pośrednika</CardDescription>
        </LinkCard>
        <LinkCard to={RouteNames.DeliveryNetwork}>
            <CardImageWrapper src={GraphIcon} />
            <CardDescription>Optymalizacja sieci dostaw</CardDescription>
        </LinkCard>
    </Wrapper>
);

export default LandingView;
