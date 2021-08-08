import React, {useEffect, useState} from 'react';
import './App.css';
import {
  Switch,
  Route, BrowserRouter as Router,
} from "react-router-dom";
import Host from "./lobby/Host";
import Join from "./lobby/Join";
import AlertErrors from "./AlterErrors";
import Lobby from "./lobby/Lobby";
import {WebsocketService} from "./global/WebsocketService";

function Nav() {
  let [connected, setConnected] = useState(false);
  useEffect(() => {
    let connectedState = WebsocketService.getConnected();
    setConnected(connectedState)
    let subscription = WebsocketService.listenConnect().subscribe(value => {
      setConnected(value)
    });
    return () => subscription.unsubscribe()
  },[])
  return <nav className="navbar navbar-light bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="/">
        <img src={process.env.PUBLIC_URL + '/what.svg'} alt="" width="40" height="40"
             className="d-inline-block align-text-top"/>
        <p className="ms-2 d-inline">What is that?</p>
      </a>
      <div>
        <p className="d-inline">Connected: </p>
        <div className={"dot-app "+ (connected?"green": "red")}/>
      </div>
    </div>
  </nav>;
}

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
            <Route path="/join/:gameId">
              <Join/>
            </Route>
            <Route path="/lobby">
              <Lobby/>
            </Route>
            <Route exact path="/">
              <Host/>
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
