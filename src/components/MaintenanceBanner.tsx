import React from 'react';

interface MaintenanceBannerProps {
    message: string;
    estimatedEndTime?: string;
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
    message,
    estimatedEndTime,
}) => {
    return (
        <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 absolute bottom-full">
            <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                    <svg
                        className="h-5 w-5 text-amber-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="flex-1 text-sm">
                    <p className="font-medium text-amber-800">
                        {message}
                    </p>
                    {estimatedEndTime && (
                        <p className="mt-0.5 text-amber-700">
                            Expected to resume at <span className="font-medium">{estimatedEndTime}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}; 