import React, { createRef } from "react";
import { ReactNode } from "react";
import { IChatBubbleBlock, IChatMessage } from "../models/Interfaces";
import { blockMock } from "../models/Mock";
import { RoomHeader } from "./RoomHeader";
import { RoomFooter } from "./RoomFooter";
import { ChatBubble } from "./ChatBubble";


interface IRoomProps {
    Back: () => void;
}

interface IRoomState {
    blocks: IChatBubbleBlock[];
}


export class Room extends React.Component<IRoomProps, IRoomState> {
    constructor(props:IRoomProps) {
        super(props);

        this.state = {
            blocks: blockMock
        }
    }


    componentDidMount(): void {
    }

    handleNewMessage(message: IChatMessage) {
        let blocks = [...this.state.blocks];
        blocks.push({
            messages: [message]
        })
        this.setState({
            blocks: blocks
        })
    }


    render() {
        return (
            <div className='h-screen relative grow'>
                

                <div className='bg-black px-4 pt-20 pb-24 flex flex-row gap-4 flex-wrap items-start justify-start overflow-y-auto absolute inset-0'>

                    <div className='border border-white w-80 h-80 p-4 text-center'>
                        <div>Group name</div>
                        <div>starring</div>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='flex items-center gap-2'>
                                <div className='rounded-full w-6 h-6 bg-white'></div>
                                <div>Fanny</div>
                            </div>

                            <div className='flex items-center gap-2 flex-row-reverse'>
                                <div className='rounded-full w-6 h-6 bg-white'></div>
                                <div>Romane</div>
                            </div>
                        </div>
                    </div>

                    <div className='border border-white w-80 h-80 p-2'>
                        {/*chat text */}
                        <div className='grid grid-cols-8 gap-1 content-between justify-between items-start leading-5'>
                            <div className='chat-bubble col-start-1 col-span-8 row-start-1'>You'll have great fun and the rest of us can talk</div>
                            <div className='chat-bubble col-start-2 col-span-6 row-start-2'>Is there no intelligent life here?</div>
                            <div className='chat-bubble col-start-1 col-span-3 row-start-3'>Be that way</div>
                            <div className='chat-bubble col-start-5 col-span-3 row-start-3'>Everytime I say something the screen flood</div>
                            <div className='chat-bubble col-start-2 col-span-2 row-start-4 text-str'>Some cueball</div>
                        </div>

                        {/*characters text */}
                        <div className='grid grid-cols-5 gap-1 h-28 mt-4'>
                            <div className='border border-white'>P1</div>
                            <div className='border border-white'>P2</div>
                            <div className='border border-white'>P3</div>
                            <div className='border border-white'>P4</div>
                            <div className='border border-white'>P5</div>
                        </div>
                    </div>

                    {this.state.blocks.map((block, blockIndex) =>
                        <ChatBubble key={blockIndex} {...block} />
                    )}
                </div>

                <RoomHeader Back={() => this.props.Back()} />

                <RoomFooter NewMessage={(m) => this.handleNewMessage(m)} />
            </div>
        )
    }
}