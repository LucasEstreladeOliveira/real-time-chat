import React from 'react';

interface FormInputProps {
    type: 'text' | 'email' | 'password';
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    type,
    label,
    value,
    onChange,
    placeholder,
    required = false,
}) => (
    <div>
        <label className="block text-sm font-medium text-text mb-1">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-chat border border-secondary bg-background p-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            required={required}
        />
    </div>
); 