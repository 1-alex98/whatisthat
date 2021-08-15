import { Link } from "react-router-dom";
import {Button} from "react-bootstrap";

function Main() {
    return (
        <div>
            <h1>What is that?</h1>
            <p>Lorem ipsum bla bla bla</p>
            <Link to="/host">
                <Button variant="outline-primary">
                    Host
                </Button>
            </Link>
        </div>
    );
}
export default Main;