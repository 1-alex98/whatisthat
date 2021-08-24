import {Environment} from "./Environment";
import {Subject} from "rxjs";
import {NotifyService} from "./NotifyService";

export enum MessageIdentifiers {
    PLAYERS_CHANGE = 1,
    GAME_STATE_CHANGED = 2,
    PLAYER_READY_CHANGED = 3
}

export interface WebsocketMessage {
    identifier: number;
    message: string;
}

class AsyncLock {
    public disable: () => void;
    public promise: Promise<void>;
    constructor () {
        this.disable = () => {}
        this.promise = Promise.resolve()
    }

    enable () {
        this.promise = new Promise(resolve => this.disable = resolve)
    }
}

function getWebsocketToken() :Promise<string>{
    let apiUrl = Environment.getApiUrl();
    return fetch(`${apiUrl}/token`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(value => {
            if(value.status !== 200) {
                throw value.text()
            }
            return value.text()
        })
}

export namespace WebsocketService{
    const websocketEventSubmitter = new Subject<WebsocketMessage>()
    const lock = new AsyncLock()
    const connectedEventSubmitter = new Subject<boolean>()
    let connectedState = false;
    let ws: WebSocket;

    function setConnected(connected: boolean) {
        connectedEventSubmitter.next(connected);
        connectedState = connected
    }

    export function getConnected() : boolean {
        return connectedState
    }

    export function quit(){
        ws.onclose = null;
        ws.onopen = null;
        try {
            ws.close()
        } catch (ignored) {}
        setConnected(false)
    }

    export async function connect(){
        await lock.promise
        lock.enable()
        let url = `${window.location.protocol==="https:"?"wss":"ws"}://${window.location.host}/api/ws/listen`;
        if(ws){
            quit()
        }
        ws = new WebSocket(url)
        console.log(`Connecting ws to ${url}`)
        ws.onopen = _ => {
            if(ws.readyState === ws.CONNECTING){
                return;
            }
            getWebsocketToken()
                .then(value => ws.send(value))
            setConnected(true);
        }

        ws.onclose = ev => {
            setConnected(false)
            NotifyService.warn(ev, "Connection to server closed")
        }

        ws.onerror = ev => {
            setConnected(false)
            NotifyService.warn(ev, "Connection to server closed")
        }

        ws.onmessage = ev => {
            let data = ev.data;
            let message = JSON.parse(data) as WebsocketMessage;
            websocketEventSubmitter.next(message)
        }
        lock.disable()
    }

    export function listenConnect(): Subject<boolean>{
        return connectedEventSubmitter
    }

    export function listenMessage(): Subject<WebsocketMessage>{
        return websocketEventSubmitter
    }
}