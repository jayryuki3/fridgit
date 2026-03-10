// ── Shared constants ──────────────────────────────────────────────
// Single source of truth used by multiple pages and components.
// Import from here instead of duplicating definitions.

export const locationOptions = ['fridge', 'freezer', 'pantry', 'counter'];

// Categories WITH the "All" filter entry.
// Fridge uses the full array (filter chips); NewItem slices off index 0.
export const categories = [
  { key: 'all',        label: 'All',     emoji: '\u{1F3E0}' },
  { key: 'dairy',      label: 'Dairy',   emoji: '\u{1F95B}' },
  { key: 'meat',       label: 'Meat',    emoji: '\u{1F357}' },
  { key: 'vegetables', label: 'Veggies', emoji: '\u{1F96C}' },
  { key: 'fruits',     label: 'Fruits',  emoji: '\u{1F34E}' },
  { key: 'beverages',  label: 'Drinks',  emoji: '\u{1F964}' },
  { key: 'condiments', label: 'Sauces',  emoji: '\u{1FAD9}' },
  { key: 'grains',     label: 'Grains',  emoji: '\u{1F33E}' },
  { key: 'snacks',     label: 'Snacks',  emoji: '\u{1F36A}' },
  { key: 'other',      label: 'Other',   emoji: '\u{1F4E6}' },
];

// Convenience: categories without the synthetic "All" entry.
// Used by NewItem category picker.
export const categoryOptions = categories.filter((c) => c.key !== 'all');

// Avatar colour ring shared by SharePicker and GuestPicker.
export const COLORS = [
  'bg-fridgit-primary', 'bg-fridgit-accent', 'bg-fridgit-danger',
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500',
];

// Extract up-to-2-char initials from a display name.
export function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}
