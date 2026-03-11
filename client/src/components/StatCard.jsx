import { r2 } from "../utils/helpers.js";

const colorMap = {
  primary: {
    bg: "bg-fridgit-primaryPale dark:bg-dracula-green/20",
    icon: "text-fridgit-primary dark:text-dracula-green",
  },
  accent: {
    bg: "bg-fridgit-accentPale dark:bg-dracula-orange/20",
    icon: "text-fridgit-accent dark:text-dracula-orange",
  },
  danger: {
    bg: "bg-fridgit-dangerPale dark:bg-dracula-red/20",
    icon: "text-fridgit-danger dark:text-dracula-red",
  },
};

export default function StatCard({ icon: Icon, value, label, color = "primary", className = "" }) {
  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className={`panel-section flex items-center gap-3 sm:gap-4 ${className}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-xl ${colors.bg} h-10 w-10 sm:h-12 sm:w-12`}>
        <Icon size={18} className={`${colors.icon} sm:w-5 sm:h-5`} />
      </div>
      <div className="min-w-0">
        <p className="text-lg sm:text-2xl font-bold text-fridgit-text dark:text-dracula-fg truncate">
          {typeof value === "number" ? r2(value) : value}
        </p>
        <p className="text-xs sm:text-sm text-fridgit-textMuted dark:text-dracula-comment truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
