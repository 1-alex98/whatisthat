import {useEffect, useState} from "react";
import {VoteCommunicationService} from "../global/VoteCommunicationService";
import {NotifyService} from "../global/NotifyService";
import {LobbyCommunicationService} from "../global/LobbyCommunicationService";
import {Button} from "react-bootstrap";
import {GlobalCommunicationService} from "../global/GlobalCommunicationService";
import {useHistory} from "react-router-dom";
import {MessageIdentifiers, WebsocketService} from "../global/WebsocketService";
import {Bar, BarChart, ResponsiveContainer, XAxis} from "recharts";


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

function fetchIsHost(setHost: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    LobbyCommunicationService.isHost()
        .then(value => setHost(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch if you are the host."))
}

function restart() {
    GlobalCommunicationService.reset()
        .catch(err => NotifyService.warn(err, "Could not restart game"))
}

function ResultGraph() {
    let [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setData([
            {
                name: 'Player A',
                votes: 1
            },
            {
                name: 'Player B',
                votes: 2
            },
            {
                name: 'Player C',
                votes: 0
            }
        ])
    }, [])

    return (
        <ResponsiveContainer width="50%" height="50%" className="d-none">
            <BarChart width={150} height={40} data={data}>
                <Bar dataKey="votes" fill="#0d6efd"/>
                <XAxis dataKey="name"/>
            </BarChart>
        </ResponsiveContainer>
    );
}

function Result() {
    let [winner, setWinner] = useState("crew");
    let [impostor, setImpostor] = useState("unknown");
    let [isHost, setIsHost] = useState(false);
    let history = useHistory();

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(value => {
                if(value.identifier === MessageIdentifiers.GAME_STATE_CHANGED && value.message === "WAITING_TO_START"){
                    history.push("/lobby")
                }
            });
        return () => subscription.unsubscribe()
    },[history])

    useEffect(() => {
        fetchImpostor(setImpostor)
        fetchWinner(setWinner)
        fetchIsHost(setIsHost)
    },[])

    return (
        <div className="d-flex p-3 flex-column h-100 align-items-center">
            <h2>Impostor: <span className="text-primary">{impostor}</span></h2>
            <h2 className="mb-2">Winner: <span className="text-primary">{winner}</span></h2>
            <ResultGraph/>
            <div className="mt-5">
                <Button hidden={!isHost} onClick={() => restart()}>
                    Another game
                </Button>
            </div>
        </div>
    )
}

export default Result;