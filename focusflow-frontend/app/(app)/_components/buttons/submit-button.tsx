import { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
};

export default function SubmitButton({ children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full p-4 rounded-xl bg-sky-600/50 text-white font-medium hover:bg-sky-500/50 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
