import {useEffect, useState} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {LobbyCommunicationService, Player} from "../global/LobbyCommunicationService";
import {useHistory} from "react-router-dom";
import {History, LocationState} from "history";
import {NotifyService} from "../global/NotifyService";
import assert from "assert";
import copy from 'copy-to-clipboard';


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
                {JSON.stringify(players)}
            </div>
        </div>
    )
}

export default Lobby;