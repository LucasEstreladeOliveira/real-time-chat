import React from 'react';

interface FormButtonProps {
    type: 'submit' | 'button';
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'link';
    children: React.ReactNode;
}

export const FormButton: React.FC<FormButtonProps> = ({
    type,
    onClick,
    disabled = false,
    variant = 'primary',
    children,
}) => {
    const baseStyles = {
        primary: 'w-full rounded-chat bg-primary px-4 py-2 text-white disabled:opacity-50 hover:bg-accent transition-colors',
        link: 'text-sm text-primary hover:text-accent',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseStyles[variant]}
        >
            {children}
        </button>
    );
}; 