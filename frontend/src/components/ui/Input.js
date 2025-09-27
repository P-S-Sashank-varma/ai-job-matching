import React from "react"

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  const baseStyles = "flex h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }