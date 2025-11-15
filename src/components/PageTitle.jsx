export default function PageTitle({ className = "", children }) {
  return (
    <div>
      <h1 className={`text-2xl font-semibold pl-3 mb-14 ${className}`}>
        {children}
      </h1>
    </div>
  );
}
