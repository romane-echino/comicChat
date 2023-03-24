import Peer from "peerjs";
import { v4 as uuidv4 } from 'uuid';

const currentId = uuidv4();
const peer = new Peer(currentId);


export function getId(): string {
    return currentId;
}

export function getPeer():Peer{
    return peer;
}