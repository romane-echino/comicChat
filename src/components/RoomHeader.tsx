import React, { createRef } from "react";
import { ReactNode } from "react";


interface IRoomHeaderProps {
    Back: () => void;
}

interface IRoomHeaderState {
}


export class RoomHeader extends React.Component<IRoomHeaderProps, IRoomHeaderState> {
    constructor(props:IRoomHeaderProps) {
        super(props);

        this.state = {

        }
    }


    componentDidMount(): void {
    }


    render() {
        return (
            <div className='flex items-center gap-4 py-2 px-4 backdrop-blur-md bg-white/10 absolute top-0 inset-x-0'>
                <div className='w-10 h-10 flex items-center justify-center' onClick={() => this.props.Back()}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>

                <div className='rounded-full w-10 h-10 bg-white'></div>
                <div className='font-semibold grow'>Fanny Benacloche</div>
                <i className="fa-regular fa-ellipsis-vertical"></i>
            </div>
        )
    }
}