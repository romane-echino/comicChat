class ComicTon {
    private static instance: ComicTon;
    private phoneNumber: string | null = null;
    private code: string | null = null;
    private token: string | null = null;

    private constructor() { }

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
        try {
            console.log('generateToken::phoneNumber', phoneNumber);
            const response = await fetch('http://localhost:3030/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber })
            });

            if(!response.ok){
                throw new Error('Failed to register');
            }

            ComicTon.getInstance().setPhoneNumber(phoneNumber);
            return true;
        } catch (error) {
            throw new Error('Failed to register');
        }
    }

    static async validateCode(code: string):Promise<boolean> {
        try {
            let jsonBody = JSON.stringify({ code:code, phoneNumber: ComicTon.getInstance().getPhoneNumber() });
            console.log('validateCode::jsonBody', jsonBody);
            const response = await fetch('http://localhost:3030/api/verify-code', {
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

    static async validateToken(token: string):Promise<boolean> {

        console.log('validateToken::token', token);
        try {
            const response = await fetch('http://localhost:3030/api/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token:token })
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