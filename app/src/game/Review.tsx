import {useEffect, useState} from "react";
import {DrawnImage, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import {Button, Card, Carousel, Modal} from "react-bootstrap";
import Timer from "./Timer";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";
import {VoteCommunicationService} from "../global/VoteCommunicationService";
import {GlobalCommunicationService} from "../global/GlobalCommunicationService";


function fetchSentence(setSentence: (value: (((prevState: string) => string) | string)) => void) {
    GameCommunicationService.getSentenceReview()
        .then(sentence => setSentence(sentence))
        .catch(reason => NotifyService.warn(reason, "Could not fetch sentence"))
}

function fetchTimeout(setTimeout: (value: number | undefined) => void) {
    GameCommunicationService.getReviewTimeout()
        .then(timeout => setTimeout(timeout))
        .catch(reason => NotifyService.warn(reason, "Could not fetch timeout"))
}

function fetchImages(setImages: (value: (((prevState: (DrawnImage[] | undefined)) => (DrawnImage[] | undefined)) | DrawnImage[] | undefined)) => void) {
    GameCommunicationService.getReviewImages()
        .then(images => setImages(images))
        .catch(reason => NotifyService.warn(reason, "Could not fetch images"))
}

function image(value: DrawnImage) {
    return <Carousel.Item key={value.name}>
        <img
            src={value.dataUrl}
            className="w-100 h-100 objectfit-conatin"
            alt="Image"
        />
        <Carousel.Caption>
            <h3 className="text-primary">{value.name}</h3>
        </Carousel.Caption>
    </Carousel.Item>;
}

function readyUp(setReady: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    GameCommunicationService.ready()
        .then(_ => setReady(true))
        .catch(reason => NotifyService.warn(reason, "Could not send server ready state."))
}

function listenMissingPlayersAndGameState(setMissingPlayers: (value: (((prevState: string[]) => string[]) | string[])) => void, history: History, message: WebsocketMessage) {
    if(message.identifier === MessageIdentifiers.PLAYER_READY_CHANGED){
        GameCommunicationService.missingReady()
            .then(missing => setMissingPlayers(missing))
            .catch(reason => NotifyService.warn(reason, "Could fetch missing players."))
    }
    if (message.identifier === MessageIdentifiers.GAME_STATE_CHANGED && message.message === "DRAW") {
        history.push("/draw")
    }
    if (message.identifier === MessageIdentifiers.GAME_STATE_CHANGED && message.message === "VOTE") {
        history.push("/vote")
    }
}

function hackPlayer(playerName: string, setHackDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void, setPlayerHacked: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    GameCommunicationService.hackPlayerAsImpostor(playerName)
        .then(_ => {
            setHackDialog(false)
            setPlayerHacked(true)
        })
        .catch(reason => NotifyService.warn(reason, "Could not hack player"))
}

function loadIsImpostor(setIsImpostor: (value: (((prevState: boolean) => boolean) | boolean)) => void) {
    GameCommunicationService.getRole()
        .then(value => setIsImpostor(value === "impostor"))
        .catch(reason => NotifyService.warn(reason, "Could not determine if you are the impostor"))
}

function loadOtherPlayers(setOtherPlayers: (value: (((prevState: string[]) => string[]) | string[])) => void) {
    VoteCommunicationService.getPlayersToVote()
        .then(value => setOtherPlayers(value))
        .catch(reason => NotifyService.warn(reason, "Could not fetch players to vote"))
}

function loadImpostorActionsLeft(setHacksLeftCount: (value: (((prevState: number) => number) | number)) => void) {
    GlobalCommunicationService.getImpostorActionsLeft()
        .then(value => setHacksLeftCount(value.hacking))
        .catch(reason => NotifyService.warn(reason, "Could not load actions left"))
}

function Review() {
    let [images, setImages] = useState<DrawnImage[]>();
    let [sentence, setSentence] = useState("");
    let [ready, setReady] = useState(false);
    let [hackDialog, setHackDialog] = useState(false);
    let [playerHacked, setPlayerHacked] = useState(false);
    let [hacksLeftCount, setHacksLeftCount] = useState(0);
    let [missingPlayers, setMissingPlayers] = useState<string[]>([]);
    let [otherPlayers, setOtherPlayers] = useState<string[]>([]);
    let [isImpostor, setIsImpostor] = useState<boolean>(false);
    let [timeout, setTimeout] = useState<undefined | number>();
    let history = useHistory();

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(message => listenMissingPlayersAndGameState(setMissingPlayers, history, message));
        return () => subscription.unsubscribe()
    }, [history])

    useEffect(() => {
        loadIsImpostor(setIsImpostor);
        loadOtherPlayers(setOtherPlayers);
    }, [])

    useEffect(() => {
        if (isImpostor) {
            loadImpostorActionsLeft(setHacksLeftCount);
        }
    }, [isImpostor])


    useEffect(() => {
        fetchSentence(setSentence)
        fetchImages(setImages)
        fetchTimeout(setTimeout)
    }, [])

    return (
        <div className="d-flex p-3 flex-column h-100">
            <Card>
                <Card.Body>
                    <h2>{sentence}</h2>
                </Card.Body>
            </Card>
            <div className="d-flex m-2">
                <div className="flex-grow-1">
                    <Button hidden={!isImpostor || hacksLeftCount < 0 || playerHacked} variant="outline-secondary"
                            onClick={_ => setHackDialog(true)}>
                        Hack Player ({hacksLeftCount} times left)
                    </Button>
                </div>
                <Timer timerFinished={() => readyUp(setReady)} time={timeout}/>
            </div>
            <Carousel interval={20000}>
                {images?.map(value => image(value))}
            </Carousel>
            <Modal show={ready}>
                <Modal.Header>
                    <Modal.Title>Waiting for others</Modal.Title>
                </Modal.Header>
                <Modal.Body>{missingPlayers?.map(value => <p key={value}>{value}<br/></p>)}</Modal.Body>
            </Modal>
            <Modal show={hackDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Selected player to be hacked</Modal.Title>
                </Modal.Header>
                <Modal.Body>{otherPlayers?.map(value => <Button variant="outline-secondary" key={value}
                                                                onClick={_ => hackPlayer(value, setHackDialog, setPlayerHacked)}>{value}</Button>)}</Modal.Body>
            </Modal>
        </div>
    )
}

export default Review;
