import React, { createRef } from "react";
import { ReactNode } from "react";


interface IChatBoxProps {
    Messages: ChatMessage[]
}

interface IChatBoxState {
    messages: ChatMessage[]
}


export interface ChatMessage {
    userId: string;
    emotion: number;

    message: string;
}

export class ChatBox extends React.Component<IChatBoxProps, IChatBoxState>{
    canvas = createRef<HTMLCanvasElement>();


    constructor(props) {
        super(props);

        this.state = {
            messages: this.props.Messages
        }
    }


    componentDidMount(): void {
        if (this.canvas.current) {
            var heightRatio = 1;
            this.canvas.current.height = this.canvas.current.width * heightRatio;
        }


        this.draw();
    }


    draw() {
        if (this.canvas.current) {
            let ctx = this.canvas.current.getContext("2d");
            let width = this.canvas.current.width;
            let height = this.canvas.current.height;
            let hRatio = 1 / (this.state.messages.length + 1);
            let vRatio = 2 / 3;
            let vTop = 1 / 3;

            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, width, height);



                for (let m of this.state.messages) {
                    ctx.beginPath();
                    ctx.rect(width / 2 - ((width * hRatio) / 2), height * vTop, width * hRatio, height * vRatio);
                    ctx.fillStyle = "red"
                    ctx.fill();


                    let anchorX = width / 2;
                    let anchorY = height * vTop - 20;

                    ctx.beginPath();
                    ctx.fillStyle = "green"
                    ctx.arc(anchorX, anchorY, 2, 0, 2 * Math.PI, false);
                    ctx.fill();

                    ctx.font = '12px Sans-serif';

                    let metrics = ctx.measureText(m.message);

                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'blue';
                    ctx.moveTo(50 + (metrics.width/2) - 10, 50);
                    ctx.quadraticCurveTo(50 + (metrics.width/2) , anchorY-10, anchorX, anchorY);
                    //ctx.lineTo(anchorX, anchorY);
                    ctx.lineTo(50 + (metrics.width/2) + 10, 50);
                    ctx.stroke();

                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 20;
                    ctx.lineJoin = "round";
                    ctx.strokeText(m.message, 50, 40);

                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 16;
                    ctx.lineJoin = "round";
                    ctx.strokeText(m.message, 50, 40);

                    ctx.fillStyle = 'black';
                    ctx.fillText(m.message, 50, 40);
                }


                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.rect(0, 0, width, height);
                ctx.lineWidth = 10;
                ctx.stroke();

            }
        }
    }

    render(): ReactNode {
        return (
            <canvas ref={this.canvas} className="grow max-w-xs">

            </canvas>
        )
    }
}