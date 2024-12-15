import React, { ReactNode } from "react";
import { IChatBubbleBlock } from "../models/Interfaces";

interface IChatBubbleState {
}

export class ChatBubble extends React.Component<IChatBubbleBlock, IChatBubbleState> {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    getMessages(): ReactNode[] {
        let result: ReactNode[] = [];
        let row = 1;
        let usedColumn: number[] = [];
        let col = 1;
        let leftSpace = 8;
        this.props.messages.forEach(m => {
            let span = this.getSpan(m.Message);
            if (leftSpace - span < 0) {
                console.log('no left space')
                row++;
                leftSpace = 8;
            }
            else {
                leftSpace -= span;
            }
            


            console.log('bubble', span, row, leftSpace)

            result.push(
                <div className={`chat-bubble col-start-${col} col-span-${span} row-start-${row}`}>{m.Message}</div>
            )

            col++
        })
        return result;
    }

    getSpan(message: string): number {
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
        else if (length < 20) {
            result = 4;
        }
        else if (length < 25) {
            result = 5;
        }
        else if (length < 30) {
            result = 6;
        }
        else if (length < 35) {
            result = 7;
        }
        else {
            result = 8;
        }

        return result
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