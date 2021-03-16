import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RouteDependentBackground } from 'components/RouteDependentBackground/RouteDependentBackground';
import { CarrierProblemView, LandingView, LinearProgrammingView } from 'views';
import { RouteNames } from 'appConstants';

const App: React.FC = () => (
    <BrowserRouter>
        <RouteDependentBackground>
            <Switch>
                <Route path={RouteNames.CarrierProblem} component={CarrierProblemView} />
                <Route path={RouteNames.LinearProgramming} component={LinearProgrammingView} />
                <Route path={RouteNames.Home} component={LandingView} />
            </Switch>
        </RouteDependentBackground>
    </BrowserRouter>
);

export default App;
