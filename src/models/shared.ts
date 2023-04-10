export interface room {
    id: string;
    name: string;
    description: string;
    tags: string[];
    languages: string[];
    clients: client[];
}

export interface client {
    nickname: string;
    id: string;
    host: boolean;
    connected: boolean;
}