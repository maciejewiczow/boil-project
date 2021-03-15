import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CarrierProblemView, LandingView, LinearProgrammingView } from 'views';

const App: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/carrier">
                <CarrierProblemView />
            </Route>
            <Route path="/linear">
                <LinearProgrammingView />
            </Route>
            <Route path="/">
                <LandingView />
            </Route>
        </Switch>
    </BrowserRouter>
);

export default App;
