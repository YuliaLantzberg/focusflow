import { SIZES } from "@/app/lib/styles";

type BtnProps<T> = {
  data: T;
  onClick: (value: T) => void;
  label: string;
  bgColor: string;
};

export default function Btn<T>({ onClick, data, label, bgColor }: BtnProps<T>) {
  return (
    <button
      type="button"
      className={`w-3xl p-4 ${SIZES.radiusMedium} text-white font-medium text-sm ${bgColor} hover:${bgColor}/50 cursor-pointer `}
      onClick={() => onClick(data)}
    >
      {label}
    </button>
  );
}
