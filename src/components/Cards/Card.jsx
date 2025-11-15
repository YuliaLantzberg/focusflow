export default function Card({ className = "", children }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-8 ${className}`}>
      {children}
    </div>
  );
}
