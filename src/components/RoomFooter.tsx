import React, { createRef } from "react";
import { IChatMessage } from "../models/Interfaces";


interface IRoomFooterProps {
    NewMessage: (message: IChatMessage) => void;
}

interface IRoomFooterState {
}


export class RoomFooter extends React.Component<IRoomFooterProps, IRoomFooterState> {
    textInput = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        this.state = {

        }
    }


    componentDidMount(): void {
    }

    keydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === "Enter" && this.textInput.current) {
            let value = this.textInput.current.value;
            this.textInput.current.value = '';
            this.props.NewMessage({
                Emotion: 'Happy',
                Message: value,
                Name: 'Romane'
            })
        }
    }


    render() {
        return (
            <div className='flex justify-between items-center p-2 gap-4'>

                <div>
                    <div className='rounded-full w-6 h-6 bg-white'></div>
                </div>
                <input
                    ref={this.textInput}
                    onKeyDown={(e) => this.keydown(e)}
                    type="text"
                    className='bg-white/10 rounded-lg border-none grow' />

                <div className='flex gap-2'>

                    <div className='rounded-full w-6 h-6 bg-white'></div>
                </div>
            </div>
        )
    }
}