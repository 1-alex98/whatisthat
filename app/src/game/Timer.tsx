import {useEffect, useRef, useState} from "react";
import styles from "./Timer.module.css"
import {Button} from "react-bootstrap";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


function calculateCounter(setCounter: (value: (((prevState: (number | null)) => (number | null)) | number | null)) => void, time: number | undefined, startTime: React.MutableRefObject<number | undefined>) {
    let timeSpentInSeconds = (Date.now() - (startTime.current as number)) / 1000;
    setCounter(Math.floor(time as number - timeSpentInSeconds));
}

function Timer(props: { timerFinished: () => void; time: number | undefined }) {

    const [counter, setCounter] = useState<number | null>(null);
    const [stopped, setStopped] = useState(false);
    let startTime = useRef<number>();
    useEffect(() => {
        if (counter && counter > 0 && !stopped)
            setTimeout(() => calculateCounter(setCounter, props.time, startTime), 1000);
    }, [counter, stopped, startTime, props.time]);
    useEffect(() => {
        if (props.time && counter == null) {
            startTime.current = Date.now()
            setCounter(props.time)
        }
    }, [props, counter])
    useEffect(() => {
        if (counter != null && counter <= 0)
            props.timerFinished()
    },[counter, props])

    return (
        <div>
            <div className={styles.counter}>
                <div className={styles.innerCounter}>
                    <p>{counter || ''}</p>
                </div>
            </div>
            {development &&
            <Button onClick={_ => setStopped(true)}>
                Stop
            </Button>
            }
            {development &&
            <Button onClick={_ => props.timerFinished()}>
                Skip
            </Button>
            }

        </div>
    )
}

export default Timer;
