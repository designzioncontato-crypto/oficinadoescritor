
import React from 'react';
import { PlusIcon } from './icons';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-7xl mx-auto animate-fade-in ${className}`}>{children}</div>
);

export const PageHeader: React.FC<{ title: React.ReactNode; actions?: React.ReactNode; backLink?: React.ReactNode; }> = ({ title, actions, backLink }) => (
  <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
    <div className="flex-1 min-w-0">
      {backLink}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 truncate">{title}</h2>
    </div>
    {actions && <div className="flex items-center gap-4 flex-shrink-0">{actions}</div>}
  </div>
);

export const FormContainer: React.FC<{ onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; children: React.ReactNode; }> = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto">{children}</form>
);

export const FormSection: React.FC<{ title?: string; children: React.ReactNode; header?: React.ReactNode; className?: string }> = ({ title, children, header, className }) => (
  <div className={`bg-gray-700 p-6 rounded-lg ${className}`}>
    {header}
    {title && !header && <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-600 text-amber-400">{title}</h3>}
    <div className="space-y-4">{children}</div>
  </div>
);

export const EmptyState: React.FC<{ title: string; subtitle?: string; }> = ({ title, subtitle }) => (
    <div className="text-center py-10 px-6 bg-gray-700 rounded-lg">
        <p className="text-gray-300">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition" />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition min-h-24 resize-vertical" />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition appearance-none" />
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors whitespace-nowrap";
    const variantClasses = {
        primary: 'bg-amber-600 hover:bg-amber-500 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-500 text-gray-100'
    };
    return <button {...props} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</button>;
};

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm'|'md'|'xs'}> = ({children, className, size='md', ...props}) => {
    const sizeClasses = {
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-2.5'
    }
    return <button {...props} className={`bg-transparent text-gray-400 hover:text-gray-100 rounded-full transition-colors ${sizeClasses[size]} ${className}`}>{children}</button>;
}

export const Card: React.FC<{ children: React.ReactNode; color?: string; className?: string; onClick?: () => void; }> = ({ children, color = '#4A5568', className = '', onClick }) => (
    <div 
        onClick={onClick} 
        className={`bg-gray-700 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-amber-900/50 flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ borderLeft: `5px solid ${color}` }}
    >
        {children}
    </div>
);