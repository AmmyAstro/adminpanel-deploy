'use client';

const CustomDropdown = ({
  label,
  value,
  onChange,
  name,
  id,
  required,
  className,
  children
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-600">
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border rounded-full border-gray-300 p-2 ${className || ""}`}
      >
        {children}
      </select>
    </div>
  );
};

export default CustomDropdown;