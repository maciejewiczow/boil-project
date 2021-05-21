import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RouteDependentBackground from 'components/RouteDependentBackground';
import { BrokerProblemView, LandingView, DeliveryNetworkView } from 'views';
import { RouteNames } from './appConstants';

const App: React.FC = () => (
    <BrowserRouter>
        <RouteDependentBackground>
            <Switch>
                <Route path={RouteNames.BrokerProblem} component={BrokerProblemView} />
                <Route path={RouteNames.DeliveryNetwork} component={DeliveryNetworkView} />
                <Route path={RouteNames.Home} component={LandingView} />
            </Switch>
        </RouteDependentBackground>
    </BrowserRouter>
);

export default App;
