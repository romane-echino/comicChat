import { machine } from "os";

export const serverUrl = 'https://192.168.1.207:3031';

export class ComicTon {
    private static instance: ComicTon;
    private phoneNumber: string | null = null;
    private code: string | null = null;
    private token: string | null = null;
    private uniqueId: string;

    private constructor() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        const browserInfo = [
            navigator.userAgent,
            navigator.language,
            screen.width,
            screen.height,
            window.devicePixelRatio
        ].join('|');

        // Create hash from combined info
        this.uniqueId = Buffer.from(`${timestamp}-${random}-${browserInfo}`).toString('base64')
    }

    public static getInstance(): ComicTon {
        if (!ComicTon.instance) {
            ComicTon.instance = new ComicTon();
        }
        return ComicTon.instance;
    }

    public setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    public getPhoneNumber(): string | null {
        return this.phoneNumber;
    }

    public setCode(code: string): void {
        this.code = code;
    }

    public getCode(): string | null {
        return this.code;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getToken(): string | null {
        return this.token;
    }

    public getUniqueId(): string {
        return this.uniqueId;
    }

    public save(): void {
        localStorage.setItem('comic_token', JSON.stringify(this.token));
    }

    public ToString(): string {
        return JSON.stringify(this);
    }
}

export class ComicToken {

    constructor(token: string) {
        this._token = token;
    }

    private _token: string;

    static async register(phoneNumber: string) {
        let response: any = {};
        try {
            console.log('Attempting to register:', phoneNumber);
            console.log('Server URL:', serverUrl + '/api/auth/register');
            let body = JSON.stringify({ phoneNumber });
            console.log('Body:', body);
            try {
                response = await fetch(`${serverUrl}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phoneNumber }),
                    // For development, accept self-signed certificates
                    mode: 'cors',
                    credentials: 'same-origin'
                });
            }
            catch (error:any) {
                console.log('::Request error', error);
                throw new Error(`Failed to register: ${error.message}`);
            }

            console.log('Request ok', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Request error', errorText);
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            ComicTon.getInstance().setPhoneNumber(phoneNumber);
            return true;
        } catch (error:any) {
            console.error('Registration error details:', error);
            throw new Error(`Failed to register: ${error.message} ${response.statusText}`);
        }
    }

    static async validateCode(code: string): Promise<boolean> {
        try {
            let jsonBody = JSON.stringify({
                code: code,
                phoneNumber: ComicTon.getInstance().getPhoneNumber(),
                uniqueId: ComicTon.getInstance().getUniqueId(),
                agent: navigator.userAgent
            });
            console.log('validateCode::jsonBody', jsonBody);
            const response = await fetch(serverUrl + '/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonBody
            });
            console.log('validateCode::response', response.status);

            const data = await response.json();

            console.log('validateCode::data', data);
            if (!data.token) {
                throw new Error('Code validation failed');
            }

            ComicTon.getInstance().setCode(code);
            ComicTon.getInstance().setToken(data.token);
            console.log(ComicTon.getInstance().ToString());
            ComicTon.getInstance().save();
            return true;
        } catch (error) {
            throw new Error('Failed to validate code');
        }

    }

    static async validateToken(token: string): Promise<boolean> {

        console.log('validateToken::token', token);
        try {
            const response = await fetch(serverUrl + '/api/auth/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
            });

            if (!response.ok) {
                throw new Error('Token validation failed');
            }

            ComicTon.getInstance().setToken(token);
            ComicTon.getInstance().save();
            return true;
        } catch (error) {
            throw new Error('Failed to validate token');
        }
    }
}