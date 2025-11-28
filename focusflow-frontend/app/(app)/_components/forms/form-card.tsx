import { ReactNode, FormEvent } from "react";

type FormCardProps = {
  children: ReactNode;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function FormCard({ children, handleSubmit }: FormCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl ">
          {children}
        </form>
      </div>
    </div>
  );
}
