import { ComicTon, serverUrl } from "./Token";
//import io, { Socket } from 'socket.io-client';
import { Peer } from 'peerjs'

export class PeerTon {
    private static instance: PeerTon;
    // private socket: Socket;
    private peer: Peer;

    private neighborPeers: string[] = [];
    private roomPeers: string[] = [];

    private constructor() {
        // this.socket = io(serverUrl);
    }

    public static getInstance(): PeerTon {
        if (!PeerTon.instance) {
            PeerTon.instance = new PeerTon();
        }
        return PeerTon.instance;
    }


    public Init() {

        console.log('Init PeerJS');
        this.peer = new Peer({
            host: '192.168.1.207',
            port: 3031,
            path: '/peer',
            secure: true,
            debug: 3,
        });

        this.peer.on('open', (id) => {
            console.log('My peer ID is:', id);
            PeerAPI.upsertPeerId(
                PeerTon.getInstance().getID(),
                ComicTon.getInstance().getUniqueId()
            ).then(() => {
                console.log('Peer ID updated');
            });
        });

        this.peer.on('error', (error) => {
            console.error('PeerJS error:', error);
        });
    }

    getID() {
        return this.peer.id;
    }

    /* public on(event: string, callback: Function){
         this.socket.on(event, callback);
     }
 
     public emit(event: string, data: any){
         this.socket.emit(event, data);
     }*/
}

export class PeerAPI {
    constructor() {

    }

    static async upsertPeerId(peerId: string, uniqueId: string) {
        try {
            const response = await fetch(serverUrl + '/api/peer/upsert-peer-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    peerId: peerId,
                    uniqueId: uniqueId,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to upsert peer ID');
            }

            return true;
        } catch (error) {
            throw new Error('Failed to upsert peer ID');
        }
    }



    static async registerDesktop(uniqueId: string) {
        try {
            const response = await fetch(serverUrl + '/api/peer/register-desktop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uniqueId: uniqueId,
                    agent: navigator.userAgent,
                })
            });

            if (!response.ok) {
                throw new Error('Desktop registration failed');
            }

            return true;
        } catch (error) {
            throw new Error('Failed to register desktop');
        }
    }
}