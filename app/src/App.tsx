import React from 'react';
import './App.css';
import {
  Switch,
  Route, BrowserRouter as Router,
} from "react-router-dom";
import Host from "./lobby/Host";
import Join from "./lobby/Join";
import AlertErrors from "./AlterErrors";
import Lobby from "./lobby/Lobby";
import Nav from "./Nav";
import Explain from "./game/Explain";
import Main from './Main';


function App() {
  return (
    <div className="App">
      <Nav/>
      <AlertErrors/>
      <Router>
        <div className="top-container">
          <Switch>
            <Route path="/host">
              <Host/>
            </Route>
            <Route path="/explain">
              <Explain/>
            </Route>
            <Route path="/join/:gameId">
              <Join/>
            </Route>
            <Route path="/lobby">
              <Lobby/>
            </Route>
            <Route exact path="/">
              <Main/>
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
