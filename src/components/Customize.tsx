import React from 'react';

interface CustomizeProps {
    onCustomizationComplete: () => void;
}

export const Customize: React.FC<CustomizeProps> = ({ onCustomizationComplete }) => {
    const handleComplete = () => {
        // Perform character customization logic
        onCustomizationComplete();
    };

    return (
        <div>
            <h1>Customize Your Character</h1>
            <button onClick={handleComplete}>Complete Customization</button>
        </div>
    );
};