import { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

export default function SubmitButton({
  children,
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full p-4 rounded-xl text-white font-medium  transition-colors ${
        disabled
          ? "bg-sky-600/20 opacity-50"
          : "bg-sky-600/50 hover:bg-sky-500/50 cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}
