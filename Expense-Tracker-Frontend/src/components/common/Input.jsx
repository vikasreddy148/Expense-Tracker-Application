import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-danger' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

