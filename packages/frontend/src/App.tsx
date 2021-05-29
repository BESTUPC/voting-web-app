import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CreatePollScreen } from './screens/create-poll-screen/CreatePollScreen';
import { HomeScreen } from './screens/home-screen/HomeScreen';
import { LoginScreen } from './screens/login-screen/LoginScreen';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/login">
                    <LoginScreen></LoginScreen>
                </Route>
                <Route path="/createPoll">
                    <CreatePollScreen></CreatePollScreen>
                </Route>
                <Route path="/">
                    <HomeScreen></HomeScreen>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
