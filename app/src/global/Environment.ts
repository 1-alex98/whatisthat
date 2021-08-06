export namespace Environment{
    export function getApiUrl(): string{
        return process.env.REACT_APP_BACKEND_URL as string;
    }
}