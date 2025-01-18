import React, { useState, useRef, useEffect } from 'react';
import { ComicToken } from '../Utils/Token';

interface ValidateCodeProps {
    onValidationComplete: () => void;
}

export const ValidateCode: React.FC<ValidateCodeProps> = ({ onValidationComplete }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (code.length === 6) {
            handleSubmit();
        }
    }, [code]);

    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newCode = code.split('');
            newCode[index] = value;
            setCode(newCode.join(''));

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        if (code.length === 6 && /^\d+$/.test(code)) {
            try {
                setIsLoading(true);
                setError('');
                await ComicToken.validateCode(code);
                onValidationComplete();
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to validate code');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="inset-0 fixed flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Enter verification code</h1>
                <p className="text-gray-600 mb-6 text-center">
                    We sent you a verification code via SMS. Please enter it below:
                </p>

                {error && (
                    <div className="text-red-500 mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-center gap-2 mb-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            value={code[index] || ''}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ))}
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={code.length !== 6 || isLoading}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        isLoading || code.length !== 6
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
            </div>
        </div>
    );
};