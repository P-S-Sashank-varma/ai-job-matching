import React from "react"

const Badge = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-transparent text-gray-700"
  };
  
  const variantClass = variants[variant] || variants.default;
  
  return (
    <div
      ref={ref}
      className={`${baseStyles} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
Badge.displayName = "Badge"

export { Badge }