import {useEffect, useState} from "react";
import { Card} from "react-bootstrap";
import SentenceDisplay from "./SentenceDisplay";
import {AlienSentence, GameCommunicationService} from "../global/GameCommunicationService";
import {NotifyService} from "../global/NotifyService";
import FreeDrawCanvas from "./FreeDrawCanvas";

function fetchSentence(setIsAlien: (value: (((prevState: boolean) => boolean) | boolean)) => void,
                       setSentence: (value: (((prevState: (string | AlienSentence | null)) => (string | AlienSentence | null)) | string | AlienSentence | null)) => void) {
    GameCommunicationService.getRole()
        .then(value => {
            const isAlien = value === 'alien'
            setIsAlien(isAlien)
            return isAlien
        })
        .then(isAlien => {
            if(isAlien){
                GameCommunicationService.getAlienSentence()
                    .then(value => setSentence(value))
                    .catch(err => NotifyService.warn(err, "Could not fetch sentence"))
            }else {
                GameCommunicationService.getSentence()
                    .then(value => setSentence(value))
                    .catch(err => NotifyService.warn(err, "Could not fetch sentence"))
            }
        })
}

function Draw(){
    let [sentence, setSentence] = useState<string|AlienSentence|null>(null);
    let [isAlien, setIsAlien] = useState(false);

    useEffect(
        () => {
            fetchSentence(setIsAlien, setSentence);

        }, [])

    return (
        <div className="d-flex p-3 flex-column h-100">
            <Card>
                <Card.Body>
                    <SentenceDisplay sentence={sentence} isAlien={isAlien}/>
                </Card.Body>
            </Card>
            <FreeDrawCanvas/>
        </div>
    )
}

export default Draw;