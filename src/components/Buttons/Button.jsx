export default function Button({
  as = "button",
  variant = "primary", // "primary" | "success" | "danger" | "link" | "ghost" | "filter"
  size = "md", // "sm" | "md" | "lg" | "full"
  isActive = false, // useful for filter toggles
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const Comp = as; // allows <Button as="a" href="#"> for true links
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-sm h-8 px-3",
    md: "text-sm h-10 px-4",
    lg: "text-base h-12 px-5",
    full: "w-full text-sm h-10 px-4",
  };

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    link: `bg-transparent ${
      props.isDanger ? "text-red-500" : "text-blue-600"
    } hover:underline px-0 h-auto`, // no box
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    filter: isActive
      ? "bg-blue-100 text-blue-700"
      : "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      aria-pressed={variant === "filter" ? isActive : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}
