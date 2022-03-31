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
                <p>You will play rounds <span className="text-primary">{rounds}</span></p>
                <p>Every round you need to draw the sentence given to you. After every round you see everyone's drawing.</p>
                {role =="impostor"&&
                    <div>
                        <p>Since you are the impostor you will see a <q>?</q> as a replacement for a part of the sentence. Hover over it to see possible outcomes.</p>
                        <p>1 time in the game you can see the whole sentence by clicking the corresponding button.</p>
                        <p>1 time you can make crew-mates get the wrong sentence to denounce him. Hack the crew-mate with the correspoding option while reviewing images.</p>
                        <p>You job is to draw as inaccurate on the part of the sentence you don't know. If somebody suspects you, say you are a <q>bad drawer</q> and never admit being the impostor. You can also blame the impostor for hacking you.</p>
                    </div>
                }
                {role !="impostor"&&
                    <div>
                        <p>You job is to draw as accurate as possible. Try finding out who does not know what he needs to draw and vote him at the end of the game.</p>
                        <p>You can be hacked and given a wrong sentence, be aware. You will always see the correct sentence while reviewing the drawings.</p>
                    </div>
                }
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