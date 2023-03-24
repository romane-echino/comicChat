import React, { createRef, useRef } from 'react';
import { Peer } from "peerjs";
import { getId, getPeer } from './client';
import './tailwind.scss'
import { ChatBox } from './ChatBox';

interface IAppProps {

}

interface IAppState {
    id: string;
}

export default class App extends React.Component<IAppProps, IAppState>{
    targetId = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        this.state = {
            id: getId()
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
        else{
            alert('no target')
        }
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


                <div className='flex flex-wrap gap-2 justify-center'>
                    <ChatBox></ChatBox>
                    <ChatBox></ChatBox>
                    <ChatBox></ChatBox>
                    <ChatBox></ChatBox>
                    <ChatBox></ChatBox>
                    <ChatBox></ChatBox>
                </div>
            </div>
        )
    }
}