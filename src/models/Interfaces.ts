export interface IChatBubbleBlock {
    messages: IChatMessage[];
}

export interface IChatMessage {
    Name: string;
    Emotion: string;
    Message: string;
}