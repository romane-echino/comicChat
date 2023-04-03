import React, { createRef, useRef } from 'react';
import { DataConnection, Peer } from "peerjs";
import './tailwind.scss'
import { ChatBox, ChatMessage } from './ChatBox';
import { ChatSVGBox } from './ChatSVGBox';
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Connexion, ServerUserInfo, UserInfo } from './pages/Connexion';
import axios from 'axios';

interface IAppProps extends RouteComponentProps {

}

interface IAppState {
    id: string;
    isHost: boolean;
    messages: ChatMessage[];

    clients: {
        [id: string]: PeerData
    }

    host: PeerData | null
}

interface PeerData {
    id: string;
    connected: boolean;
    ctx: DataConnection;
}

class App extends React.Component<IAppProps, IAppState>{
    targetId = createRef<HTMLInputElement>();
    textInput = createRef<HTMLInputElement>();
    peer: Peer | null = null;

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            isHost: false,
            messages: [],
            clients: {},
            host: null
        }
    }

    async componentDidMount(): Promise<void> {

    }



    keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === "Enter") {
            this.sendHandler();
        }
    }

    sendHandler() {
        if (this.textInput.current) {
            let value = this.textInput.current.value;
            this.textInput.current.value = '';
            this.send({
                emotion: 1,
                message: value,
                userId: this.state.id
            });
        }
    }

    addMessage(message: ChatMessage) {
        console.log('adding message', message);
        let messages: ChatMessage[] = [message, ...this.state.messages];
        this.setState({ messages: messages })
    }

    send(message: ChatMessage) {


        if (this.state.isHost) {
            console.log('sending to clients', message);
            Object.keys(this.state.clients).forEach(c => {
                let client = this.state.clients[c];
                if (client.connected) {
                    client.ctx.send(message)
                }
            })
        } else {

            let host = this.state.host;
            console.log('sending to host', message, host);
            if (host && host.connected) {
                host.ctx.send(message)
            }
        }

        this.addMessage(message)
    }

    peerConnexion(id: string, host: boolean) {
        if (this.peer &&
            id !== 'undefined' &&
            (!this.state.clients[id] ||
                (this.state.clients[id] && !this.state.clients[id].connected))) {

            console.log(`connecting to [${id}]`);
            let connexion = this.peer.connect(id);

            connexion.on("open", () => {
                console.log('connection is open', id);
                if (host) {
                    let clients = this.state.clients;
                    clients[id].connected = true;
                    console.log('client connection is open #2', clients);
                    this.setState({ clients: clients })
                }
            });

            connexion.on("error", () => {
                console.log('Connexion Error');
            })

            connexion.on("data", (data) => {
                if (typeof data === 'object') {
                    console.log('message recieved', data)
                    this.addMessage(data as ChatMessage)
                    Object.keys(this.state.clients).forEach(c => {
                        let client = this.state.clients[c];
                        if (client.connected && client.id !== (data as ChatMessage).userId) {
                            client.ctx.send(data)
                        }
                    })
                } else {
                    console.log('connection data typeof ???', data)
                }
            });

            this.peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    // Will print 'hi!'

                    if (typeof data === 'object') {
                        console.log('message recieved', data)
                        this.addMessage(data as ChatMessage)
                    } else {
                        console.log('connection data typeof ???', data)
                    }
                });
                conn.on("open", () => {
                    console.log('some one connected');

                    let hostData = this.state.host;
                    if (hostData) {
                        hostData.connected = true;
                        hostData.ctx = conn;
                        console.log('host connection is open #2', hostData, conn);
                        this.setState({ host: hostData })
                    }

                    conn.send('Fuuuuck')
                    //conn.send("hello!");
                });
            });


            if (host) {
                let clients = this.state.clients;

                clients[id] = {
                    id: id,
                    ctx: connexion,
                    connected: false
                };

                console.log('creating client', clients);

                this.setState({ clients: clients })
            }
            else {

                this.setState({
                    host: {
                        id: id,
                        ctx: connexion,
                        connected: false
                    }
                })
            }
        }
    }


    updateClients() {
        axios.get('/getclients')
            .then(response => {
                let connectedClients: ServerUserInfo[] = response.data.connected;
                //console.log('response', connectedClients);
                connectedClients.forEach(c => {
                    if (!c.host) {
                        this.peerConnexion(c.id, true)
                    }
                })
            });
    }

    connected(user: UserInfo, hostId: string) {
        console.log(`creating peer [${user.userId}]`);
        let isHost = hostId === 'HOST';
        this.peer = new Peer(user.userId);

        this.setState({
            id: user.userId,
            isHost: isHost
        }, () => {
            if (hostId !== 'HOST' && this.peer) {
                this.peerConnexion(hostId, false);
                this.props.history.push('/chat')
            }
            else {
                setInterval(this.updateClients.bind(this), 5000);
                this.props.history.push('/chat')
            }
        })
    }


    render(): React.ReactNode {
        return (
            <div>
                <Switch>
                    <Route path='/' exact>
                        <Connexion Connect={(u, t) => this.connected(u, t)} />
                    </Route>

                    <Route path='/chat' >
                        <div style={{ fontFamily: 'Cats' }}>
                            <div className='bg-[#92C8F8] flex items-center justify-center text-white h-12 fixed inset-x-0 top-0'>
                                Comic chat {this.state.id}
                            </div>
                            <div className='fixed top-12 inset-x-0 bottom-20 border border-black overflow-x-hidden overflow-y-auto'>
                                {this.state.messages.map((value, index) => {
                                    return (
                                        <div key={index}>{value.message}</div>
                                    )
                                })}
                            </div>
                            <div className='flex bg-[#92C8F8] pb-8 gap-2 pt-2 px-2 fixed inset-x-0 bottom-0'>
                                <input type="text"
                                    className=' grow'
                                    ref={this.textInput}
                                    onKeyDown={(e) => this.keydown(e)} />
                                <button onClick={() => this.sendHandler()}
                                    className='text-black flex items-center rounded-md justify-center p-2 bg-white w-12 h-12'>
                                    <i className="fa-duotone fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </Route>
                </Switch>
            </div>
        )
    }
    /*
        render(): React.ReactNode {
            return (
                <div className='flex flex-col'>
    
                    <div className='font-bold'>{this.state.id}</div>
                    <div>
                        {this.state.clients.map((value) => {
                            if (value !== this.state.id) {
                                return (
                                    <div key={value}>
                                        <div>{value}</div>
                                        <button className='bg-blue-400 text-white'
                                            style={{ fontFamily: 'Cats' }}
                                            onClick={() => this.connect(value)}>
                                            connect
                                        </button>
                                    </div>
                                )
                            }
                        })}
                    </div>
    
                    <input type="text"
                        className='border border-black'
                        ref={this.textInput}
                        onKeyDown={(e) => this.keydown(e)} />
    
                    <div className='flex flex-wrap gap-2 justify-center'>
                        {this.state.messages.map((message, index) => {
                            return <ChatSVGBox key={index} Messages={[message]} />
                        })}
                    </div>
    
                    <div>
                        {this.state.messages.map((message, index) => {
                            return <div key={index}>{message.message} {message.userId}</div>
                        })}
                    </div>
                </div>
            )
        }
    
        */
}

export default withRouter(App)