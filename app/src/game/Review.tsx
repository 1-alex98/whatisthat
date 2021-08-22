import {useEffect, useState} from "react";
import {DrawnImage, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import {Card, Carousel, Modal} from "react-bootstrap";
import Timer from "./Timer";
import {MessageIdentifiers, WebsocketMessage, WebsocketService} from "../global/WebsocketService";
import {useHistory} from "react-router-dom";
import {History} from "history";


function fetchSentence(setSentence: (value: (((prevState: string) => string) | string)) => void) {
    GameCommunicationService.getSentenceReview()
        .then(sentence => setSentence(sentence))
        .catch(reason => NotifyService.warn(reason, "Could not fetch sentence"))
}

function fetchTimeout(setTimeout: (value: number|undefined)=> void) {
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
    if(message.identifier === MessageIdentifiers.GAME_STATE_CHANGED && message.message === "DRAW"){
        history.push("/draw")
    }
    if(message.identifier === MessageIdentifiers.GAME_STATE_CHANGED && message.message === "VOTE"){
        history.push("/vote")
    }
}

function Review(){
    let [images, setImages] = useState<DrawnImage[]>();
    let [sentence, setSentence] = useState("");
    let [ready, setReady] = useState(false);
    let [missingPlayers, setMissingPlayers] = useState<string[]>([]);
    let [timeout, setTimeout] = useState<undefined|number>();
    let history = useHistory();

    useEffect(() => {
        let subscription = WebsocketService.listenMessage()
            .subscribe(message => listenMissingPlayersAndGameState(setMissingPlayers, history, message));
        return () => subscription.unsubscribe()
    }, [history])


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
        </div>
    )
}

export default Review;