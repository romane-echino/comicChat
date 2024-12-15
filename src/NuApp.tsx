import React, { createRef, ReactNode, useRef } from 'react';
import './tailwind.scss'
import { Route, Switch, withRouter } from 'react-router';
import { ChatBox, ChatEmotion } from './ChatBox';
import { Conversations } from './components/Conversations';
import { Room } from './components/Room';
import { Register } from './components/Register';


interface IAppProps {

}

interface IAppState {
}


class App extends React.Component<IAppProps, IAppState> {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {

        let token = localStorage.getItem('comic-token');

        if(token){
            return (
                <div className='flex inset-0 fixed text-white'>
                    <Conversations />
                    
                    <Room />
                </div>
            )
        }
        else{
            return (
                <Register />
            )
        }
    }
}

export default withRouter(App)