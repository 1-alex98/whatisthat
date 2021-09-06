import {useEffect, useState} from "react";
import styles from "./Timer.module.css"
function Timer(props:{timerFinished: () => void; time:number|undefined}){

    const [counter, setCounter] = useState<number|null>(null);
    useEffect(() => {
        if(counter && counter > 0)
            setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);
    useEffect(() => {
        if(props.time && !counter){
            setCounter(props.time)
        }
    },[props, counter])
    useEffect(() => {
        if(counter === 0)
            props.timerFinished()
    },[counter, props])

    return (
        <div className={styles.counter}>
            <div className={styles.innerCounter}>
                <p>{counter||''}</p>
            </div>
        </div>
    )
}

export default Timer;
