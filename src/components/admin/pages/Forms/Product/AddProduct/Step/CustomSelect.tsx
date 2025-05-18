import React from 'react';
import Select from 'react-select';

type Option = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  options,
  onChange,
  label,
  required = false,
  placeholder = 'Chọn...',
}) => {
  // Đổi từ value sang object react-select
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected: Option | null) => {
    const fakeEvent = {
      target: {
        name,
        value: selected ? selected.value : '',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(fakeEvent);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 font-medium">
          {label} {required && '*'}
        </label>
      )}
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default CustomSelect;
