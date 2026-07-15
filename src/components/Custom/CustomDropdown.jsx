"use client";

const CustomDropdown = ({
  label,
  value,
  onChange,
  name,
  id,
  required,
  className,
  options = [],
  children,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-600">
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e)}
        required={required}
        className={` border rounded-full border-gray-300 p-2 ${className || ""}`}
      >
        {/* 🔥 Priority: children > options */}

        {children
          ? children
          : (
            <>
              <option value="">Select {label}</option>
              {options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </>
          )}
      </select>
    </div>
  );
};

export default CustomDropdown;