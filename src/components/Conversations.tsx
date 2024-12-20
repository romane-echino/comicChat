import React, { createRef } from "react";
import { ReactNode } from "react";
import { ConversationItem } from "./ConversationItem";


interface IConversationsProps {
}

interface IConversationsState {
}


export class Conversations extends React.Component<IConversationsProps, IConversationsState>{
    constructor(props) {
        super(props);

        this.state = {
           
        }
    }


    componentDidMount(): void {
    }


    render() {
        return (
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
                        <ConversationItem />
                    </div>
                </div>
        )
    }
}