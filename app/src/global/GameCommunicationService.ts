import {Environment} from "./Environment";


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
}