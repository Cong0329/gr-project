import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant: 'primary' | 'secondary' | 'danger' | 'success';
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    type = 'button',
    variant,
    children,
    className = ''
}) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none';

    const variantClasses = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};