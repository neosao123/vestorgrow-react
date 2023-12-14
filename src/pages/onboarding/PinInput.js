import React, { useState } from 'react';
import './pininput.css'; // Import your CSS file

const PinInput = () => {
    const [pin, setPin] = useState(['', '', '', '']);
    const inputRefs = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];

    const handlePinInput = (index, value) => {
        // Ensure the input value is a digit
        const sanitizedValue = value.replace(/\D/g, '');

        // Update the pin state
        const newPin = [...pin];
        newPin[index] = sanitizedValue;
        setPin(newPin);

        // Move focus to the next input
        if (sanitizedValue.length > 0 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleBackspace = (index, event) => {
        // Move focus to the previous input on backspace
        if (index > 0 && event.key === 'Backspace' && pin[index] === '') {
            inputRefs[index - 1].current.focus();
        }
    };


    return (
        <div className="pin-tab">
                {pin.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        value={value}
                        maxLength={1}
                        onChange={(e) => handlePinInput(index, e.target.value)}
                        onKeyDown={(e) => handleBackspace(index, e)}
                        ref={inputRefs[index]}
                    />
                ))}
        </div>
    );
};

export default PinInput;
