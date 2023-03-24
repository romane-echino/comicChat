import React, { createRef, useRef } from 'react';
import { Peer } from "peerjs";
import { getId, getPeer } from './client';
import './tailwind.scss'
import { ChatBox, ChatMessage } from './ChatBox';

interface IAppProps {

}

interface IAppState {
    id: string;
    messages: ChatMessage[];
}

export default class App extends React.Component<IAppProps, IAppState>{
    targetId = createRef<HTMLInputElement>();
    textInput = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        this.state = {
            id: getId(),
            messages: []
        }
    }



    connect() {
        let peer = getPeer();
        let targetId = this.targetId.current?.value;
        if (targetId) {
            let conn = peer.connect(targetId);

            conn.on("open", () => {
                console.log('connection is open');

                conn.send("hi!");
            });

            console.log('dafuk', conn);

            peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    // Will print 'hi!'
                    console.log(data);
                });
                conn.on("open", () => {
                    conn.send("hello!");
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
                this.send(value);
            }

        }
    }

    send(message: string) {
        let messages: ChatMessage[] = [...this.state.messages, {
            userId: '1',
            emotion: 0,
            message: message
        }];

        this.setState({ messages: messages })
    }

    render(): React.ReactNode {
        return (
            <div className='flex flex-col'>
                <div>{this.state.id}</div>


                <input ref={this.targetId} type="text" className='border' />

                <button className='bg-blue-400 text-white'
                    onClick={() => this.connect()}>
                    connect
                </button>

                <textarea className='border'>
                </textarea>

                Chat
                <input type="text" ref={this.textInput} onKeyDown={(e) => this.keydown(e)} />

                <div className='flex flex-wrap gap-2 justify-center'>
                    {this.state.messages.map((message, index) => {
                        return (
                            <ChatBox key={index} Messages={[message]} />
                        )
                    })}
                </div>
            </div>
        )
    }
}