export const Button = ({
    children,
    onClick,
    disabled,
    className = '',
    type = 'primary'
}: {
    children: React.ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    className?: string,
    type?: 'primary' | 'secondary' | 'danger'
}) => {
    const buttonStyles = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`py-1.5 px-3 rounded transition-colors cursor-pointer ${disabled ? 'bg-gray-400 cursor-not-allowed' : buttonStyles[type]
                } ${className}`}
        >
            {children}
        </button>
    );
};
