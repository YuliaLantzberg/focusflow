import { COLORS, STYLES } from "@/app/lib/styles";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type ColumnProjOverviewProps = {
  title: string;
  icon: LucideIcon;
  className?: string;
  children: ReactNode;
};

export default function ColumnProjOverview({
  title,
  icon: Icon,
  className,
  children,
}: ColumnProjOverviewProps) {
  return (
    <div className="p-4">
      <h2 className={`${STYLES.flexCenterCenter} gap-3 mb-6 `}>
        <Icon /> {title}
      </h2>
      <div
        className={`${className} ${COLORS.textSecondary} ${STYLES.flexCenter} flex-col`}
      >
        {children}
      </div>
    </div>
  );
}
