import {History} from "history";
import {WebsocketService} from "./WebsocketService";
import {GlobalCommunicationService} from "./GlobalCommunicationService";
import {NotifyService} from "./NotifyService";

export namespace GameService {

    export function redirectToCorrectPage(state: string, history: History) {
        switch (state) {
            case "":
                history.push("/")
                break;
            case "WAITING_TO_START":
                history.push("/lobby")
                break;
            case "EXPLAIN":
                history.push("/explain")
                break;
            case "DRAW":
                history.push("/draw")
                break;
            case "REVIEW":
                history.push("/review")
                break;
            case "VOTE":
                history.push("/vote")
                break;
            case "RESULT":
                history.push("/result")
                break;
        }
    }

    export function quit(): Promise<void> {
        WebsocketService.quit()
        return GlobalCommunicationService.quit()
            .catch(err => NotifyService.warn(err, "Could not quit"))
    }
}