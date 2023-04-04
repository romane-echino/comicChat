import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

interface ILoadingProps {

}

interface ILoadingState {

}

export class Loading extends React.Component<ILoadingProps, ILoadingState>{
  
    constructor(props) {
        super(props);

            this.state = {
                
            }
    }
   

    render(): React.ReactNode {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#9AC8EB]">
                <div style={{ fontFamily: 'Cats' }} className="text-white">
                    Awaiting other users...
                    </div>
            </div>
        )
    }
}