import { ChangeEvent } from 'react';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  ariaLabel?: string;
}

export default function Input({
  placeholder = '',
  value,
  onChange,
  className = '',
  type = 'text',
  ariaLabel,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`w-full rounded-5.5 border border-border-3 bg-surface-3 px-3.75 py-0 text-[13px] text-text outline-none ${className}`.trim()}
    />
  );
}