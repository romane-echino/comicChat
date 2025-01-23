import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect } from 'react';

interface QrScannerProps {
    onResult: (result: string) => void;
    onError?: (error: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onResult, onError }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render((decodedText) => {
            onResult(decodedText);
            scanner.clear();
        }, (error) => {
            if (onError) {
                onError(error || 'Scan error');
            }
        });

        return () => {
            scanner.clear();
        };
    }, [onResult, onError]);

    return (
        <div id="reader" className="w-full max-w-md mx-auto"></div>
    );
};