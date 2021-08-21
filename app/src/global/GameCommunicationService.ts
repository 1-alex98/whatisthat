import {Environment} from "./Environment";

export interface AlienSentence {
    raw: string;
    optionsName: string;
    options: string[];
}

export namespace GameCommunicationService{
    export function getRounds(): Promise<number>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/rounds",
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

    export function getRole(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/role",
            {
                method: "GET"
            })
            .then(value => {
                if(value.status !== 200) {
                    throw value.text()
                }
                return value.text()
            })
    }
    export function ready(): Promise<void>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/ready",
            {
                method: "Post"
            })
            .then(value => {
                if(value.status !== 200) {
                    throw value.text()
                }
                return
            })
    }
    export function missingReady(): Promise<string[]>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/ready-missing",
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


    export function getSentence(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/sentence-crew",
            {
                method: "GET"
            })
            .then(value => {
                if(value.status !== 200) {
                    throw value.text()
                }
                return value.text()
            })
    }

    export function getAlienSentence(): Promise<AlienSentence>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/sentence-alien",
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
}