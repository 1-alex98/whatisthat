import {useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import SentenceDisplay from "./SentenceDisplay";
import {AlienSentence, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import FreeDrawCanvas from "./FreeDrawCanvas";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";

function fetchSentence(setIsAlien: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                       setSentence: (value: (((prevState: (string | AlienSentence | null)) => (string | AlienSentence | null)) | string | AlienSentence | null)) => void) {
    GameCommunicationService.getRole()
        .then(value => {
            const isAlien = value === 'alien'
            setIsAlien(isAlien)
            return isAlien
        })
        .then(isAlien => {
            if(isAlien){
                GameCommunicationService.getAlienSentence()
                    .then(value => setSentence(value))
                    .catch(err => NotifyService.warn(err, "Could not fetch sentence"))
            }else {
                GameCommunicationService.getSentence()
                    .then(value => setSentence(value))
                    .catch(err => NotifyService.warn(err, "Could not fetch sentence"))
            }
        })
}

function fetchDrawTime(setDrawTime: (value: (((prevState: (number | null)) => (number | null)) | number | null)) => void) {
    GameCommunicationService.getDrawTime()
        .then(value => setDrawTime(value))
        .catch(err => NotifyService.warn(err, "Could not fetch draw time"))
}

function processWebSocketMessage(setMissingPlayers: (value: (((prevState: (string[] | null)) => (string[] | null)) | string[] | null)) => void, history: History, value: WebsocketMessage) {
    if(value.identifier === MessageIdentifiers.GAME_STATE_CHANGED &&
        value.message === "REVIEW") {
        history.push("/review")
    }else if(value.identifier === MessageIdentifiers.PLAYER_READY_CHANGED) {
        GameCommunicationService.getUploadMissing()
            .then(value => setMissingPlayers(value))
            .catch(reason => NotifyService.warn(reason, "Could not fetch msiing players"))
    }
}

function Draw(){
    let [sentence, setSentence] = useState<string|AlienSentence|null>(null);
    let [isAlien, setIsAlien] = useState(false);
    let [drawTime, setDrawTime] = useState<number|null>(null);
    let [missingPlayers, setMissingPlayers] = useState<null | string[]>(null);
    let [uploaded, setUploaded] = useState<boolean>(false);
    let history = useHistory();

    useEffect(
        () => {
            fetchSentence(setIsAlien, setSentence);
            fetchDrawTime(setDrawTime)
        }, [])

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(value => {
                processWebSocketMessage(setMissingPlayers, history, value)
            });
        return () => subscription.unsubscribe()
    },[history])

    return (
        <div className="d-flex p-3 flex-column h-100">
            <Card>
                <Card.Body>
                    <SentenceDisplay sentence={sentence} isAlien={isAlien}/>
                </Card.Body>
            </Card>
            <FreeDrawCanvas drawTime={drawTime} uploaded={()=> setUploaded(true)}/>
            <Modal show={uploaded}>
                <Modal.Header closeButton>
                    <Modal.Title>Waiting for others</Modal.Title>
                </Modal.Header>
                <Modal.Body>{missingPlayers?.map(value => <p key={value}>value<br/></p>)}</Modal.Body>
            </Modal>
        </div>
    )
}

export default Draw;