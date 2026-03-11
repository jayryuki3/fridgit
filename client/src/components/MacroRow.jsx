import { Beef, Wheat, Droplet } from "lucide-react";
import { r2 } from "../utils/helpers.js";

export default function MacroRow({ protein = 0, carbs = 0, fat = 0, className = "" }) {
  const macros = [
    { key: "protein", value: protein, unit: "g", icon: Beef, color: "primary", label: "Protein" },
    { key: "carbs", value: carbs, unit: "g", icon: Wheat, color: "blue", label: "Carbs" },
    { key: "fat", value: fat, unit: "g", icon: Droplet, color: "danger", label: "Fat" },
  ];

  const colorClasses = {
    primary: "text-fridgit-primary dark:text-dracula-green",
    blue: "text-blue-600 dark:text-blue-400",
    danger: "text-fridgit-danger dark:text-dracula-red",
  };

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {macros.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.key} className="flex-1 text-center">
            <div className={`flex items-center justify-center gap-1 text-base sm:text-lg font-bold ${colorClasses[m.color]}`}>
              <Icon size={14} className="sm:w-3.5 sm:h-3.5" />
              {r2(m.value)}{m.unit}
            </div>
            <div className="text-[9px] sm:text-[10px] text-fridgit-textMuted dark:text-dracula-comment">
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
