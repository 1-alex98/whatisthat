import {useParams} from "react-router-dom";

import {useState} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {LobbyCommunicationService} from "../global/LobbyCommunicationService";
import {useHistory} from "react-router-dom";
import {History, LocationState} from "history";

import {NotifyService} from "../global/NotifyService";


function onSubmit(name: string, setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                  history: History<LocationState>, gameId: string){
    setLoading(true);
    LobbyCommunicationService.joinGame(name, gameId)
        .then(response => {
            setLoading(false)
            history.push("/lobby")
        })
        .catch(reason => {
            setLoading(false)
            NotifyService.warn(reason, "Could not host game")
        })
}

function Join(){
    let {gameId}  = useParams() as {gameId:string};
    let [ loading, setLoading] = useState(false);
    let [ name, setName] = useState("");
    let history: History = useHistory();
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2>Join a game</h2>
            </div>
            <div className="row justify-content-center">
                <Form className="w-50">
                    <Form.Group className="mb-3" controlId="hostForm">
                        <Form.Label>Your player name</Form.Label>
                        <Form.Control type="text" placeholder="Name" onChange={event => setName(event.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        onSubmit(name, setLoading, history, gameId)
                    }} disabled={loading}>
                        Join game
                    </Button>
                    {loading &&
                    <Spinner animation="border" variant="primary" />
                    }
                </Form>
            </div>
        </div>
    )
}
export default Join;