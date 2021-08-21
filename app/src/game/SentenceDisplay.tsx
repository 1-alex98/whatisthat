
import {AlienSentence} from "../global/GameCommunicationService";
import {OverlayTrigger, Popover} from "react-bootstrap";

function alienSentence(sentence: AlienSentence) {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">{sentence.optionsName}</Popover.Header>
            <Popover.Body>
                {sentence.options.map(value => <p key={value}>{value}<br/></p>)}
            </Popover.Body>
        </Popover>
    );

    let splits = sentence.raw.split(`{${sentence.optionsName}}`);
    return <h2>{splits[0]}
        <OverlayTrigger placement="bottom" overlay={popover}>
            <span className="text-warning"><i className="fas fa-question"/> {sentence.optionsName} <i className="fas fa-question"/></span>
        </OverlayTrigger>
        {splits[1]}</h2>;
}

function SentenceDisplay(props: {sentence: string|AlienSentence|null, isAlien: boolean}){

    if(!props.sentence){
        return <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    }

    return (
        <div>
            {
                !props.isAlien &&
                <h2>{props.sentence}</h2>
            }
            {
                props.isAlien &&
                alienSentence(props.sentence as AlienSentence)
            }
        </div>
    )
}

export default SentenceDisplay;