import React from 'react';

export const Loading: React.FC = () => {
    return (
        <div className="inset-0 fixed flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Loading ComicChat</h1>
                
                {/* Loading Animation */}
                <div className="flex justify-center mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>

                {/* Loading Message */}
                <p className="text-gray-600 text-center">
                    Please wait while we set up your experience...
                </p>
            </div>
        </div>
    );
};