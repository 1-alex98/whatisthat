import {useParams} from "react-router-dom";


function Join(){
    let {gameId}  = useParams() as {gameId:string};

    return (
        <p> Join component working</p>
    )
}

export default Join;