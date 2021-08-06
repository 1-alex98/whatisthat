import {Environment} from "./Environment";

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
}