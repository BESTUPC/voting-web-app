import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { BaseScreen } from './screens/base-screen/BaseScreen';
import { LoginScreen } from './screens/login-screen/LoginScreen';

function App() {
    return (
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/login">
                        <LoginScreen></LoginScreen>
                    </Route>
                    <Route path="/">
                        <BaseScreen>caca</BaseScreen>
                    </Route>
                </Switch>
            </Router>
        </React.Fragment>
    );
}

export default App;
