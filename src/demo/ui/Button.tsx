export const Button = ({
    children,
    onClick,
    disabled,
    className = '',
    type = 'default'
}: {
    children: React.ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    className?: string,
    type?: 'default' | 'primary' | 'secondary' | 'danger'
}) => {
    const buttonStyles = {
        default: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`py-1 px-3 text-sm rounded transition-colors cursor-pointer ${disabled ? 'bg-gray-400 cursor-not-allowed' : buttonStyles[type]
                } ${className}`}
        >
            {children}
        </button>
    );
};
