import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

interface IConnexionProps {
    Connect: (user: UserInfo, clientType: string) => void;
}

interface IConnexionState {
    user: UserInfo;
    loading: boolean;
}

export interface UserInfo {
    nickname: string;
    userId: string;
}

export interface ServerUserInfo {
    host:boolean;
    nickname: string;
    id: string;
}

export class Connexion extends React.Component<IConnexionProps, IConnexionState>{
    nicknameInput = React.createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        let userInfoJSON = localStorage.getItem('userInfo');
        if (userInfoJSON) {
            let userInfo: UserInfo = JSON.parse(userInfoJSON);

            this.state = {
                user: {
                    nickname: userInfo.nickname,
                    userId: userInfo.userId
                },
                loading: false
            }
        }
        else {
            this.state = {
                user: {
                    nickname: '',
                    userId: uuidv4()
                },
                loading: false
            }
            localStorage.setItem('userInfo', JSON.stringify(this.state.user));
        }

    }
    connect() {
        if (this.nicknameInput.current && this.props.Connect) {
            let nickname = this.nicknameInput.current.value;
            this.setState({
                user: { ...this.state.user, nickname: nickname },
                loading: true
            }, async () => {
                localStorage.setItem('userInfo', JSON.stringify(this.state.user));

                console.log('sending', this.state.user);

                axios.post('/connect', this.state.user)
                    .then(response => {
                        console.log('response', JSON.stringify(response.data));
                        this.props.Connect(this.state.user, response.data);
                    });
            })
        }
    }

    render(): React.ReactNode {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#92C8F8]">
                <div className="flex flex-col max-w-xs gap-2">
                    <div style={{ fontFamily: 'Cats' }} className="text-white text-center">
                        <div className="text-3xl">Welcome to</div>
                        <div className="text-4xl">ComicChat</div>
                        <pre>
                            {this.state.user.userId}
                        </pre>
                        <pre>
                            {this.state.user.nickname}
                        </pre>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="320" height="320" viewBox="0 0 1024 1024">

                        <g id="icon" >
                            <rect width="1024" height="1024" fill="#92c8f8" />
                            <path id="Tracé_6" data-name="Tracé 6" d="M808.476,393.5c31.754,0,60.409,8.651,82.129,22.484-11.563-24.01-43.759-41.425-82.129-41.425s-70.561,17.415-82.126,41.423C748.069,402.147,776.725,393.5,808.476,393.5Z" transform="translate(-25.79 17.065)" fill="#588daf" />
                            <path id="Tracé_7" data-name="Tracé 7" d="M197.46,393.5c31.754,0,60.409,8.651,82.129,22.484-11.563-24.01-43.759-41.425-82.129-41.425s-70.562,17.415-82.127,41.423C137.052,402.147,165.708,393.5,197.46,393.5Z" transform="translate(44.463 17.065)" fill="#588daf" />
                            <path id="Tracé_8" data-name="Tracé 8" d="M477,546.542c-106.687,0-205.306-4.505-275.937-21.779,38.85,20.024,147.023,34.549,275.94,34.549s237.075-14.525,275.932-34.548C679.524,542.037,583.684,546.542,477,546.542Z" transform="translate(34.606 -0.205)" fill="#588daf" opacity="0.5" />
                            <path id="Tracé_9" data-name="Tracé 9" d="M256,540.974v22.6c0,38.991,34.023,70.6,73.013,70.6s73.015-31.608,73.015-70.6v-9.49Z" transform="translate(28.29 -2.07)" fill="#fefefe" />
                            <path id="Tracé_10" data-name="Tracé 10" d="M766.718,540.974v22.6a70.36,70.36,0,1,1-140.719,0v-9.49Z" transform="translate(-14.252 -2.07)" fill="#fefefe" />
                        </g>
                    </svg>

                    {this.state.loading ?
                        <div>loading</div>
                        :
                        <>
                            <input type="text" ref={this.nicknameInput} defaultValue={this.state.user.nickname} />
                            <button onClick={() => this.connect()}>
                                Connect
                            </button>
                        </>
                    }

                </div>
            </div>
        )
    }
}