import { Subject } from 'rxjs';

const notifyEventEmitter = new Subject<{message:string,level:"warning"|"info"}>();
export namespace NotifyService{

    export function warn(error: any, errorMessage: string){
        console.error(errorMessage+": "+error)
        notifyEventEmitter.next({
            message: errorMessage,
            level: "warning"
        })
    }

    export function subscribeToError(): Subject<{message:string,level:"warning"|"info"}>{
        return notifyEventEmitter
    }
}