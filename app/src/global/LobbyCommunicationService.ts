import {Environment} from "./Environment";


export interface Player {
    name:string,
    connected:boolean,
    host:boolean,
}

export namespace LobbyCommunicationService{
    export function hostGame(name: string): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/host",
            {
                method: "POST",
                body: JSON.stringify({
                  name: name
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(value => {
                if(value.status !== 201) {
                    throw value.text()
                }
                return value.text()
            })
    }

    export function players(): Promise<Player[]>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/players",
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
                return value.json()
            })
    }

    export function gameId(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/invite-id",
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

    export function joinGame(name: string, gameId: string) {
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/join",
            {
                method: "POST",
                body: JSON.stringify({
                    playerName: name,
                    gameId: gameId
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(value => {
                if(value.status !== 201) {
                    throw value.text()
                }
                return value.text()
            })
    }

    export function isHost() : Promise<boolean>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/host",
            {
                method: "GET"
            })
            .then(value => {
                if(value.status !== 200) {
                    throw value.text()
                }
                return value.json()
            })
    }

    export function start(rounds: number) : Promise<void>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/lobby/start",
            {
                method: "POST",
                body: JSON.stringify({
                    rounds: rounds
                }),
                headers: {
                    "Content-Type": "application/json"
                }

            })
            .then(value => {
                if(value.status !== 200) {
                    throw value.text()
                }
            })
    }
}