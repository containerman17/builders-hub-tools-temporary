export const Button = ({ children, onClick, disabled }: { children: React.ReactNode, onClick?: () => void, disabled?: boolean }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`py-1.5 px-3 rounded transition-colors cursor-pointer ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
        >
            {children}
        </button>
    );
};
