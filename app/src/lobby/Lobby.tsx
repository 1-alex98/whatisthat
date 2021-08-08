import {useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";
import {LobbyCommunicationService, Player} from "../global/LobbyCommunicationService";
import {NotifyService} from "../global/NotifyService";
import copy from 'copy-to-clipboard';
import "./Lobby.css"
import {WebsocketService} from "../global/WebsocketService";

function copyUrlToClipBoard() {
    LobbyCommunicationService.gameId()
        .then(value => {
            copy(
                window.location.origin +"/join/"+value
            )
        })
        .catch(reason => NotifyService.warn(reason, "Could not generate invite link"))
}


function Lobby(){
    let [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        WebsocketService.connect()
        LobbyCommunicationService.players()
            .then(value => {
                setPlayers(value)
            })
            .catch(reason => {
                NotifyService.warn(reason, "Could not fetch players");
            })
    }, [])
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