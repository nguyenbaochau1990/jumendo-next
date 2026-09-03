import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'rounded-2.25 text-[13px] font-bold';
  const variantClasses =
    variant === 'primary'
      ? 'flex items-center gap-2 bg-accent px-4.5 py-2.5 text-accent-fg'
      : variant === 'ghost'
      ? 'rounded-2.25 border border-ghost-bd px-4.5 py-2.5 text-[13px] text-text'
      : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}