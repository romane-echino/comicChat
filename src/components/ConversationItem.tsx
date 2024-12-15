import React, { createRef } from "react";
import { ReactNode } from "react";


interface IConversationItemProps {
}

interface IConversationItemState {
}


export class ConversationItem extends React.Component<IConversationItemProps, IConversationItemState> {
    constructor(props) {
        super(props);

        this.state = {

        }
    }


    componentDidMount(): void {
    }


    render() {
        return (
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
        )
    }
}