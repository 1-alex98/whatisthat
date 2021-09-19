import {useState} from "react";
import {Alert, Button, Form, Spinner} from "react-bootstrap";
import {LobbyCommunicationService} from "../global/LobbyCommunicationService";
import {useHistory} from "react-router-dom";
import {History, LocationState} from "history";
import {NotifyService} from "../global/NotifyService";

function onSubmit(name: string, setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                  history: History<LocationState>){
    setLoading(true);
    LobbyCommunicationService.hostGame(name)
        .then(response => {
            setLoading(false)
            history.push("/lobby")
        })
        .catch(reason => {
            setLoading(false)
            NotifyService.warn(reason, "Could not host game: ", true)
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

function Host() {
    let [loading, setLoading] = useState(false);
    let [name, setName] = useState("");
    let [nameError, setNameError] = useState("");
    let history: History = useHistory();
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2>Host a game</h2>
            </div>
            <div className="row justify-content-center">
                <Form className="w-50">
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
                        onSubmit(name, setLoading, history)
                    }} disabled={loading || nameError !== "" || name === ""}>
                        Host game
                    </Button>
                    {loading &&
                        <Spinner animation="border" variant="primary" />
                    }
                </Form>
            </div>
        </div>
    )
}

export default Host;