import React from 'react';
import { Conversations } from './Conversations';
import { Room } from './Room';
import { QrScanner } from './QrScanner';

interface IAppContentProps {
}

interface IAppContentState {
    openMobile: boolean;
    openCamera: boolean;
}


export class AppContent extends React.Component<IAppContentProps, IAppContentState> {

    constructor(props:IAppContentProps) {
        super(props);

        this.state = {
            openMobile: true,
            openCamera: false
        }
    }

    handleQrScan = (result: any) => {
        if (result) {
            console.log('QR Code detected:', result);

        }
    }

    render() {
        return (
            <div className='flex inset-0 fixed text-white bg-black'>
                <div className={`bg-black  w-full max-w-md ${this.state.openMobile ? 'block' : 'hidden'} md:block`}>
                    <Conversations
                        AddDevice={() => this.setState({ openCamera: true })}
                        Select={() => this.setState({ openMobile: false })} />
                </div>
                
                <Room Back={() => this.setState({ openMobile: true })} />

                {this.state.openCamera &&
                    <div className='fixed inset-0 bg-black z-50'>
                        <div className="p-4">
                            <button
                                onClick={() => this.setState({ openCamera: false })}
                                className="text-white mb-4"
                            >
                                Close Camera
                            </button>
                            <QrScanner
                                onResult={(result) => {
                                    console.log('QR Code detected:', result);
                                    this.setState({ openCamera: false });
                                }}
                                onError={(error) => console.error(error)}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default AppContent;