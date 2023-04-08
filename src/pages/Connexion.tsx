import axios from "axios";
import { motion } from "framer-motion";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

interface IConnexionProps {
    Connect: (user: UserInfo, clientType: string) => void;

}

interface IConnexionState {
    user: UserInfo;
    loading: boolean;

    installed: boolean;
    browser: 'chrome' | 'ios';
}

export interface UserInfo {
    nickname: string;
    id: string;
}

export interface ServerUserInfo {
    host: boolean;
    nickname: string;
    id: string;
}

export class Connexion extends React.Component<IConnexionProps, IConnexionState>{
    nicknameInput = React.createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        let installed = false;
        if (window.matchMedia('(display-mode: standalone)').matches) {
            installed = true;
        }

        let userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.match(/chrome|chromium|crios/i)) {
            browserName = "chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
            browserName = "firefox";
        } else if (userAgent.match(/safari/i)) {
            if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                browserName = "ios";
             }
             else {
                browserName = "macos";
             }
        } else if (userAgent.match(/opr\//i)) {
            browserName = "opera";
        } else if (userAgent.match(/edg/i)) {
            browserName = "edge";
        } else {
            browserName = "No browser detection";
        }

        let userInfoJSON = localStorage.getItem('userInfo');
        let userInfo: UserInfo | null = null;

        if (userInfoJSON) {
            userInfo = JSON.parse(userInfoJSON);
        }

        if (userInfo && userInfo.id) {
            this.state = {
                user: {
                    nickname: userInfo.nickname,
                    id: userInfo.id
                },
                loading: false,
                installed: installed,
                browser: browserName
            }
        }
        else {
            this.state = {
                user: {
                    nickname: '',
                    id: uuidv4()
                },
                loading: false,
                installed: installed,
                browser: browserName
            }
            localStorage.setItem('userInfo', JSON.stringify(this.state.user));
        }

    }
    connect() {
        if (this.nicknameInput.current && this.props.Connect) {
            let nickname = this.nicknameInput.current.value.trim();
            this.setState({
                user: { ...this.state.user, nickname: nickname },
                loading: true
            }, async () => {
                localStorage.setItem('userInfo', JSON.stringify(this.state.user));

                console.log('sending', this.state.user);

                axios.post('/api/connect', this.state.user)
                    .then(response => {
                        console.log('response', JSON.stringify(response.data));
                        this.props.Connect(this.state.user, response.data);
                    });
            })
        }
    }

    render(): React.ReactNode {
        if (!this.state.installed) {

            if (this.state.browser === 'ios') {
                return (
                    <div className="fixed inset-0 flex items-center justify-center bg-[#9AC8EB]">
                        <div className="flex flex-col max-w-xs gap-2 bg-gray-100 py-4 px-6 absolute bottom-8 rounded-md">
                            <div className="bg-gray-100 rotate-45 w-6 h-6 absolute bottom-0 left-1/2 -translate-x-1/2 -mb-3"></div>
                            <h1 className="font-bold text-lg text-center">B'jour!</h1>
                            <p className="mb-4 text-gray-800">ComicChat est une <a href="https://wikipedia.org/wiki/Progressive_web_app" className="font-semibold text-[#9AC8EB]">PWA</a>, pour pouvoir correctement fonctionner elle doit être installée sur votre périphérique.</p>
                            <p className="mb-4 text-gray-800">Voici les étapes à suivre :</p>
                            <div className="flex items-center gap-4">
                                <div className="border-2 text-center border-gray-600 text-gray-600 font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                                    1
                                </div>

                                <div className="flex h-11 items-center bg-white px-3 rounded-lg justify-center grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#007AFF" className="h-5 w-5" viewBox="0 0 512 512">
                                        <path d="M267.3 4.7c-6.2-6.2-16.4-6.2-22.6 0l-104 104c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L240 54.6V320c0 8.8 7.2 16 16 16s16-7.2 16-16V54.6l76.7 76.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-104-104zM64 32C28.7 32 0 60.7 0 96V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H416c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H96c8.8 0 16-7.2 16-16s-7.2-16-16-16H64z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="border-2 text-center border-gray-600 text-gray-600 font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                                    2
                                </div>

                                <div className="flex h-11 items-center bg-white px-3 rounded-lg gap-4 grow">
                                    <div className="grow font-semibold text-[#007AFF] whitespace-nowrap truncate">Sur l'écran d'accueil</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#007AFF" className="h-6 w-6" viewBox="0 0 512 512">
                                        <path d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM208 352V272H128c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V160c0-8.8 7.2-16 16-16s16 7.2 16 16v80h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H240v80c0 8.8-7.2 16-16 16s-16-7.2-16-16z" />
                                    </svg>

                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="border-2 text-center border-gray-600 text-gray-600 font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                                    3
                                </div>

                                <div className="flex h-11 items-center bg-white px-3 rounded-lg gap-4 grow justify-end">
                                    <div className="font-semibold text-[#007AFF]">Ajouter</div>

                                </div>
                            </div>

                        </div>
                    </div>
                )
            }
            else if (this.state.browser === 'chrome') {
                return (
                    <div className="fixed inset-0 flex items-center justify-center bg-[#9AC8EB]">
                        <div className="flex flex-col max-w-xs gap-2 bg-gray-100 py-4 px-6 absolute top-8 right-[190px] rounded-md">
                            <div className="bg-gray-100 rotate-45 w-6 h-6 absolute top-0 left-1/2 -translate-x-1/2 -mt-3"></div>
                            <h1 className="font-bold text-lg text-center">B'jour!</h1>
                            <p className="mb-4 text-gray-800">ComicChat est une <a href="https://wikipedia.org/wiki/Progressive_web_app" className="font-semibold text-[#9AC8EB]">PWA</a>, pour pouvoir correctement fonctionner elle doit être installée sur votre périphérique.</p>
                            <p className="mb-4 text-gray-800">Voici les étapes à suivre :</p>
                            <div className="flex items-center gap-4">
                                <div className="border-2 text-center border-gray-600 text-gray-600 font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                                    1
                                </div>

                                <div className="flex h-11 items-center bg-white px-3 rounded-lg justify-center grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                                        <g>
                                            <rect fill="none" height="24" width="24" />
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M20,17H4V5h8V3H4C2.89,3,2,3.89,2,5v12c0,1.1,0.89,2,2,2h4v2h8v-2h4c1.1,0,2-0.9,2-2v-3h-2V17z" />
                                                <polygon points="17,14 22,9 20.59,7.59 18,10.17 18,3 16,3 16,10.17 13.41,7.59 12,9" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="border-2 text-center border-gray-600 text-gray-600 font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                                    2
                                </div>

                                <div className="flex h-11 items-center bg-white px-3 rounded-lg gap-4 grow justify-center">
                                    <div className="font-semibold bg-[#007AFF] rounded-md px-4 py-2 text-xs text-white">Installer</div>

                                </div>
                            </div>


                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div>
                        Unsupported device [{this.state.browser}]
                    </div>
                )
            }
        } else {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-[#9AC8EB]">
                    <div className="flex flex-col max-w-xs gap-2">
                        <motion.div
                            initial={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 1 }}
                            style={{ fontFamily: 'Cats' }}
                            className="text-white text-center">

                            <div className="text-3xl">Welcome to</div>
                            <div className="text-4xl">ComicChat</div>
                            <pre className="text-xs">
                                {this.state.user.id}
                            </pre>
                        </motion.div>

                        <motion.svg
                            initial={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="320" height="320" viewBox="0 0 1024 1024">
                            <g id="icon" >
                                <rect width="1024" height="1024" fill="transparent" />
                                <path id="Tracé_6" data-name="Tracé 6" d="M808.476,393.5c31.754,0,60.409,8.651,82.129,22.484-11.563-24.01-43.759-41.425-82.129-41.425s-70.561,17.415-82.126,41.423C748.069,402.147,776.725,393.5,808.476,393.5Z" transform="translate(-25.79 17.065)" fill="#588daf" />
                                <path id="Tracé_7" data-name="Tracé 7" d="M197.46,393.5c31.754,0,60.409,8.651,82.129,22.484-11.563-24.01-43.759-41.425-82.129-41.425s-70.562,17.415-82.127,41.423C137.052,402.147,165.708,393.5,197.46,393.5Z" transform="translate(44.463 17.065)" fill="#588daf" />
                                <path id="Tracé_8" data-name="Tracé 8" d="M477,546.542c-106.687,0-205.306-4.505-275.937-21.779,38.85,20.024,147.023,34.549,275.94,34.549s237.075-14.525,275.932-34.548C679.524,542.037,583.684,546.542,477,546.542Z" transform="translate(34.606 -0.205)" fill="#588daf" opacity="0.5" />
                                <path id="Tracé_9" data-name="Tracé 9" d="M256,540.974v22.6c0,38.991,34.023,70.6,73.013,70.6s73.015-31.608,73.015-70.6v-9.49Z" transform="translate(28.29 -2.07)" fill="#fefefe" />
                                <path id="Tracé_10" data-name="Tracé 10" d="M766.718,540.974v22.6a70.36,70.36,0,1,1-140.719,0v-9.49Z" transform="translate(-14.252 -2.07)" fill="#fefefe" />
                            </g>
                        </motion.svg>

                        {this.state.loading ?
                            <div>loading</div>
                            :
                            <>
                                <motion.input type="text"
                                    initial={{ opacity: 0, translateY: -10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    style={{ fontFamily: 'Comic' }}
                                    className="rounded-md px-4 py-2 shadow-md text-lg h-11"
                                    ref={this.nicknameInput}
                                    defaultValue={this.state.user.nickname} />

                                <motion.button onClick={() => this.connect()}
                                    initial={{ opacity: 0, translateY: -10 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    style={{ fontFamily: 'Cats' }}
                                    className="bg-[#5784BA] rounded-md shadow-md px-4 py-2 text-white font-bold text-2xl">
                                    Connect
                                </motion.button>
                            </>
                        }

                    </div>


                    {/*@ts-ignore */}
                    <div className="fixed top-2 right-2 bg-[#5784BA] text-white flex rounded-md items-center justify-center text-lg w-12 h-12" onClick={() => location.reload(true)}>
                        <i className="fa-duotone fa-rotate"></i>
                    </div>
                </div>
            )
        }


    }
}