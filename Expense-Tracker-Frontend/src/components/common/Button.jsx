const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-danger text-white hover:bg-red-600',
    success: 'bg-success text-white hover:bg-green-600',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

