import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import {useHistory} from "react-router-dom";
import {History} from "history";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";

function fetchRole(setRole: (value: (((prevState: string) => string) | string)) => void) {
    GameCommunicationService.getRole()
        .then(value => setRole(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch role"))
}

function fetchRounds(setRounds: (value: (((prevState: number) => number) | number)) => void) {
    GameCommunicationService.getRounds()
        .then(value => setRounds(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch rounds"))
}

function readyUp(setReady: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    GameCommunicationService.ready()
        .then(_ => setReady(true))
        .catch(reason => NotifyService.warn(reason, "Could not ready, try again."))
}

function listOnWaitingPlayersChanged(message: WebsocketMessage,
                                     history: History,
                                     setWaitingFor: (value: (((prevState: string[]) => string[]) | string[])) => void) {
    if(message.identifier === MessageIdentifiers.PLAYER_READY_CHANGED){
        GameCommunicationService.missingReady()
            .then(value => {
                setWaitingFor(value)
            })
            .catch(reason => {
                NotifyService.warn(reason, "Could not fetch missing players")
            })
    }

    if (message.identifier === MessageIdentifiers.GAME_STATE_CHANGED && message.message === "DRAW") {
        history.push("/draw")
    }
}

function Explain(){
    let [role, setRole] = useState("impostor");
    let [ready, setReady] = useState(false);
    let [rounds, setRounds] = useState(6);
    let [waitingFor, setWaitingFor] = useState<string[]>([]);
    let history = useHistory();
    useEffect(() =>{
        fetchRole(setRole);
        fetchRounds(setRounds);
    },[])

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(message => {
                listOnWaitingPlayersChanged(message, history, setWaitingFor)
            });
        return () => subscription.unsubscribe()
    }, [history])
    return (
        <div className="d-flex p-3 flex-column">
            <div>
                <h2 className="mb-5">Your role: <span className="text-primary">{role}</span></h2>
            </div>
            <div>
                <h3>How the game works</h3>
                <p>Lorem ipsum bla bla bla rounds:  <span className="text-primary">{rounds}</span></p>
            </div>
            <div>
                <Button variant="primary" onClick={event => readyUp(setReady)} disabled={ready}>
                    Start
                </Button>
            </div>
            {
                ready &&
                <div className="mt-5">
                    <h4>
                        Waiting for <span className="text-primary">{waitingFor.join(" | ")}</span>
                    </h4>
                </div>
            }

        </div>
    )
}

export default Explain;