import { SIZES } from "@/app/lib/styles";

type BtnProps<T> = {
  data: T;
  onClick: (value: T) => void;
  label: string;
  bgColor: string;
  size?: string;
};

export default function Btn<T>({
  onClick,
  data,
  label,
  bgColor,
  size,
}: BtnProps<T>) {
  return (
    <button
      type="button"
      className={`${size} p-4 ${SIZES.radiusMedium} text-white font-medium text-sm ${bgColor} hover:${bgColor}/50 cursor-pointer `}
      onClick={() => onClick(data)}
    >
      {label}
    </button>
  );
}
