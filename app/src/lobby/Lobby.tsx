import {useEffect, useState} from "react";
import {Button, Card, Form} from "react-bootstrap";
import {LobbyCommunicationService, Player} from "../global/LobbyCommunicationService";
import {NotifyService} from "../global/NotifyService";
import copy from 'copy-to-clipboard';
import "./Lobby.css"
import {MessageIdentifiers, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";

function copyUrlToClipBoard() {
    LobbyCommunicationService.gameId()
        .then(value => {
            copy(
                window.location.origin +"/join/"+value
            )
        })
        .catch(reason => NotifyService.warn(reason, "Could not generate invite link"))
}


function fetchPlayers(setPlayers: (value: (((prevState: Player[]) => Player[]) | Player[])) => void) {
    LobbyCommunicationService.players()
        .then(value => {
            setPlayers(value)
        })
        .catch(reason => {
            NotifyService.warn(reason, "Could not fetch players");
        })
}

function fetchIsHost(setHost: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    LobbyCommunicationService.isHost()
        .then(value => {
            setHost(value)
        })
        .catch(reason => {
            NotifyService.warn(reason, "Could not fetch if you are host");
        })
}

function startGame(rounds: number) {
    LobbyCommunicationService.start(rounds)
        .catch(reason => NotifyService.warn(reason, "Game could not be started"))
}

function Settings() {
    let [host, setHost] = useState(false);
    let [rounds, setRounds] = useState(6);
    useEffect(() => {
        fetchIsHost(setHost)
    },[])


    return (<div className="m-2 flex-column align-items-center settings-div" hidden={!host}>
        <Card
            bg={"light"}
            key="settings"
            text={'dark'}
            style={{width: '18rem'}}
            className="m-2">
            <Card.Title>
                <div className="m-2">
                    <i className="fas fa-cog"/> Settings
                </div>
            </Card.Title>
            <Card.Body>

                <Form>
                    <Form.Label>Rounds:{rounds}</Form.Label>
                    <Form.Range min={2} max={10} defaultValue={6} onChange={event => setRounds(Number(event.target.value))}/>
                </Form>
            </Card.Body>
        </Card>
        <Button variant="primary" onClick={event=> startGame(rounds)}>
            Start game
        </Button>
    </div>);
}

function Lobby(){
    let [players, setPlayers] = useState<Player[]>([]);
    let history = useHistory();
    useEffect(() => {
        fetchPlayers(setPlayers);
        WebsocketService.connect()
        let subscription = WebsocketService.listenMessage()
            .subscribe(message => {
                if(message.identifier === MessageIdentifiers.PLAYERS_CHANGE.valueOf()) {
                    fetchPlayers(setPlayers)
                }
                if(message.identifier === MessageIdentifiers.GAME_STATE_CHANGED.valueOf()
                    && message.message === "EXPLAIN"){
                    history.push("/explain")
                }
            });
        return () => subscription.unsubscribe()
    }, [history])
    return (
        <div className="d-flex p-3 flex-column">
            <div>
                <Button variant="primary" onClick={event => copyUrlToClipBoard()}>
                    Copy invite url
                </Button>
            </div>
            <div>
                <h3 className="mt-4">Players:</h3>
                <div className="d-flex flex-wrap align-content-center justify-content-center">
                    {
                        players.map(value => playerCard(value))
                    }
                </div>
            </div>
            <Settings/>
        </div>
    )
}

function playerCard(player:Player){
    return (
    <Card
        bg={"light"}
        key={player.name}
        text={ 'dark'}
        style={{ width: '18rem' }}
        className="m-2"
    >
        <Card.Body>
            <Card.Title>{player.name}</Card.Title>
            <p style={{display: "inline"}}>
                Connected:
            </p>
            <div className={"dot ms-2 " + (player.connected?"green": "red")} />
        </Card.Body>
    </Card>
    )
}

export default Lobby;