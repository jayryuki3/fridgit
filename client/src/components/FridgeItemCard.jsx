// ── Fridge Item Card Component ────────────────────────────────────────
// Reusable card component for displaying fridge items in two modes:
// - 'detailed': Shows full nutrition info (calories, protein, carbs, fat)
// - 'compact': Shows only item name and expiry date (for 5x5 grid view)

import { Trash2 } from "lucide-react";
import { r2, hasNutrition, getDaysUntilExpiry } from "../utils/helpers.js";

export default function FridgeItemCard({
  item,
  viewMode = "detailed",
  onOpenDetail,
  onConsume,
  onDelete,
}) {
  const handleConsume = (e) => {
    e.stopPropagation();
    onConsume?.(item.id, e);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(item.id, e);
  };

  // Determine nutrition label based on nutrition_basis
  const isPerServing = item.nutrition_basis === "serving";
  const nutritionLabel = isPerServing ? "per serving" : "per 100g";

  // Format expiry date for display
  const formatExpiryDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Generate expiry badge based on days until expiry
  const getExpiryBadge = (date) => {
    const days = getDaysUntilExpiry(date);
    if (days === null) return null;
    if (days <= 0)
      return (
        <span className="rounded-md bg-fridgit-dangerPale px-1.5 py-0.5 text-[10px] font-bold text-fridgit-danger dark:bg-dracula-red/20 dark:text-dracula-red">
          Expired
        </span>
      );
    if (days <= 3)
      return (
        <span className="rounded-md bg-fridgit-accentPale px-1.5 py-0.5 text-[10px] font-bold text-fridgit-accent dark:bg-dracula-orange/20 dark:text-dracula-orange">
          {days}d
        </span>
      );
    if (days <= 7)
      return (
        <span className="rounded-md bg-fridgit-primaryPale px-1.5 py-0.5 text-[10px] font-bold text-fridgit-primary dark:bg-dracula-green/20 dark:text-dracula-green">
          {days}d
        </span>
      );
    return null;
  };

  // Compact view: Just image, name, and expiry
  if (viewMode === "compact") {
    return (
      <div
        onClick={() => onOpenDetail?.(item)}
        className="group cursor-pointer rounded-xl border border-fridgit-border bg-white p-2 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-dracula-line dark:bg-dracula-surface dark:hover:border-dracula-purple/50"
      >
        <div className="mb-2 flex items-start justify-between gap-1">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fridgit-surfaceAlt text-xl dark:bg-dracula-bg">
              {item.emoji || "\u{1F4E6}"}
            </span>
          )}
          {getExpiryBadge(item.expiry_date)}
        </div>
        <h3 className="truncate text-xs font-semibold text-fridgit-text dark:text-dracula-fg">
          {item.name}
        </h3>
      </div>
    );
  }

  // Detailed view: Full nutrition info
  const hasAnyNutrition =
    hasNutrition(item.calories) ||
    hasNutrition(item.protein) ||
    hasNutrition(item.carbs) ||
    hasNutrition(item.fat);

  return (
    <div
      onClick={() => onOpenDetail?.(item)}
      className="group cursor-pointer rounded-2xl border border-fridgit-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-dracula-line dark:bg-dracula-surface dark:hover:border-dracula-purple/50"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-fridgit-surfaceAlt text-3xl dark:bg-dracula-bg">
            {item.emoji || "\u{1F4E6}"}
          </span>
        )}
        {getExpiryBadge(item.expiry_date)}
      </div>

      <h3 className="truncate text-base font-semibold text-fridgit-text dark:text-dracula-fg">
        {item.name}
      </h3>
      <p className="mt-1 text-sm text-fridgit-textMuted dark:text-dracula-comment">
        Qty: {item.quantity} {item.unit}
      </p>
      {item.expiry_date && (
        <p className="mt-0.5 text-xs text-fridgit-textMuted dark:text-dracula-comment">
          Expires: {formatExpiryDate(item.expiry_date)}
        </p>
      )}

      {/* Nutrition info - prominently displayed */}
      {hasAnyNutrition && (
        <div className="mt-3 rounded-xl bg-fridgit-bg p-2 dark:bg-dracula-bg">
          <div className="mb-1 text-[9px] font-medium text-fridgit-textMuted dark:text-dracula-comment">
            {nutritionLabel}
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="text-center">
              <div className="text-sm font-bold text-fridgit-text dark:text-dracula-fg">
                {r2(item.calories)}
              </div>
              <div className="text-[8px] text-fridgit-textMuted dark:text-dracula-comment">
                kcal
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-fridgit-primary dark:text-dracula-green">
                {r2(item.protein)}
              </div>
              <div className="text-[8px] text-fridgit-textMuted dark:text-dracula-comment">
                Protein
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-fridgit-accent dark:text-dracula-orange">
                {r2(item.carbs)}
              </div>
              <div className="text-[8px] text-fridgit-textMuted dark:text-dracula-comment">
                Carbs
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-fridgit-danger dark:text-dracula-red">
                {r2(item.fat)}
              </div>
              <div className="text-[8px] text-fridgit-textMuted dark:text-dracula-comment">
                Fat
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleConsume}
          className="flex-1 rounded-lg bg-fridgit-accentPale px-3 py-2 text-sm font-medium text-fridgit-accent transition-colors hover:bg-fridgit-accent hover:text-white dark:bg-dracula-orange/20 dark:text-dracula-orange dark:hover:bg-dracula-orange dark:hover:text-dracula-bg"
        >
          Consume
        </button>
        <button
          onClick={handleDelete}
          className="rounded-lg bg-fridgit-surfaceAlt px-3 py-2 text-fridgit-textMuted transition-colors hover:bg-fridgit-dangerPale hover:text-fridgit-danger dark:bg-dracula-selection/30 dark:text-dracula-comment dark:hover:bg-dracula-red/20 dark:hover:text-dracula-red"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
