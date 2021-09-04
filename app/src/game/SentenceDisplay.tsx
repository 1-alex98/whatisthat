
import {GameCommunicationService, ImpostorSentence} from "../global/GameCommunicationService";
import {Button, OverlayTrigger, Popover} from "react-bootstrap";
import {useEffect, useState} from "react";
import {NotifyService} from "../global/NotifyService";
import {GlobalCommunicationService} from "../global/GlobalCommunicationService";

function alienSentence(sentence: ImpostorSentence) {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">{sentence.optionsName}</Popover.Header>
            <Popover.Body>
                {sentence.options.map(value => <p key={value}>{value}<br/></p>)}
            </Popover.Body>
        </Popover>
    );

    let splits = sentence.raw.split(`{${sentence.optionsName}}`);
    return <h2 className="flex-grow-1">{splits[0]}
        <OverlayTrigger placement="bottom" overlay={popover}>
            <span className="text-warning"><i className="fas fa-question"/> {sentence.optionsName} <i className="fas fa-question"/></span>
        </OverlayTrigger>
        {splits[1]}</h2>;
}

function loadFullSentence(setFullSentence: (value: (((prevState: (string | undefined)) => (string | undefined)) | string | undefined)) => void) {
    GameCommunicationService.getFullSentenceAsImpostor()
        .then(value => setFullSentence(value))
        .catch(reason => NotifyService.warn(reason, "Could not load full sentence"))
}

function showFullSentenceButton(setFullSentence: (value: (((prevState: (string | undefined)) => (string | undefined)) | string | undefined)) => void, fullSentenceActionLeft: number) {
    return <Button variant="outline-secondary" onClick={_ => loadFullSentence(setFullSentence)}>
        Hack to get full sentence<br/>
        {fullSentenceActionLeft} {fullSentenceActionLeft>1?"times":"time"} left
    </Button>;
}

function loadActionsLeft(setFullSentenceActionLeft: (value: (((prevState: number) => number) | number)) => void) {
    GlobalCommunicationService.getImpostorActionsLeft()
        .then(value => setFullSentenceActionLeft(value.fullSentence))
        .catch(reason => NotifyService.warn(reason, "Could not load actions left"))
}

function isFullSentenceActive(setFullSentence: (value: (((prevState: (string | undefined)) => (string | undefined)) | string | undefined)) => void) {
    GameCommunicationService.isFullSentenceActiveImpostor()
        .then(active => {
            if(active){
                loadFullSentence(setFullSentence)
            }
        }).catch(reason => NotifyService.warn(reason, "Could not check if full sentence was already requested"))
}

function SentenceDisplay(props: {sentence: string| ImpostorSentence |null, isImpostor: boolean}){

    let [fullSentenceActionLeft, setFullSentenceActionLeft] = useState(0);
    let [fullSentence, setFullSentence] = useState<undefined|string>(undefined);

    useEffect(() => {
        if(props.isImpostor){
            loadActionsLeft(setFullSentenceActionLeft)
            isFullSentenceActive(setFullSentence)
        }
    },[props])

    if(!props.sentence){
        return <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    }

    return (
        <div className="d-flex">
            {
                (!props.isImpostor || fullSentence) &&
                <h2 className="flex-grow-1">{props.isImpostor?fullSentence:props.sentence}</h2>
            }
            {
                props.isImpostor && !fullSentence &&
                alienSentence(props.sentence as ImpostorSentence)
            }
            {
                props.isImpostor && fullSentenceActionLeft > 0 && !fullSentence &&
                showFullSentenceButton(setFullSentence, fullSentenceActionLeft)
            }
        </div>
    )
}

export default SentenceDisplay;