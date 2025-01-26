import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ComicToken, ComicTon } from '../Utils/Token';
import { PeerAPI, PeerTon } from '../Utils/Peer';

interface DesktopLoginProps {
    onLogin: () => void;
}



export const DesktopLogin: React.FC<DesktopLoginProps> = ({ onLogin }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        try {
            const uniqueId = ComicTon.getInstance().getUniqueId();
            PeerAPI.registerDesktop(uniqueId).then(() => {
                setIsConnected(true);
                PeerTon.getInstance().Init();
            });
        }
        catch (error) {
            console.log('Failed to register desktop:', error);
        }
    }, []);

    return (
        <div className="inset-0 fixed flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Connect to ComicChat</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Scan this QR code with your mobile device to connect
                </p>

                {/* QR Code Container */}
                <div className="flex justify-center mb-6">
                    <div className="w-64 h-64 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                        {isConnected &&
                            <QRCodeSVG
                                value={ComicTon.getInstance().getUniqueId()}
                                size={256} />
                        }
                    </div>
                </div>

                <div className="text-sm text-gray-500 text-center">
                    <p className="mb-2">1. Open ComicChat on your mobile device</p>
                    <p className="mb-2">2. Click on "Scan QR Code"</p>
                    <p>3. Point your camera at this QR code</p>
                </div>
            </div>
        </div>
    );
};