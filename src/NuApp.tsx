import React, { createRef, useRef } from 'react';
import './tailwind.scss'
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router';
import { ChatBox, ChatEmotion } from './ChatBox';


interface IAppProps extends RouteComponentProps {

}

interface IAppState {

}


class App extends React.Component<IAppProps, IAppState> {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    async componentDidMount() {

    }



    render() {
        return (
            <div className='flex inset-0 fixed text-white'>
                <div className='bg-black  w-full max-w-md'>
                    <div className='p-4 flex flex-col gap-2'>
                        <div className='flex justify-between items-center text-2xl'>
                            <div className='font-bold'>Chats</div>
                            <div className='cursor-pointer'>
                                <i className="fa-solid fa-circle-plus text-comic"></i>
                            </div>
                        </div>

                        <div className='relative text-white/70'>
                            <div className='h-10 absolute flex items-center pl-4'>
                                <i className="fa-solid fa-magnifying-glass "></i>
                            </div>

                            <input type='text' placeholder='Rechercher' className='w-full border-none rounded-lg bg-white/10 font-semibold pl-10 pr-4 py-2' />
                        </div>
                    </div>

                    <div className=''>
                        <div className='flex p-4 items-center gap-4 hover:bg-white/5 cursor-pointer'>
                            <div className='rounded-full w-12 h-12 bg-white'></div>
                            <div className='grow'>
                                <div className='flex'>
                                    <div className='grow'>Fanny Benacloche</div>
                                    <div className='text-sm text-white/70'>20:38</div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <i className="fa-solid fa-check-double text-white/70"></i>
                                    <div className='grow truncate text-sm'>Je t'aime!</div>
                                    <i className="fa-solid fa-robot text-comic"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='grow bg-black/90 flex flex-col h-full'>
                    <div className='flex items-center gap-4 p-4'>
                        <div className='w-12 h-12 flex items-center justify-center'>
                            <i className="fa-solid fa-angle-left"></i>
                        </div>

                        <div className='rounded-full w-12 h-12 bg-white'></div>
                        <div className='font-semibold grow'>Fanny Benacloche</div>
                        <i className="fa-regular fa-ellipsis-vertical"></i>
                    </div>
                    <div className='bg-black grow p-4 flex flex-wrap overflow-y-auto'>
                        <div className='border border-white w-80 h-80'>
                            coucou
                        </div>

                    </div>
                    <div>
                        Message
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App)