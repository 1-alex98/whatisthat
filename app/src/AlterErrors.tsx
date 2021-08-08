import {useEffect, useState} from "react";
import {Alert} from "react-bootstrap";
import {NotifyService} from "./global/NotifyService";


function AlertErrors(): JSX.Element | null{
    const [show, setShow] = useState(false);
    const [level, setLevel] = useState("info");
    const [error, setError] = useState("");
    useEffect(() => {
        let subscription = NotifyService.subscribeToError()
            .subscribe(value => {
                setShow(true)
                setError(value.message)
                setLevel(value.level)
            });
        return () => subscription.unsubscribe()
    },[])

    if(show){
        return (
        <Alert variant={level} onClose={() => setShow(false)} dismissible>
            {error}
        </Alert>
        )
    }
    return null;
}

export default AlertErrors;