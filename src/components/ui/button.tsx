import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-[0.99]':
              variant === 'default',
            'border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-200':
              variant === 'outline',
            'hover:bg-slate-800 text-slate-300 hover:text-white':
              variant === 'ghost',
            'text-indigo-400 underline-offset-4 hover:underline p-0 h-auto font-normal':
              variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-md px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
