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
import AppContent from './components/AppContent';
import { Loading } from './components/Loading';
import { isMobile } from 'react-device-detect';
import { DesktopLogin } from './components/DesktopLogin';

interface IAppProps {

}

interface IAppState {
    step: 'loading' | 'register' | 'validateCode' | 'customize' | 'appContent' | 'desktopLogin';
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
        try {
            if (storredToken) {
                if (await ComicToken.validateToken(JSON.parse(storredToken))) {
                    this.setStep('appContent');
                }
            }
            else {
                if (!isMobile) {
                    this.setStep('desktopLogin');
                }
                else {
                    this.setStep('register');
                }

            }
        }
        catch (error) {
            console.error('Failed to validate token', error);
            this.setStep('register');
        }
    }

    setStep = (step: IAppState['step']) => {
        this.setState({ step });
    }

    setTheme(theme: string) {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme);
    }

    render() {


        return (
            <>
                {this.getStep()}

                {this.state.step !== 'appContent' &&
                    <div className='absolute bottom-4 right-4 bg-comic w-8 h-8 rounded-full' onClick={() => this.setStep('appContent')}>

                    </div>
                }
            </>
        )
    }

    getStep(): ReactNode {
        let step = this.state.step;

        switch (step) {
            case 'register':
                return <Register onRegister={() => this.setStep('validateCode')} />;
            case 'desktopLogin':
                return <DesktopLogin onLogin={() => this.setStep('appContent')} />;
            case 'validateCode':
                return <ValidateCode onValidationComplete={() => this.setStep('customize')} />;
            case 'customize':
                return <Customize onCustomizationComplete={() => this.setStep('appContent')} />;
            case 'appContent':
                return <AppContent />
            default:
                return <Loading />;
        }
    }
}

export default withRouter(App)