import axios from "axios";
import { motion } from "framer-motion";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

interface IRoomsProps {

}

interface IRoomsState {

}

export class Rooms extends React.Component<IRoomsProps, IRoomsState>{

    constructor(props) {
        super(props);

    }

    render(): React.ReactNode {
       return(
        <div>Rooms</div>
       )

    }
}