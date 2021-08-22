import {useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import SentenceDisplay from "./SentenceDisplay";
import {ImpostorSentence, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import FreeDrawCanvas from "./FreeDrawCanvas";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";

function Vote(){

    let [players, setPlayers] = useState<string[]>([]);

    return (
        <div className="d-flex p-3 flex-column h-100">

        </div>
    )
}

export default Vote;