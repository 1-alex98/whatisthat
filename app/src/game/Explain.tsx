import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";

function fetchRole(setRole: (value: (((prevState: string) => string) | string)) => void) {
    GameCommunicationService.getRole()
        .then(value => setRole(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch role"))
}

function fetchRounds(setRounds: (value: (((prevState: number) => number) | number)) => void) {
    GameCommunicationService.getRounds()
        .then(value => setRounds(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch rounds"))
}

function Explain(){
    let [role, setRole] = useState("alien");
    let [rounds, setRounds] = useState(6);
    useEffect(() =>{
        fetchRole(setRole);
        fetchRounds(setRounds);
    },[])
    return (
        <div className="d-flex p-3 flex-column">
            <div>
                <h2 className="text-primary mb-5">Your role: {role}</h2>
            </div>
            <div>
                <h3>How the game works</h3>
                <p>Lorem ipsum bla bla bla rounds: {rounds}</p>
            </div>
            <div>
                <Button variant="primary" >
                    Start
                </Button>
            </div>
        </div>
    )
}

export default Explain;