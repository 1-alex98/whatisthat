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

    export function getDrawTime(): Promise<number>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/draw-time",
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

    export function getUploadMissing(): Promise<string[]>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/upload-missing",
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

    export function uploadImage(dataURL: string | undefined) : Promise<void> {
        if(!dataURL){
            throw new Error("Data url needs to be present")
        }
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/upload-image",
            {
                method: "POST",
                body: dataURL,
                headers: {
                    "Content-Type": "application/text"
                }
            })
            .then(value => {
                if(value.status !== 201) {
                    throw value.text()
                }
            })
    }
}