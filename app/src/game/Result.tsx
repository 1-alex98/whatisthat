import {useEffect, useState} from "react";
import {VoteCommunicationService} from "../global/VoteCommunicationService";
import {NotifyService} from "../global/NotifyService";


function fetchWinner(setWinner: (value: (((prevState: string) => string) | string)) => void) {
    VoteCommunicationService.winner()
        .then(value => setWinner(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch winner."))
}

function fetchImpostor(setImpostor: (value: (((prevState: string) => string) | string)) => void) {
    VoteCommunicationService.impostor()
        .then(value => setImpostor(value))
        .catch(err => NotifyService.warn(err, "Could not fetch impostor."))
}

function Result(){
    let [winner, setWinner] = useState("crew");
    let [impostor, setImpostor] = useState("unknown");

    useEffect(() => {
        fetchImpostor(setImpostor)
        fetchWinner(setWinner)
    },[])

    return (
        <div className="d-flex p-3 flex-column h-100">
            <h2>Impostor: <span className="text-primary">{impostor}</span></h2>
            <h2>Winner: <span className="text-primary">{winner}</span></h2>
        </div>
    )
}

export default Result;