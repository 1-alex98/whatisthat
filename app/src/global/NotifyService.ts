import {Subject} from 'rxjs';

const notifyEventEmitter = new Subject<{message:string,level:"warning"|"info"}>();
export namespace NotifyService {

    export async function warn(error: any, errorMessage: string, includeError = false) {
        if (error instanceof Promise) {
            error = await error
        }
        console.error(errorMessage + ": " + error)
        notifyEventEmitter.next({
            message: errorMessage + (includeError ? error : ""),
            level: "warning"
        })
    }

    export function subscribeToError(): Subject<{ message: string, level: "warning" | "info" }> {
        return notifyEventEmitter
    }
}