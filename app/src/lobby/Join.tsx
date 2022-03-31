import {useHistory, useParams} from "react-router-dom";

import {useEffect, useState} from "react";
import {Alert, Button, Form, Modal, Spinner} from "react-bootstrap";
import {LobbyCommunicationService} from "../global/LobbyCommunicationService";
import {History, LocationState} from "history";

import {NotifyService} from "../global/NotifyService";
import {GlobalCommunicationService} from "../global/GlobalCommunicationService";
import {GameService} from "../global/GameService";


function onSubmit(name: string, setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                  history: History<LocationState>, gameId: string) {
    setLoading(true);
    LobbyCommunicationService.joinGame(name, gameId)
        .then(_ => {
            setLoading(false)
            history.push("/lobby")
        })
        .catch(reason => {
            setLoading(false)
            NotifyService.warn(reason, "Could not join game: ", true)
        })
}

function nameChanged(value: string, setName: (value: (((prevState: string) => string) | string)) => void, setNameError: (value: (((prevState: string) => string) | string)) => void) {
    setName(value)
    if (!value || value.length < 3) {
        setNameError("Player name needs at least 3 characters");
    } else {
        setNameError("");
    }
}

function quitGame(setOldGameState: (value: (((prevState: string) => string) | string)) => void) {
    GameService.quit()
        .then(_ => setOldGameState(""));
}

function backToGame(oldGameState: string, history: History) {
    GameService.redirectToCorrectPage(oldGameState, history);
}

function Join() {
    let {gameId} = useParams() as { gameId: string };
    let [loading, setLoading] = useState(false);
    let [name, setName] = useState("");
    let [nameError, setNameError] = useState("");
    let [oldGameState, setOldGameState] = useState("");
    let history: History = useHistory();

    useEffect(() => {
            GlobalCommunicationService.gameState()
                .then(value => {
                    setOldGameState(value);
                })
                .catch(reason => NotifyService.warn(reason, "Could not determine game state"));
        }
        , [])

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2>Join a game</h2>
            </div>
            <div className="row justify-content-center">
                <Form className="w-50" onSubmit={event => {
                    event.stopPropagation()
                    event.preventDefault()
                    onSubmit(name, setLoading, history, gameId)
                }}>
                    <Form.Group className="mb-3" controlId="hostForm">
                        <Form.Label>Your player name</Form.Label>
                        {nameError &&
                        <Form.Text className="">
                            <Alert variant="warning">
                                {nameError}
                            </Alert>
                        </Form.Text>
                        }
                        <Form.Control type="text" placeholder="Name"
                                      onChange={event => nameChanged(event.target.value, setName, setNameError)}/>
                    </Form.Group>
                    <Button variant="primary" onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        onSubmit(name, setLoading, history, gameId)
                    }} disabled={loading || nameError !== "" || name === ""}>
                        Join game
                    </Button>
                    {loading &&
                    <Spinner animation="border" variant="primary"/>
                    }
                </Form>
            </div>
            <Modal show={!!oldGameState}>
                <Modal.Header>
                    <Modal.Title>You are in a game already</Modal.Title>
                </Modal.Header>
                <Modal.Body>If you want to join a game first you have to leave the one you are currently
                    in.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={__dirname => quitGame(setOldGameState)}>
                        Leave game and join a new one
                    </Button>
                    <Button variant="primary" onClick={_ => backToGame(oldGameState, history)}>
                        Back to current game
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default Join;