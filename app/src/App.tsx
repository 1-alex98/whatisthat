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
import Draw from "./game/Draw";


function App() {
  return (
    <div className="App d-flex flex-column">
      <Router>
        <Nav/>
        <AlertErrors/>
        <div className="top-container flex-grow-1">
          <Switch>
            <Route path="/host">
              <Host/>
            </Route>
            <Route path="/draw">
              <Draw/>
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
              <p><span className="text-danger">404</span> we can not find what you are looking for.<br/> Somebody that does not know what he is doing must have coded this site.</p>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
