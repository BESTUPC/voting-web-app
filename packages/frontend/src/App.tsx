import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { HomeScreen } from './screens/home-screen/HomeScreen';
import { LoginScreen } from './screens/login-screen/LoginScreen';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/login">
                    <LoginScreen></LoginScreen>
                </Route>
                <Route path="/">
                    <HomeScreen></HomeScreen>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
