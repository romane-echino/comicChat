import React, { createRef, useRef } from 'react';
import { DataConnection, Peer } from "peerjs";
import './tailwind.scss'
import { ChatBox, ChatEmotion, ChatMessage } from './ChatBox';
import { ChatSVGBox } from './ChatSVGBox';
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Connexion, ServerUserInfo, UserInfo } from './pages/Connexion';
import axios from 'axios';
import { Loading } from './pages/Loading';
import { motion } from 'framer-motion';
import { Popover } from '@headlessui/react';

interface IAppProps extends RouteComponentProps {

}

interface IAppState {
    user: UserInfo | null;
    isHost: boolean;
    messages: ChatMessage[];

    clients: {
        [id: string]: PeerData
    }

    host: PeerData | null;

    message: string;
}

interface PeerData {
    id: string;
    nickname: string;
    connected: boolean;
    ctx: DataConnection | null;
}

class App extends React.Component<IAppProps, IAppState>{
    targetId = createRef<HTMLInputElement>();
    textInput = createRef<HTMLInputElement>();
    peer: Peer | null = null;

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            isHost: false,
            messages: [],
            clients: {},
            host: null,
            message: ''
        }
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload.bind(this))
        document.addEventListener("pause", () => { alert('salut') }, false);

        window.addEventListener('appinstalled', () => {
            // If visible, hide the install promotion
            alert('hide da shit')
            // Log install to analytics
            console.log('INSTALL: Success');
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                this.disconnect();
            }
        });
    }

    componentWillUnmount() {

        window.removeEventListener("beforeunload", this.onUnload.bind(this))
    }

    onUnload(event) {
        const e = event || window.event;
        e.preventDefault();

        this.disconnect();
    }


    disconnect() {
        if (this.state.user) {
            console.log('try disconnect');
            axios.post('/disconnect', this.state.user).then(response =>
                console.log('disconnect response', response.data));
        }
    }

    keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === "Enter") {
            this.sendHandler();
        }
    }

    sendHandler() {
        if (this.textInput.current && this.state.user) {
            let value = this.textInput.current.value;
            this.textInput.current.value = '';
            this.send({
                timeStamp: new Date().toISOString(),
                emotion: ChatEmotion.Happy,
                message: value,
                userId: this.state.user.id
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
                if (client.connected && client.ctx) {
                    client.ctx.send(message)
                }
            })
        } else {

            let host = this.state.host;
            console.log('sending to host', message, host);
            if (host && host.connected && host.ctx) {
                host.ctx.send(message)
            }
        }

        this.addMessage(message)
    }

    peerConnexion(id: string, host: boolean, nickname: string = "") {
        if (this.peer &&
            this.state.user &&
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
                    clients[id].nickname = nickname;
                    console.log('client connection is open #2', clients);
                    this.setState({ clients: clients })

                    this.props.history.push('/Chat')
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
                        if (client.connected && client.ctx && client.id !== (data as ChatMessage).userId) {
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

                    let firstMessage: ChatMessage = {
                        timeStamp: new Date().toISOString(),
                        userId: this.state.user!.id,
                        message: `${nickname} à rejoind la conversation`,
                        emotion: ChatEmotion.Joining
                    }

                    conn.send(firstMessage);
                    this.props.history.push('/Chat')
                    //conn.send("hello!");
                });
            });


            if (host) {
                let clients = this.state.clients;

                clients[id] = {
                    id: id,
                    nickname: 'UNKNOWN_CLIENT',
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
                        nickname: 'UNKNOWN_HOST',
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
                        this.peerConnexion(c.id, true, c.nickname)
                    }
                })
            });
    }

    connected(user: UserInfo, hostId: string) {
        console.log(`creating peer [${user.id}]`);
        let isHost = hostId === 'HOST';
        this.peer = new Peer(user.id);

        this.setState({
            user: user,
            isHost: isHost
        }, () => {
            if (hostId !== 'HOST' && this.peer) {
                this.peerConnexion(hostId, false);
                this.props.history.push('/loading')
            }
            else {
                setInterval(this.updateClients.bind(this), 5000);
                this.props.history.push('/loading')
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

                    <Route path='/loading' exact>
                        <Loading />
                    </Route>

                    <Route path='/chat' >
                        <div style={{ fontFamily: 'Cats' }}>
                            <div className='bg-[#92C8F8] flex items-center justify-center text-white h-12 fixed inset-x-0 top-0'>
                                Comic chat {this.state.user?.id}

                                <div className='absolute bg-black text-white right-0 top-0'>
                                    {Object.keys(this.state.clients).map((k, i) => {
                                        let client = this.state.clients[k]
                                        return (
                                            <div className='flex'>
                                                <div>{client.nickname}</div>
                                                <div>{client.id}</div>
                                                <div>{client.connected ? 'true' : 'false'}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='fixed top-12 inset-x-0 bottom-24 border overflow-x-hidden overflow-y-auto 
                            flex flex-wrap gap-2 flex-row justify-center'>
                                {this.state.messages.map((value, index) => {
                                    return <ChatSVGBox key={index} Messages={[value]} />
                                })}
                            </div>
                            <div className='flex bg-[#92C8F8] pb-8 gap-2 pt-2 px-2 fixed inset-x-0 bottom-0 h-24'>
                                <div className='relative grow'>


                                    <motion.input type="text"
                                        style={{ fontFamily: 'Comic' }}
                                        className="rounded-md px-4 py-2 shadow-md text-lg w-full h-11 transition"
                                        ref={this.textInput}
                                        onChange={(e) => this.setState({ message: e.target.value })}
                                        onKeyDown={(e) => this.keydown(e)} />

                                    <Popover>
                                        <Popover.Button>
                                            <div className='absolute h-11 w-11 inset-y-0 right-0 text-2xl flex items-center justify-center'>
                                                <i className="fa-duotone fa-face-smile"></i>
                                            </div>
                                        </Popover.Button>
                                        <Popover.Panel as="div" className='fixed bottom-24 right-0 p-4 shadow-md rounded-md'>
   
                                                <div className='flex gap-2'>
                                                    <div>Happy</div>
                                                    <div>
                                                    <i className="fa-duotone fa-face-smile-beam"></i>
                                                    </div>
                                                </div>
                                                <div>Sad</div>
                                                <div>Angry</div>
                                                <div>Hello</div>

                                        </Popover.Panel>
                                    </Popover>


                                </div>
                                {this.state.message !== '' &&
                                    <motion.button onClick={() => this.sendHandler()}
                                        initial={{ opacity: 0, translateX: 10 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        className='text-white flex items-center rounded-full justify-center p-2 bg-[#5784BA] w-11 h-11'>
                                        <i className="fas fa-paper-plane"></i>
                                    </motion.button>
                                }

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