export default class Api {
    public static endpoint = import.meta.env.VITE_APP_API_ENDPOINT;

    public static async get(path: string, body?: any, options?: any): Promise<any> {
        const request = await fetch(path, {
            method: 'GET',
            body
        });
        return request.json();
    }


    public static async post(path: string, body: string, options?: any): Promise<any> {
        try {
            const request = await fetch(path, {
                method: 'POST',
                headers: {
                },
                body
            });
            return request.json();
        } catch (e) {
            return null;
        }
    }
}