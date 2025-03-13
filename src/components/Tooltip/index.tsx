import React, { ReactNode } from 'react';
import { cn } from '../../utils/tailwind-cn';

interface TooltipProps {
  children: ReactNode;
  content: string;
  show?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * @description Tooltip Component - A simple tooltip that appears when hovering over its children
 * 
 * @param children - The element to which the tooltip is attached
 * @param content - The content of the tooltip
 * @param show - Whether to show the tooltip (useful for conditional tooltips)
 * @param position - The position of the tooltip relative to its children
 * 
 * @returns Tooltip Component
 */
export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  show = true, 
  position = 'top' 
}) => {
  if (!content || !show) return <>{children}</>;

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={cn(
        "absolute z-50 px-2 py-1 text-xs bg-slate-800 text-slate-100 rounded shadow-lg",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        "whitespace-nowrap pointer-events-none",
        positionClasses[position]
      )}>
        {content}
        <div className={cn(
          "absolute w-2 h-2 bg-slate-800 transform rotate-45",
          position === 'top' && 'top-full -translate-y-1 left-1/2 -translate-x-1/2',
          position === 'right' && 'right-full translate-x-1 top-1/2 -translate-y-1/2',
          position === 'bottom' && 'bottom-full translate-y-1 left-1/2 -translate-x-1/2',
          position === 'left' && 'left-full -translate-x-1 top-1/2 -translate-y-1/2',
        )}></div>
      </div>
    </div>
  );
};