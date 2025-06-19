'use client';

import React from 'react';

interface FilterDropdownProps<T extends string> {
  options: { value: T; label: string }[];
  value: T | '';
  onChange: (value: T | '') => void;
  placeholder?: string;
  className?: string;
}

export const FilterDropdown = <T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: FilterDropdownProps<T>) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange((e.target.value as T) || '')}
      className={`p-2 border rounded ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
