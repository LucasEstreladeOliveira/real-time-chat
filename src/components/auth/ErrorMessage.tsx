import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
        {message}
    </div>
); 