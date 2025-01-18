import React, { createRef, ReactNode, useRef } from 'react';
import './tailwind.scss'
import { Route, Switch, withRouter } from 'react-router';
import { ChatBox, ChatEmotion } from './ChatBox';
import { Conversations } from './components/Conversations';
import { Room } from './components/Room';
import { Register } from './components/Register';
import { ComicToken } from './Utils/Token';
import { Customize } from './components/Customize';
import { ValidateCode } from './components/ValidateCode';


interface IAppProps {

}

interface IAppState {
    step: 'loading' |'register' | 'validateCode' | 'customize' | 'appContent';
}


class App extends React.Component<IAppProps, IAppState> {

    constructor(props) {
        super(props);

        this.state = {
            step: 'loading'
        }
    }

    componentDidMount(): void {
        this.checkToken();
    }

    checkToken = async () => {
        let storredToken = localStorage.getItem('comic_token');
       try{
        if(storredToken){
            if(await ComicToken.validateToken(JSON.parse(storredToken))){
                this.setStep('appContent');
            }
        }
        else{
            this.setStep('register');
        }
       }
       catch(error){   
           console.error('Failed to validate token', error);
           this.setStep('register');
       }
    }

    setStep = (step: IAppState['step']) => {
        this.setState({ step });
    }

    render() {
        let step  = this.state.step;



        switch (step) {
            case 'register':
                return <Register onRegister={() => this.setStep('validateCode')} />;
            case 'validateCode':
                return <ValidateCode onValidationComplete={() => this.setStep('customize')} />;
            case 'customize':
                return <Customize onCustomizationComplete={() => this.setStep('appContent')} />;
            case 'appContent':
                return (
                    <div className='flex inset-0 fixed text-white'>
                        <Conversations />
                        <Room />
                    </div>
                );
            default:
                return null;
        }
    }
}

export default withRouter(App)