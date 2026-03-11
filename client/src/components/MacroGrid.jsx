import { Flame, Beef, Wheat, Droplet } from "lucide-react";
import { r2 } from "../utils/helpers.js";

export default function MacroGrid({ 
  calories = 0, 
  protein = 0, 
  carbs = 0, 
  fat = 0, 
  size = "normal",
  showLabel = true,
  className = "",
  dailyLabel = null
}) {
  const isCompact = size === "compact";
  
  const macros = [
    { key: "calories", value: calories, unit: "", icon: Flame, color: "accent", label: dailyLabel || "kcal" },
    { key: "protein", value: protein, unit: "g", icon: Beef, color: "primary", label: "Protein" },
    { key: "carbs", value: carbs, unit: "g", icon: Wheat, color: "blue", label: "Carbs" },
    { key: "fat", value: fat, unit: "g", icon: Droplet, color: "danger", label: "Fat" },
  ];

  const colorClasses = {
    accent: "text-fridgit-accent dark:text-dracula-orange",
    primary: "text-fridgit-primary dark:text-dracula-green",
    blue: "text-blue-600 dark:text-blue-400",
    danger: "text-fridgit-danger dark:text-dracula-red",
  };

  const bgClasses = {
    accent: "bg-fridgit-accentPale dark:bg-dracula-orange/20",
    primary: "bg-fridgit-primaryPale dark:bg-dracula-green/20",
    blue: "bg-blue-100 dark:bg-blue-900/30",
    danger: "bg-fridgit-dangerPale dark:bg-dracula-red/20",
  };

  if (isCompact) {
    return (
      <div className={`grid grid-cols-4 gap-1 sm:gap-2 ${className}`}>
        {macros.map((m) => (
          <div key={m.key} className="text-center">
            <div className={`text-sm sm:text-base font-bold ${colorClasses[m.color]}`}>
              {r2(m.value)}{m.unit}
            </div>
            {showLabel && (
              <div className="text-[8px] sm:text-[10px] text-fridgit-textMuted dark:text-dracula-comment">
                {m.key === "calories" ? m.label : m.label}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 ${className}`}>
      {macros.map((m) => {
        const Icon = m.icon;
        return (
          <div 
            key={m.key} 
            className={`panel-section flex items-center gap-2 sm:gap-3 py-2 sm:py-3`}
          >
            <div className={`flex shrink-0 items-center justify-center rounded-xl ${bgClasses[m.color]} h-8 w-8 sm:h-10 sm:w-10`}>
              <Icon size={14} className={`${colorClasses[m.color]} sm:w-[18px] sm:h-[18px]`} />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-fridgit-text dark:text-dracula-fg truncate">
                {r2(m.value)}{m.unit}
              </p>
              <p className="text-[10px] sm:text-xs text-fridgit-textMuted dark:text-dracula-comment">
                {showLabel ? m.label : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
