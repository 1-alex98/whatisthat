import {useEffect, useState} from "react";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";
import {GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import {Button, Card, Modal} from "react-bootstrap";
import {VoteCommunicationService} from "../global/VoteCommunicationService";
import "./Vote.css"

function fetchPlayers(setPlayers: (value: (((prevState: string[]) => string[]) | string[])) => void) {
    VoteCommunicationService.getPlayersToVote()
        .then(value => setPlayers(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch players."))
}

function listenWaitingForAndGameState(history: History, setMissingPlayers: (value: (((prevState: string[]) => string[]) | string[])) => void, message: WebsocketMessage) {
    if(message.identifier === MessageIdentifiers.PLAYER_READY_CHANGED){
        GameCommunicationService.missingReady()
            .then(value => setMissingPlayers(value))
            .catch(reason => NotifyService.warn(reason, "Could not fetch missing players"))
    } else if(message.identifier === MessageIdentifiers.GAME_STATE_CHANGED){
        if(message.message === "RESULT"){
            history.push("/result")
        }
    }
}

function playerSelected(setSelectedPlayer: (value: (((prevState: (string | undefined)) => (string | undefined)) | string | undefined)) => void, name: string) {
    setSelectedPlayer(name);
}

function playerCard(name: string, selectedPlayer: string | undefined, setSelectedPlayer: (value: (((prevState: (string | undefined)) => (string | undefined)) | string | undefined)) => void) {
    return <Card
        bg={"light"}
        key={name}
        text={ 'dark'}
        style={{ width: '18rem' }}
        className={"m-2 clickable "+(selectedPlayer === name?"card-selected":"")}
        onClick={()=>playerSelected(setSelectedPlayer, name)}
    >
        <Card.Body>
            <Card.Title>{name}</Card.Title>
        </Card.Body>
    </Card>;
}

function submit(setReady: (value: (((prevState: boolean) => boolean) | boolean)) => void, selectedPlayer: string | undefined) {
    VoteCommunicationService.vote(selectedPlayer as string)
        .then(_ => setReady(true))
        .catch(err => NotifyService.warn(err, "Could not submit vote."))

}

function Vote(){
    let [players, setPlayers] = useState<string[]>([]);
    let [selectedPlayer, setSelectedPlayer] = useState<string|undefined>(undefined);
    let [ready, setReady] = useState(false);
    let [missingPlayers, setMissingPlayers] = useState<string[]>([]);
    let history = useHistory();

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(message => listenWaitingForAndGameState(history, setMissingPlayers, message));
        return () => subscription.unsubscribe()
    },[history])

    useEffect(() => {
        fetchPlayers(setPlayers)
    },[])

    return (
        <div className="d-flex p-3 flex-column h-100">
            <h2>Who is the impostor? Select:</h2>
            <div className="d-flex flex-wrap align-content-center justify-content-center">
                {players.map(name => playerCard(name, selectedPlayer, setSelectedPlayer))}
            </div>
            <div>
                <Button variant="primary" onClick={_ => submit(setReady, selectedPlayer)} disabled={!selectedPlayer}>
                    Submit
                </Button>
            </div>
            <Modal show={ready}>
                <Modal.Header>
                    <Modal.Title>Waiting for others</Modal.Title>
                </Modal.Header>
                <Modal.Body>{missingPlayers?.map(value => <p key={value}>{value}<br/></p>)}</Modal.Body>
            </Modal>
        </div>
    )
}

export default Vote;