type TextBtnProps<T> = {
  data: T;
  onClick: (value: T) => void;
  label: string;
  color: string;
};

export default function TextBtn<T>({
  onClick,
  data,
  label,
  color,
}: TextBtnProps<T>) {
  return (
    <button
      type="button"
      className={`text-sm hover:underline cursor-pointer ${color}`}
      onClick={() => onClick(data)}
    >
      {label}
    </button>
  );
}
