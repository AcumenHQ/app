import type { CircularProgressProps } from '@/types/types';

export const CircularProgress = ({
    percentage,
    size = 60,
    strokeWidth = 4,
    className = ""
}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-600"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="text-green-500 transition-all duration-300 ease-in-out"
                    strokeLinecap="round"
                />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};
