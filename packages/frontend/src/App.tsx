import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CreatePollScreen } from './screens/create-poll-screen/CreatePollScreen';
import { DelegationScreen } from './screens/delegation-screen/DelegationScreen';
import { HomeScreen } from './screens/home-screen/HomeScreen';
import { LoginScreen } from './screens/login-screen/LoginScreen';
import { VoteScreen } from './screens/vote-screen/VoteScreen';

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
                <Route path="/vote/:pollId">
                    <VoteScreen></VoteScreen>
                </Route>
                <Route path="/delegations">
                    <DelegationScreen></DelegationScreen>
                </Route>
                <Route path="/">
                    <HomeScreen></HomeScreen>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
