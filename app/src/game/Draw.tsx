import {useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import SentenceDisplay from "./SentenceDisplay";
import {ImpostorSentence, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import FreeDrawCanvas from "./FreeDrawCanvas";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";

function fetchSentence(setIsImpostor: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                       setSentence: (value: (((prevState: (string | ImpostorSentence | null)) => (string | ImpostorSentence | null)) | string | ImpostorSentence | null)) => void) {
    GameCommunicationService.getRole()
        .then(value => {
            const isImpostor = value === 'impostor'
            setIsImpostor(isImpostor)
            return isImpostor
        })
        .then(isImpostor => {
            if(isImpostor){
                GameCommunicationService.getImpostorSentence()
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
            .catch(reason => NotifyService.warn(reason, "Could not fetch missing players"))
    }
}

function Draw(){
    let [sentence, setSentence] = useState<string|ImpostorSentence|null>(null);
    let [isImpostor, setIsImpostor] = useState(false);
    let [drawTime, setDrawTime] = useState<number|null>(null);
    let [missingPlayers, setMissingPlayers] = useState<null | string[]>(null);
    let [uploaded, setUploaded] = useState<boolean>(false);
    let history = useHistory();

    useEffect(
        () => {
            fetchSentence(setIsImpostor, setSentence);
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
                    <SentenceDisplay sentence={sentence} isImpostor={isImpostor}/>
                </Card.Body>
            </Card>
            <FreeDrawCanvas drawTime={drawTime} uploaded={()=> setUploaded(true)}/>
            <Modal show={uploaded}>
                <Modal.Header>
                    <Modal.Title>Waiting for others</Modal.Title>
                </Modal.Header>
                <Modal.Body>{missingPlayers?.map(value => <p key={value}>{value}<br/></p>)}</Modal.Body>
            </Modal>
        </div>
    )
}

export default Draw;