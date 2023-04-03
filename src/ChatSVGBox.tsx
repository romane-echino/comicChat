import React, { createRef } from "react";
import { ReactNode } from "react";
import { MarshIdle, MarshIdleAnimated } from "./assets/Marsh";


interface IChatBoxProps {
    Messages: ChatMessage[]
}

interface IChatBoxState {
    messages: ChatMessage[]
    width: number;
    height: number;
}


export interface ChatMessage {
    userId: string;
    emotion: number;

    message: string;
}

export class ChatSVGBox extends React.Component<IChatBoxProps, IChatBoxState>{
    canvas = createRef<SVGSVGElement>();

    constructor(props) {
        super(props);

        this.state = {
            messages: this.props.Messages,
            width: 0,
            height: 0
        }
    }

    componentDidMount(): void {
        if (this.canvas.current) {
            var heightRatio = 1;
            this.canvas.current.setAttribute("height", `${this.canvas.current.clientWidth * heightRatio}`);

            this.setState({
                width: this.canvas.current.clientWidth,
                height: this.canvas.current.clientWidth * heightRatio
            })
        }
    }

    shouldComponentUpdate(nextProps: Readonly<IChatBoxProps>, nextState: Readonly<IChatBoxState>, nextContext: any): boolean {
        if (JSON.stringify(nextProps.Messages) !== JSON.stringify(this.props.Messages))
            return true;
        if (JSON.stringify(nextState.messages) !== JSON.stringify(this.state.messages))
            return true;
        if (nextState.width !== this.state.width) {
            return true;
        }

        return false;
    }

    /*
    
    
     <text x="20" y="35" textAnchor="middle" style={{fontFamily:'Cats'}} className="small" stroke="blue" strokeWidth={0} strokeLinejoin="round">
                            {m.message}
                        </text>
    
                        <text x="20" y="35" textAnchor="middle" style={{fontFamily:'Cats'}} className="small" fill="black">
                            {m.message}
                        </text>
    
                        */

    getMessages(): ReactNode {
        let result: ReactNode[] = [];
        this.props.Messages.forEach(m => {
            console.log('message chatbox', m.message);

            result.push(
                <text x="100" y="35" key={m.userId}
                    fill="black"
                    textAnchor="middle"
                    style={{ fontFamily: 'Cats', fontSize: '20px' }}>
                    {m.message}
                </text>
            )

        });

        return result;
    }

    getCharacters(): ReactNode {
        if (this.state.width > 0) {
            let width = this.state.width;
            let height = this.state.height;
            let result: ReactNode[] = [];
            let hRatio = 1 / (this.state.messages.length + 1);
            let vRatio = 2 / 3;
            let vTop = 1 / 3;
            let index = 0;

            for (let m of this.props.Messages) {

                let x = width / 2 - ((width * hRatio) / 2);
                let y = height * vTop;
                let w = width * hRatio;
                let h = height * vRatio;
                result.push(
                    <foreignObject width={w} height={h} x={x} y={y} key={m.userId}>
                        <svg viewBox="0 0 196 256">
                            <MarshIdleAnimated color={`#${m.userId.substring(0, 6)}`} />
                        </svg>
                    </foreignObject>
                )
                index++;
            }

            return result;
        }

        return <text>wtf</text>
    }

    render(): ReactNode {
        return (
            <svg ref={this.canvas} className="grow max-w-xs">

                {
                this.getMessages()
                
                }
                {this.getCharacters()}
                {/*
                <rect width="100%" height="100%" stroke="black" strokeWidth={10} fill="transparent"></rect>


                
              


                <text x="100" y="35"
                    fill="black"
                    textAnchor="middle"
                    style={{ fontFamily: 'Cats', fontSize: '20px' }}>
                    {this.props.Messages[0].message}
                </text>
                   */}
            </svg>
        )
    }
}