import React from 'react';
import './App.css';
import {
  Switch,
  Route, BrowserRouter as Router,
} from "react-router-dom";
import Host from "./lobby/Host";
import Join from "./lobby/Join";

function Status() {
  return null;
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={process.env.PUBLIC_URL + '/what.svg'} alt="" width="40" height="40"
                 className="d-inline-block align-text-top"/>
            <p className="ms-2 d-inline">What is that?</p>
          </a>
          <Status/>
        </div>
      </nav>
      <Router>
        <div className="top-container">
          <Switch>
            <Route path="/host">
              <Host />
            </Route>
            <Route path="/join">
              <Join />
            </Route>
            <Route exact path="/">
              <Host />
            </Route>
            <Route path="*">
              <p>404 we can not find what you are looking for</p>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
