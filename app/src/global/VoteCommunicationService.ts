import {Environment} from "./Environment";


export namespace VoteCommunicationService{
    export function getPlayersToVote(): Promise<string[]>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/votable-players",
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

    export function winner(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/winner",
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

    export function impostor(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/impostor",
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

    export function vote(selectedPlayer: string): Promise<void>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/game/vote",
            {
                method: "POST",
                body: selectedPlayer,
                headers: {
                    "Content-Type": "application/text"
                }
            })
            .then(value => {
                if(value.status !== 201) {
                    throw value.text()
                }
                return
            })
    }

}