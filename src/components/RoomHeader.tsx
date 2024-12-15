import React, { createRef } from "react";
import { ReactNode } from "react";


interface IRoomHeaderProps {
}

interface IRoomHeaderState {
}


export class RoomHeader extends React.Component<IRoomHeaderProps, IRoomHeaderState> {
    constructor(props) {
        super(props);

        this.state = {

        }
    }


    componentDidMount(): void {
    }


    render() {
        return (
            <div className='flex items-center gap-4 p-4'>
                <div className='w-12 h-12 flex items-center justify-center'>
                    <i className="fa-solid fa-angle-left"></i>
                </div>

                <div className='rounded-full w-12 h-12 bg-white'></div>
                <div className='font-semibold grow'>Fanny Benacloche</div>
                <i className="fa-regular fa-ellipsis-vertical"></i>
            </div>
        )
    }
}