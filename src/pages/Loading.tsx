import React from "react";

interface ILoadingProps {

}

interface ILoadingState {

}

export class Loading extends React.Component<ILoadingProps, ILoadingState>{
  
    constructor(props:ILoadingProps) {
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