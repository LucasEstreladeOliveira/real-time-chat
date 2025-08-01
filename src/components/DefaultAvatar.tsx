import React from 'react';

interface DefaultAvatarProps {
    size?: number;
    className?: string;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ size = 40, className = '' }) => {
    return (
        <div
            className={`relative rounded-full overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white"
            >
                <path fill="currentColor" d="M25 11C18.2871 11 13 16.41 13 23C13 30.7908 19.2092 37 27 37V45C14.7908 45 5 35.209 5 23C5 12.0512 13.8095 3 25 3C35.2331 3 43 10.828 43 21C43 29.9675 35.9576 37 27 37V29C31.5423 29 35 25.5462 35 21C35 15.2295 30.7981 11 25 11Z"></path>
            </svg>
        </div>
    );
}; 