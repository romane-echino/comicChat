import React from "react";

interface IRoomsProps {

}

interface IRoomsState {

}

export class Rooms extends React.Component<IRoomsProps, IRoomsState>{

    constructor(props:IRoomsProps) {
        super(props);

    }

    render(): React.ReactNode {
       return(
        <div>Rooms</div>
       )

    }
}