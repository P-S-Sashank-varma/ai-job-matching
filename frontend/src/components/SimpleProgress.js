import React from "react";

const SimpleProgress = ({ value, className }) => {
  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div 
        className="h-full bg-primary transition-all bg-blue-600"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default SimpleProgress;
