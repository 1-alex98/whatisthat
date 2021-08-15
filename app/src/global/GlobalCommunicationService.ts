import {Environment} from "./Environment";

export namespace GlobalCommunicationService{
    export function gameState(): Promise<string>{
        let apiUrl = Environment.getApiUrl();
        return fetch(apiUrl + "/global/game-state",
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