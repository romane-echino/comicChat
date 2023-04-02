import React, { createRef, useRef } from 'react';
import { DataConnection, Peer } from "peerjs";
import './tailwind.scss'
import { ChatBox, ChatMessage } from './ChatBox';
import { ChatSVGBox } from './ChatSVGBox';

interface IAppProps {

}

interface IAppState {
    id: string;
    clients: string[];
    messages: ChatMessage[];
}

export default class App extends React.Component<IAppProps, IAppState>{
    targetId = createRef<HTMLInputElement>();
    textInput = createRef<HTMLInputElement>();
    peer: Peer | null = null;
    connexion: DataConnection | null = null;

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            messages: [],
            clients: []
        }
    }


    async componentDidMount(): Promise<void> {
        let response = await fetch('/connect');
        const body = await response.json();
        //console.log('body', body);
        this.setState({
            id: body.id,
            clients: body.connected
        }, () => {
            this.peer = new Peer(this.state.id);
        })


        setInterval(this.updateClients.bind(this), 1000);
    }

    async updateClients() {
        let response = await fetch('/getclients');
        const body = await response.json();
        //console.log('body', body);
        this.setState({
            clients: body.connected
        })
    }


    connect(other: string) {


        if (other && this.peer) {
            this.connexion = this.peer.connect(other);

            this.connexion.on("open", () => {
                console.log('connection is open');

                //this.connexion!.send("hi!");
            });

            this.peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    // Will print 'hi!'
                    if (typeof data === 'object') {
                        console.log('message recieved', data)
                        this.addMessage(data as ChatMessage)
                    }
                });
                conn.on("open", () => {
                    //conn.send("hello!");
                });
            });


        }
        else {
            alert('no target')
        }
    }

    keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === "Enter") {
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
    }

    addMessage(message: ChatMessage) {
        console.log('adding message', message);
        let messages: ChatMessage[] = [message, ...this.state.messages];
        this.setState({ messages: messages })
    }

    send(message: ChatMessage) {
        this.connexion?.send(message);
        this.addMessage(message)
    }

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
}