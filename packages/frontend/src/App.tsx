import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavigationBar } from './components/NavigationBar';

function App() {
    return (
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.tsx</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
        <React.Fragment>
            <Router>
                <NavigationBar
                    name="bernat"
                    imageUrl="https://www.getdigital.eu/web/getdigital/gfx/products/__generated__resized/1100x1100/Aufkleber_Trollface.jpg"
                    membershipArray={["caca", "pipi"]}
                />
            </Router>
        </React.Fragment>
    );
}

export default App;
