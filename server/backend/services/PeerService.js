const { ExpressPeerServer } = require('peer');



function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}


class PeerService {
    constructor(server, credentials) {
        this.peerServer = ExpressPeerServer(server, {
            debug: true,
            path: '/',
            ssl: credentials,
            generateClientId: () => {
                return uuidv4();
            }
        },
        );

        this.initializeEvents();
    }

    initializeEvents() {
        this.peerServer.on('connection', (client) => {
            console.log(`Client connected: ${client.getId()}`);
        });

        this.peerServer.on('disconnect', (client) => {
            console.log(`Client disconnected: ${client.getId()}`);
        });

        this.peerServer.on('error', (error) => {
            console.error('PeerJS server error:', error);
        });
    }

    getServer() {
        return this.peerServer;
    }
}

module.exports = PeerService;