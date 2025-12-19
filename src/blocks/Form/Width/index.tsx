import * as React from 'react';

export const Width: React.FC<{
  children: React.ReactNode;
  className?: string;
  width?: number | string; 
}> = ({ children, className, width }) => {
  return (
    <div
      className={className}
      style={{
        flexBasis: width ? `calc(${width}% - 0.5rem)` : 'auto',
        flexGrow: 1,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
};

