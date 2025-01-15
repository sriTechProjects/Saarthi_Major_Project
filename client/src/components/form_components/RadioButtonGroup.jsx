import React from 'react';

const RadioButtonGroup = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  required
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-primary-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center gap-4">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-2 cursor-pointer`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className={`
                w-4 h-4 text-primary border-gray-300 focus:ring-primary
              `}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
