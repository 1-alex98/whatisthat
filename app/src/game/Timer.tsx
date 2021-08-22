import {useEffect, useState} from "react";
import "./Timer.css"

function Timer(props:{timerFinished: () => void; time:number|undefined}){

    const [counter, setCounter] = useState(-10);
    useEffect(() => {
        if(counter > 0)
            setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);
    useEffect(() => {
        if(props.time && counter === -10){
            setCounter(props.time)
        }
    },[props, counter])
    useEffect(() => {
        if(counter === 0)
            props.timerFinished()
    },[counter, props])

    return (
        <div className="counter">
            <div className="inner-counter">
                <p>{counter}</p>
            </div>
        </div>
    )
}

export default Timer;