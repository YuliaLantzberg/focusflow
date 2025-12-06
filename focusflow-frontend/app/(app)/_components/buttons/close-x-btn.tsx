import { COLORS } from "@/app/lib/styles";

type CloseXBtnProps = {
  onClose: () => void;
};

export default function CloseXBtn({ onClose }: CloseXBtnProps) {
  return (
    <button
      id="close-modal"
      className={`absolute top-4 right-4 ${COLORS.textSecondary} hover:text-gray-200 text-4xl leading-none`}
      onClick={onClose}
    >
      &times;
    </button>
  );
}
