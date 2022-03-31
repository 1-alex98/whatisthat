import { Link } from "react-router-dom";
import {Button} from "react-bootstrap";

function Main() {
    return (
        <div>
            <h1>What is that?</h1>
            <div>
                <p><b>What is that</b> is a drawing game you can play with your friends in the browser.</p>
                <p>The <b>impostor</b> plays against the <b>crew</b>. The crew's objective is to find the impostor and vote him out at the end of the game.</p>
                <p>Every body gets the same sentence to draw. Only the <b>impostor</b> does not know part of the sentence. Find out who did not know what he was drawing when reviewing the drawings.</p>
                <p>Click on the link provided by the host or host your own game below.</p>
            </div>
            <Link to="/host">
                <Button variant="outline-primary">
                    Host
                </Button>
            </Link>
        </div>
    );
}
export default Main;