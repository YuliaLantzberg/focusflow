"use client";

export default function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <>
      <label className="block mb-1 text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
      />
    </>
  );
}
