const Spinner = () => (
    <div className="relative inline-flex items-center justify-center">
        <svg 
            className="animate-spin h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="spinner-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
            </defs>
            <circle 
                className="opacity-25 dark:hidden" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="url(#spinner-gradient)" 
                strokeWidth="4"
            />
            <circle 
                className="opacity-25 hidden dark:block" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="url(#spinner-gradient-dark)" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75 dark:hidden" 
                fill="url(#spinner-gradient)" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
            <path 
                className="opacity-75 hidden dark:block" 
                fill="url(#spinner-gradient-dark)" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    </div>
);

export default Spinner;