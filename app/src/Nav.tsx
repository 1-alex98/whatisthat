import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {WebsocketService} from "./global/WebsocketService";
import {History} from "history";
import {GlobalCommunicationService} from "./global/GlobalCommunicationService";
import {NotifyService} from "./global/NotifyService";

function fetchGameState(): Promise<string> {
    return GlobalCommunicationService.gameState();
}

function redirectCorrectPage(state: string, history: History) {
    switch (state) {
        case "":
            history.push("/")
            break;
        case "WAITING_TO_START":
            history.push("/lobby")
            break;
        case "EXPLAIN":
            history.push("/explain")
            break;
        case "DRAW":
            history.push("/draw")
            break;
        case "REVIEW":
            history.push("/review")
            break;
        case "VOTE":
            history.push("/vote")
            break;
        case "RESULT":
            history.push("/result")
            break;
    }
}

function reconnect(history: History) {
    fetchGameState()
        .then(state=> {
            if(state) {
                WebsocketService.connect()
            }
            redirectCorrectPage(state, history)
        })
        .catch(_ => {})
}

function quit(history: History) {
    WebsocketService.quit()
    GlobalCommunicationService.quit()
        .then(_ => history.push("/"))
        .catch(err=> NotifyService.warn(err, "Could not quit"))
}

function Nav() {
    let [connected, setConnected] = useState(false);
    let history = useHistory();
    useEffect(()=> {
        reconnect(history)
    }, [history])
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
                <i hidden={!connected} className="fas fa-sign-out-alt m-3 clickable" onClick={_ => quit(history)}/>
            </div>
        </div>
    </nav>;
}

export default Nav;