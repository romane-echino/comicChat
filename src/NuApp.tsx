import React, { createRef, ReactNode, useRef } from 'react';
import './tailwind.scss'
import { Route, Switch,  withRouter } from 'react-router';
import { ChatBox, ChatEmotion } from './ChatBox';


interface IAppProps {

}

interface IAppState {

    blocks: IChatBubbleBlock[];
}


class App extends React.Component<IAppProps, IAppState> {
    textInput = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        this.state = {
            blocks: [{
                messages:[
                    {
                        Emotion:'Happy',
                        Message:"You'll have great fun and the rest of us can talk",
                        Name:'P5'
                    },
                    {
                        Emotion:'Scared',
                        Message:"Is there no intelligent life here?",
                        Name:'P3'
                    },
                    {
                        Emotion:'Angry',
                        Message:"Everytime I say something the screen flood",
                        Name:'P5'
                    },
                    {
                        Emotion:'Happy',
                        Message:"Be that way",
                        Name:'P1'
                    },
                    {
                        Emotion:'Happy',
                        Message:"Some cueball",
                        Name:'P2'
                    }
                ]
            }]
        }
    }

    async componentDidMount() {

    }

    keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === "Enter" && this.textInput.current) {
            let value = this.textInput.current.value;
            this.textInput.current.value = '';
            let blocks = this.state.blocks;
            blocks.push({
                messages: [{
                    Emotion: 'Happy',
                    Message: value,
                    Name: 'Romane'
                }]
            })
            this.setState({ blocks: blocks })
        }
    }


    render() {
        return (
            <div className='flex inset-0 fixed text-white'>
                <div className='bg-black  w-full max-w-md hidden md:block'>
                    <div className='p-4 flex flex-col gap-2'>
                        <div className='flex justify-between items-center text-2xl'>
                            <div className='font-bold'>Chats</div>
                            <div className='cursor-pointer'>
                                <i className="fa-solid fa-circle-plus text-comic"></i>
                            </div>
                        </div>

                        <div className='relative text-white/70'>
                            <div className='h-10 absolute flex items-center pl-4'>
                                <i className="fa-solid fa-magnifying-glass "></i>
                            </div>

                            <input type='text' placeholder='Rechercher' className='w-full border-none rounded-lg bg-white/10 font-semibold pl-10 pr-4 py-2' />
                        </div>
                    </div>

                    <div className=''>
                        <div className='flex p-4 items-center gap-4 hover:bg-white/5 cursor-pointer'>
                            <div className='rounded-full w-12 h-12 bg-white'></div>
                            <div className='grow'>
                                <div className='flex'>
                                    <div className='grow'>Fanny Benacloche</div>
                                    <div className='text-sm text-white/70'>20:38</div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <i className="fa-solid fa-check-double text-white/70"></i>
                                    <div className='grow truncate text-sm'>Je t'aime!</div>
                                    <i className="fa-solid fa-robot text-comic"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='grow bg-black/90 h-full'>
                    <div className='flex items-center gap-4 p-4'>
                        <div className='w-12 h-12 flex items-center justify-center'>
                            <i className="fa-solid fa-angle-left"></i>
                        </div>

                        <div className='rounded-full w-12 h-12 bg-white'></div>
                        <div className='font-semibold grow'>Fanny Benacloche</div>
                        <i className="fa-regular fa-ellipsis-vertical"></i>
                    </div>
                    <div className='bg-black grow p-4 flex flex-row gap-4 flex-wrap overflow-y-auto'>

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
                    <div className='flex justify-between items-center p-2'>
                        <input
                            ref={this.textInput}
                            onKeyDown={(e) => this.keydown(e)}
                            type="text"
                            className='bg-white/10 rounded-lg border-none' />

                        <div className='flex gap-2'>
                            <div className='rounded-full w-6 h-6 bg-white'></div>
                            <div className='rounded-full w-6 h-6 bg-white'></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App)

interface IChatBubbleState {

}

interface IChatBubbleBlock {
    messages: IChatMessage[];
}

interface IChatMessage {
    Name: string;
    Emotion: string;
    Message: string;
}

class ChatBubble extends React.Component<IChatBubbleBlock, IChatBubbleState> {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    getMessages(): ReactNode[] {
        let result: ReactNode[] = [];
        this.props.messages.forEach(m => {
            let span = this.getSpan(m.Message);
            result.push(
                <div className={`chat-bubble col-start-1 ${span} row-start-1`}>{m.Message}</div>
            )
        })
        return result;
    }

    getSpan(message: string): string {
        let length = message.length;
        let result = 1;
        if (length < 5) {
            result = 1;
        }
        else if (length < 10) {
            result = 2;
        }
        else if (length < 15) {
            result = 3;
        }
        else{
            result = 8;
        }

        return `col-span-${result}`
    }

    render() {
        return (

            <div className='border border-white w-80 h-80 p-2'>
                {/*chat text */}
                <div className='h-40 grid grid-cols-8 gap-1 content-between justify-between items-start leading-5'>
                    {this.getMessages()}
                </div>

                {/*characters text */}
                <div className='grid grid-cols-5 gap-1 h-28 mt-4'>
                    {this.props.messages.map((m, i) =>
                        <div key={i} className='border border-white'>
                            <div>{m.Name}</div>
                            <div>{m.Emotion}</div>
                        </div>
                    )}
                </div>
            </div>

        )
    }
}
