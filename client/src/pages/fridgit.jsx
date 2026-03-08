import React, { useState, useEffect, useRef } from "react";

const theme = {
  bg: "#F7F9F4",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F4EC",
  primary: "#3D7A5A",
  primaryLight: "#5FA37D",
  primaryPale: "#E8F3ED",
  accent: "#F4A24A",
  accentPale: "#FEF3E2",
  danger: "#E8604C",
  dangerPale: "#FDECEA",
  warning: "#F4A24A",
  text: "#1A2A1E",
  textMid: "#4A6352",
  textMuted: "#8AA898",
  border: "#E2EDE6",
  white: "#FFFFFF",
};

const SCREENS = {
  ONBOARDING_WELCOME: "onboarding_welcome",
  ONBOARDING_SIGNUP: "onboarding_signup",
  ONBOARDING_NAME: "onboarding_name",
  ONBOARDING_NOTIFICATIONS: "onboarding_notifications",
  HOME: "home",
  VIEW_FRIDGE: "view_fridge",
  NEW_ITEM: "new_item",
  CONSUME: "consume",
  RECIPE: "recipe",
  ITEM_DETAIL: "item_detail",
  SETTINGS: "settings",
  MENU: "menu",
};

const SAMPLE_ITEMS = [
  { id: 1,  name: "Chicken Breast",  category: "Meat/Poultry", expDays: 1,   owner: "You",  qty: 3,  unit: "count",   calories: 165, location: "Freezer", shared: false, emoji: "🍗", color: "#FFF3E0", expiresOn: "Mar 5, 2026",  protein: "31g",  carbs: "0g",  fat: "3.6g" },
  { id: 2,  name: "Greek Yogurt",    category: "Dairy",         expDays: 2,   owner: "Alex", qty: 1,  unit: "count",   calories: 100, location: "Cooler",  shared: true,  emoji: "🥛", color: "#E8F5E9", expiresOn: "Mar 6, 2026",  protein: "17g",  carbs: "6g",  fat: "0.7g" },
  { id: 3,  name: "Strawberries",    category: "Fruits",        expDays: 3,   owner: "You",  qty: 80, unit: "serving", calories: 49,  location: "Cooler",  shared: true,  emoji: "🍓", color: "#FCE4EC", expiresOn: "Mar 7, 2026",  protein: "1g",   carbs: "12g", fat: "0.5g" },
  { id: 4,  name: "Salmon Fillet",   category: "Seafood",       expDays: 1,   owner: "You",  qty: 2,  unit: "count",   calories: 208, location: "Freezer", shared: false, emoji: "🐟", color: "#E3F2FD", expiresOn: "Mar 5, 2026",  protein: "20g",  carbs: "0g",  fat: "13g"  },
  { id: 5,  name: "Spinach",         category: "Vegetables",    expDays: 4,   owner: "Alex", qty: 60, unit: "serving", calories: 23,  location: "Cooler",  shared: true,  emoji: "🥬", color: "#E8F5E9", expiresOn: "Mar 8, 2026",  protein: "2.9g", carbs: "3.6g",fat: "0.4g" },
  { id: 6,  name: "Sriracha",        category: "Condiments",    expDays: 180, owner: "You",  qty: 1,  unit: "count",   calories: 5,   location: "Cooler",  shared: true,  emoji: "🌶️", color: "#FFEBEE", expiresOn: "Sep 1, 2026",  protein: "0g",   carbs: "1g",  fat: "0g"   },
  { id: 7,  name: "Blueberries",     category: "Fruits",        expDays: 5,   owner: "You",  qty: 90, unit: "serving", calories: 84,  location: "Cooler",  shared: false, emoji: "🫐", color: "#EDE7F6", expiresOn: "Mar 9, 2026",  protein: "1.1g", carbs: "21g", fat: "0.5g" },
  // Condiments
  { id: 8,  name: "Ketchup",         category: "Condiments",    expDays: 120, owner: "You",  qty: 75, unit: "serving", calories: 20,  location: "Cooler",  shared: true,  emoji: "🍅", color: "#FFEBEE", expiresOn: "Jul 2, 2026",  protein: "0g",   carbs: "5g",  fat: "0g"   },
  { id: 9,  name: "Kimchi",          category: "Condiments",    expDays: 14,  owner: "Alex", qty: 60, unit: "serving", calories: 15,  location: "Cooler",  shared: true,  emoji: "🥬", color: "#FFF3E0", expiresOn: "Mar 18, 2026", protein: "1g",   carbs: "2g",  fat: "0.5g" },
  { id: 10, name: "Chilli Paste",    category: "Condiments",    expDays: 90,  owner: "You",  qty: 50, unit: "serving", calories: 10,  location: "Cooler",  shared: true,  emoji: "🫙", color: "#FFEBEE", expiresOn: "Jun 2, 2026",  protein: "0g",   carbs: "2g",  fat: "0g"   },
  // Leftovers
  { id: 11, name: "Pizza",           category: "Leftovers",     expDays: 2,   owner: "You",  qty: 3,  unit: "count",   calories: 285, location: "Cooler",  shared: true,  emoji: "🍕", color: "#FFF8E1", expiresOn: "Mar 6, 2026",  protein: "12g",  carbs: "36g", fat: "10g"  },
  { id: 12, name: "Chipotle Bowl",   category: "Leftovers",     expDays: 1,   owner: "Alex", qty: 80, unit: "serving", calories: 650, location: "Cooler",  shared: false, emoji: "🌯", color: "#FFF3E0", expiresOn: "Mar 5, 2026",  protein: "35g",  carbs: "72g", fat: "18g"  },
];

const getExpColor = (days) => {
  if (days <= 1) return { bg: "#FDECEA", text: "#E8604C", label: "Expires today" };
  if (days <= 3) return { bg: "#FEF3E2", text: "#F4A24A", label: `${days}d left` };
  return { bg: "#E8F3ED", text: "#3D7A5A", label: `${days}d left` };
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const greetings = [
  "Let's start something fresh today.",
  "Your kitchen, your kingdom.",
  "Nothing goes to waste today.",
  "Fresh starts begin here.",
];

// ── Settings helper components ──
function SettingsSection({ label, children }) {
  return (
    <div style={{ margin: "0 20px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>{label}</div>
      <div style={{ background: theme.surface, borderRadius: 20, overflow: "hidden", border: `1px solid ${theme.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, value, tappable, toggle, onToggle, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: last ? "none" : `1px solid ${theme.border}`, gap: 14 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: theme.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{label}</div>
        {value && !toggle && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{value}</div>}
      </div>
      {toggle ? (
        <button onClick={onToggle} style={{ width: 46, height: 26, borderRadius: 13, background: value ? theme.primary : "#D0D8D4", border: "none", position: "relative", flexShrink: 0, transition: "background 0.25s" }}>
          <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: 10, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.25s" }} />
        </button>
      ) : tappable ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : null}
    </div>
  );
}

// ── Shared sub-component: quantity/expiry/shared fields ──
function NewItemFields({ newItem, setNewItem }) {
  const EXP_UNITS = ["day", "week", "month", "year"];
  const EXP_PRESETS = [
    { value: 3, unit: "day", label: "3 days" },
    { value: 3, unit: "week", label: "3 weeks" },
    { value: 3, unit: "month", label: "3 months" },
  ];
  const scrollRef = React.useRef(null);

  // Drum-scroll unit picker
  const scrollToUnit = (unit) => {
    setNewItem(p => ({ ...p, expUnit: unit }));
  };

  return (
    <>
      {/* Quantity / Serving — pick ONE */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMid, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
          How is this measured?
        </div>
        {/* Toggle: Count vs Serving */}
        <div style={{ display: "flex", background: theme.surfaceAlt, borderRadius: 16, padding: 4, marginBottom: 14, border: `1px solid ${theme.border}` }}>
          {[{ val: "count", label: "📦 By Count", sub: "pieces, bottles, bags…" }, { val: "serving", label: "🥄 By Serving", sub: "% remaining of item" }].map(o => (
            <button key={o.val} onClick={() => setNewItem(p => ({ ...p, unit: o.val }))}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 13, background: newItem.unit === o.val ? "#fff" : "transparent", border: "none", boxShadow: newItem.unit === o.val ? "0 2px 10px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: newItem.unit === o.val ? theme.primary : theme.textMid }}>{o.label}</div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{o.sub}</div>
            </button>
          ))}
        </div>

        {/* Count stepper */}
        {newItem.unit === "count" && (
          <div className="fade-in" style={{ background: theme.surface, borderRadius: 16, padding: "16px 20px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 0 }}>
            <button onClick={() => setNewItem(p => ({ ...p, qty: Math.max(1, p.qty - 1) }))}
              style={{ width: 44, height: 44, borderRadius: 14, background: theme.dangerPale, border: `1.5px solid #FBBCB4`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={theme.danger} strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: theme.primary, lineHeight: 1 }}>{newItem.qty}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>pieces / units</div>
            </div>
            <button onClick={() => setNewItem(p => ({ ...p, qty: p.qty + 1 }))}
              style={{ width: 44, height: 44, borderRadius: 14, background: theme.primaryPale, border: `1.5px solid #A8D4BC`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {/* Serving — just an indicator (100% = full, untouched) */}
        {newItem.unit === "serving" && (
          <div className="fade-in" style={{ background: theme.surface, borderRadius: 16, padding: "16px 20px", border: `1px solid ${theme.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: theme.textMid, marginBottom: 8 }}>Starting at full serving</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: theme.primary, marginBottom: 4 }}>100%</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>You'll adjust remaining % when you consume</div>
          </div>
        )}
      </div>

      {/* Expiration */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMid, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Expiration Date</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {EXP_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => setNewItem(p => ({ ...p, expType: "window", expNumber: preset.value, expUnit: preset.unit }))}
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: Number(newItem.expNumber) === preset.value && newItem.expUnit === preset.unit && newItem.expType === "window" ? theme.primaryPale : theme.surface,
                color: Number(newItem.expNumber) === preset.value && newItem.expUnit === preset.unit && newItem.expType === "window" ? theme.primary : theme.textMid,
                fontSize: 12,
                fontWeight: 700,
                transition: "all 0.2s"
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", background: theme.surfaceAlt, borderRadius: 16, padding: 4, marginBottom: 14, border: `1px solid ${theme.border}` }}>
          {[{ val: "window", label: "⏱ Time Window" }, { val: "exact", label: "📅 Exact Date" }].map(t => (
            <button key={t.val} onClick={() => setNewItem(p => ({ ...p, expType: t.val }))}
              style={{ flex: 1, padding: "11px 8px", borderRadius: 13, background: newItem.expType === t.val ? "#fff" : "transparent", border: "none", boxShadow: newItem.expType === t.val ? "0 2px 10px rgba(0,0,0,0.08)" : "none", fontSize: 13, fontWeight: 700, color: newItem.expType === t.val ? theme.primary : theme.textMid, transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {newItem.expType === "window" ? (
          /* Time window: number input + scrollable unit drum */
          <div style={{ background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "stretch", height: 80 }}>
              {/* Number input */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRight: `1px solid ${theme.border}`, padding: "0 12px" }}>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={newItem.expNumber}
                  onChange={e => setNewItem(p => ({ ...p, expNumber: e.target.value }))}
                  style={{ width: "100%", fontSize: 36, fontWeight: 900, color: theme.primary, textAlign: "center", background: "transparent" }}
                />
              </div>
              {/* Scrollable unit drum */}
              <div style={{ width: 110, position: "relative", overflow: "hidden" }}>
                {/* Highlight band */}
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, height: 36, background: theme.primaryPale, borderTop: `1px solid #C8E0D0`, borderBottom: `1px solid #C8E0D0`, pointerEvents: "none", zIndex: 1 }} />
                <div style={{ overflowY: "auto", height: "100%", scrollSnapType: "y mandatory", paddingTop: 22, paddingBottom: 22 }}
                  ref={scrollRef}>
                  {EXP_UNITS.map(u => (
                    <div key={u} onClick={() => scrollToUnit(u)}
                      style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center", scrollSnapAlign: "center", cursor: "pointer", position: "relative", zIndex: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: newItem.expUnit === u ? 800 : 500, color: newItem.expUnit === u ? theme.primary : theme.textMuted, transition: "all 0.15s" }}>
                        {u}{Number(newItem.expNumber) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Preview label */}
            <div style={{ padding: "10px 16px", background: theme.primaryPale, borderTop: `1px solid #C8E0D0` }}>
              <span style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>
                Expires in {newItem.expNumber || "?"} {newItem.expUnit}{Number(newItem.expNumber) !== 1 ? "s" : ""} from today
              </span>
            </div>
          </div>
        ) : (
          /* Exact date */
          <div style={{ background: theme.surface, borderRadius: 16, padding: "16px 18px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📅</span>
            <input
              type="text"
              value={newItem.expDate}
              onChange={e => setNewItem(p => ({ ...p, expDate: e.target.value }))}
              placeholder="MM / DD / YYYY"
              style={{ flex: 1, fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: 1, background: "transparent" }}
            />
          </div>
        )}
      </div>

      {/* Shared */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMid, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Who can eat this?</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ val: false, label: "🔒 Only Me", sub: "Private" }, { val: true, label: "👥 Everyone", sub: "Household" }].map(o => (
            <button key={String(o.val)} onClick={() => setNewItem(p => ({ ...p, shared: o.val }))}
              style={{ flex: 1, padding: "14px 10px", borderRadius: 16, border: `2px solid ${newItem.shared === o.val ? (o.val ? theme.primary : theme.textMid) : theme.border}`, background: newItem.shared === o.val ? (o.val ? theme.primaryPale : theme.surfaceAlt) : theme.surface, transition: "all 0.2s" }}>
              <div style={{ fontSize: 16, marginBottom: 3 }}>{o.label.split(" ")[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: newItem.shared === o.val ? (o.val ? theme.primary : theme.text) : theme.textMuted }}>{o.label.split(" ").slice(1).join(" ")}</div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{o.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function FridgitApp() {
  const [screen, setScreen] = useState(SCREENS.ONBOARDING_WELCOME);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [consumeQty, setConsumeQty] = useState(1);
  const [consumeServing, setConsumeServing] = useState(100);
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [newItem, setNewItem] = useState({ name: "", qty: 1, unit: "count", expType: "window", expNumber: "3", expUnit: "day", expDate: "", shared: false, scanning: false, manualMode: false });
  const [scanDone, setScanDone] = useState(false);
  const [greeting] = useState(greetings[Math.floor(Math.random() * greetings.length)]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [consumeSearch, setConsumeSearch] = useState("");
  const [consumeItemSelected, setConsumeItemSelected] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifExpiry, setNotifExpiry] = useState(true);
  const [notifRecommend, setNotifRecommend] = useState(true);
  const [notifShared, setNotifShared] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [householdName, setHouseholdName] = useState("Home Fridge");
  const [recipeSlots, setRecipeSlots] = useState([null, null, null]);
  const [recipePickerIdx, setRecipePickerIdx] = useState(null);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeResult, setRecipeResult] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  const attentionItems = items.filter(i => i.expDays <= 3);
  const categories = ["All", "Leftovers", "Meat/Poultry", "Vegetables", "Fruits", "Seafood", "Dairy", "Condiments"];
  const filteredItems = items.filter(i => {
    const matchCat = activeTab === "All" || i.category === activeTab;
    const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const phone = {
    width: 390,
    height: 844,
    borderRadius: 52,
  };

  const startScan = () => {
    setNewItem(p => ({ ...p, scanning: true }));
    setTimeout(() => {
      setNewItem(p => ({ ...p, scanning: false, name: "Organic Whole Milk", calories: 150 }));
      setScanDone(true);
    }, 2000);
  };

  const goTo = (s) => { setMenuOpen(false); setScreen(s); };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E8F3ED 0%, #F7F9F4 50%, #E8F3ED 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0px; }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .scan-line { animation: scan 1.2s linear infinite; }
        @keyframes scan { from { top: 20%; } to { top: 80%; } }
        .menu-slide { animation: menuSlide 0.3s cubic-bezier(0.34,1.2,0.64,1); }
        @keyframes menuSlide { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        input, textarea { outline: none; border: none; background: transparent; font-family: inherit; }
        button { cursor: pointer; border: none; background: transparent; font-family: inherit; }
      `}</style>

      <div style={{ position: "relative", width: phone.width, height: phone.height, borderRadius: phone.borderRadius, background: theme.bg, overflow: "hidden", boxShadow: "0 40px 120px rgba(61,122,90,0.25), 0 8px 32px rgba(0,0,0,0.12)", border: "10px solid #1A2A1E" }}>

        {/* Status Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px 6px", background: screen === SCREENS.HOME ? "transparent" : theme.surface, position: "relative", zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: screen === SCREENS.HOME ? theme.text : theme.text }}>9:41</span>
          <div style={{ width: 120, height: 28, background: "#1A2A1E", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 8 }} />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ width: 3, height: 4 + i * 2, background: theme.text, borderRadius: 2, opacity: i < 3 ? 1 : 0.3 }} />)}
            <div style={{ width: 16, height: 8, border: `1.5px solid ${theme.text}`, borderRadius: 2, marginLeft: 4, position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 4, background: theme.text, borderRadius: 1 }} />
              <div style={{ width: "70%", height: "100%", background: theme.primary, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* SCREENS */}

        {/* ONBOARDING WELCOME */}
        {screen === SCREENS.ONBOARDING_WELCOME && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 36px", background: `linear-gradient(180deg, ${theme.primaryPale} 0%, ${theme.bg} 100%)` }}>
            <div style={{ width: 90, height: 90, borderRadius: 28, background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: "0 12px 36px rgba(61,122,90,0.35)" }}>
              <span style={{ fontSize: 44 }}>🧊</span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: theme.text, lineHeight: 1.1, textAlign: "center", marginBottom: 12 }}>FRIDGIT</div>
            <div style={{ fontSize: 15, color: theme.textMid, textAlign: "center", lineHeight: 1.6, marginBottom: 60 }}>Smart fridge inventory.<br />Less waste. More meals.</div>
            <button onClick={() => setScreen(SCREENS.ONBOARDING_SIGNUP)} style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 14, boxShadow: "0 8px 24px rgba(61,122,90,0.35)" }}>Get Started</button>
            <button onClick={() => { setUserName("Alex"); setScreen(SCREENS.HOME); }} style={{ fontSize: 14, color: theme.textMid, fontWeight: 500 }}>I already have an account</button>
          </div>
        )}

        {/* ONBOARDING SIGNUP */}
        {screen === SCREENS.ONBOARDING_SIGNUP && (
          <div className="slide-up" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", padding: "32px 32px", overflowY: "auto" }}>
            <button onClick={() => setScreen(SCREENS.ONBOARDING_WELCOME)} style={{ alignSelf: "flex-start", marginBottom: 32 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: theme.text, marginBottom: 8 }}>Create account</div>
            <div style={{ fontSize: 14, color: theme.textMid, marginBottom: 36 }}>Sign up to start tracking your fridge.</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Email address</div>
              <div style={{ background: theme.surface, borderRadius: 16, padding: "16px 20px", border: `1.5px solid ${theme.border}` }}>
                <input value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", fontSize: 15, color: theme.text }} />
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Password</div>
              <div style={{ background: theme.surface, borderRadius: 16, padding: "16px 20px", border: `1.5px solid ${theme.border}` }}>
                <input type="password" placeholder="••••••••" style={{ width: "100%", fontSize: 15, color: theme.text }} />
              </div>
            </div>
            <button onClick={() => { setEmail(inputEmail); setScreen(SCREENS.ONBOARDING_NAME); }} style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, boxShadow: "0 8px 24px rgba(61,122,90,0.3)", marginBottom: 16 }}>Continue</button>
            <div style={{ textAlign: "center", fontSize: 13, color: theme.textMuted }}>By signing up you agree to our Terms & Privacy Policy</div>
          </div>
        )}

        {/* ONBOARDING NAME */}
        {screen === SCREENS.ONBOARDING_NAME && (
          <div className="slide-up" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", padding: "32px 32px" }}>
            <button onClick={() => setScreen(SCREENS.ONBOARDING_SIGNUP)} style={{ alignSelf: "flex-start", marginBottom: 32 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: theme.text, marginBottom: 8 }}>What's your name?</div>
            <div style={{ fontSize: 14, color: theme.textMid, marginBottom: 36 }}>We'll use this to personalize your experience.</div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>First name</div>
              <div style={{ background: theme.surface, borderRadius: 16, padding: "16px 20px", border: `1.5px solid ${theme.border}` }}>
                <input value={inputName} onChange={e => setInputName(e.target.value)} placeholder="e.g. Alex" style={{ width: "100%", fontSize: 15, color: theme.text }} />
              </div>
            </div>
            <button onClick={() => { setUserName(inputName || "Alex"); setScreen(SCREENS.ONBOARDING_NOTIFICATIONS); }} style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, boxShadow: "0 8px 24px rgba(61,122,90,0.3)" }}>Continue</button>
          </div>
        )}

        {/* ONBOARDING NOTIFICATIONS */}
        {screen === SCREENS.ONBOARDING_NOTIFICATIONS && (
          <div className="slide-up" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: theme.accentPale, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
              <span style={{ fontSize: 38 }}>🔔</span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: theme.text, textAlign: "center", marginBottom: 12 }}>Stay in the loop</div>
            <div style={{ fontSize: 14, color: theme.textMid, textAlign: "center", lineHeight: 1.7, marginBottom: 48 }}>Get notified about expiring items and meal recommendations before food goes to waste.</div>
            <button onClick={() => setScreen(SCREENS.HOME)} style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 14, boxShadow: "0 8px 24px rgba(61,122,90,0.3)" }}>Enable Notifications</button>
            <button onClick={() => setScreen(SCREENS.HOME)} style={{ fontSize: 14, color: theme.textMid, fontWeight: 500 }}>Not now</button>
          </div>
        )}

        {/* HOME */}
        {screen === SCREENS.HOME && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", background: "#F5F8F5", position: "relative" }}>

            {/* TOP NAVBAR */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 22px 10px", background: "#fff", borderBottom: `1px solid ${theme.border}` }}>
              {/* Profile — left */}
              <button onClick={() => setScreen(SCREENS.SETTINGS)} style={{ width: 38, height: 38, borderRadius: 19, overflow: "hidden", border: `2px solid ${theme.primaryPale}`, background: "#C8D8C0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#5FA37D"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#5FA37D"/></svg>
              </button>
              {/* Title — center */}
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: theme.primary, letterSpacing: 1 }}>FRIDGIT</div>
              {/* Hamburger — right */}
              <button onClick={() => setMenuOpen(true)} style={{ width: 38, height: 38, borderRadius: 12, background: theme.surfaceAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
                <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
                <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 100px" }}>

              {/* GREETING */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: theme.text, lineHeight: 1.2, marginBottom: 5 }}>
                  {getGreeting()}, {userName || "Alex"}
                </div>
                <div style={{ fontSize: 14, color: theme.textMid }}>{greeting}</div>
              </div>

              {/* SEARCH BAR */}
              <div style={{ background: "#EAF4ED", borderRadius: 16, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 26, border: `1px solid #C8E0D0` }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#6BA882" strokeWidth="2.2"/><path d="m21 21-4.35-4.35" stroke="#6BA882" strokeWidth="2.2" strokeLinecap="round"/></svg>
                <input placeholder="Search your fridge..." style={{ flex: 1, fontSize: 14, color: theme.text, background: "transparent" }} />
              </div>

              {/* NEEDS ATTENTION */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Needs Attention</div>
                <button onClick={() => setScreen(SCREENS.VIEW_FRIDGE)} style={{ fontSize: 13, fontWeight: 700, color: theme.primary }}>View All</button>
              </div>

              {/* FOOD CARDS GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { id: 1,  name: "Chicken Breast", sub: "3 pcs • Mine",    expLabel: "Expires Today",     expBg: "#E8604C", bg: "linear-gradient(160deg,#FFE0B2 0%,#FFF3E0 100%)", img: "🍗" },
                  { id: 4,  name: "Fresh Salmon",   sub: "2 Fillets • Mine", expLabel: "Expires Today",    expBg: "#E8604C", bg: "linear-gradient(160deg,#BBDEFB 0%,#E3F2FD 100%)", img: "🐟" },
                  { id: 11, name: "Pizza",           sub: "3 slices • Shared",expLabel: "Expires Tomorrow", expBg: "#E8604C", bg: "linear-gradient(160deg,#FFF8E1 0%,#FFFDE7 100%)", img: "🍕" },
                  { id: 12, name: "Chipotle Bowl",   sub: "80% left • Alex",  expLabel: "Expires Today",   expBg: "#E8604C", bg: "linear-gradient(160deg,#FFE0B2 0%,#FFF8E1 100%)", img: "🌯" },
                ].map((card, idx) => {
                  return (
                    <button key={card.id} onClick={() => { const si = items.find(i => i.id === card.id) || items[0]; setSelectedItem(si); setConsumeQty(1); setConsumeServing(si.qty); setScreen(SCREENS.ITEM_DETAIL); }}
                      style={{ background: "#fff", borderRadius: 20, textAlign: "left", border: "none", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", width: "100%", paddingBottom: "78%", background: card.bg, overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: card.expBg, borderRadius: 8, padding: "4px 9px" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{card.expLabel}</span>
                        </div>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
                          {card.img}
                        </div>
                      </div>
                      <div style={{ padding: "11px 13px 13px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 3 }}>{card.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>{card.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FLOATING ACTION BUTTONS */}
            {/* Plus button — left side */}
            <button
              onClick={() => goTo(SCREENS.NEW_ITEM)}
              style={{ position: "absolute", left: -22, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: theme.primary, color: "#fff", fontSize: 26, fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(61,122,90,0.45)", zIndex: 50, border: "3px solid #fff" }}>
              +
            </button>
            {/* Minus button — right side */}
            <button
              onClick={() => { setConsumeItemSelected(false); setConsumeSearch(""); goTo(SCREENS.CONSUME); }}
              style={{ position: "absolute", right: -22, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: theme.accent, color: "#fff", fontSize: 26, fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(244,162,74,0.45)", zIndex: 50, border: "3px solid #fff" }}>
              −
            </button>
          </div>
        )}

        {/* VIEW FRIDGE */}
        {screen === SCREENS.VIEW_FRIDGE && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column" }}>
            {/* TOP NAVBAR */}
            <div style={{ padding: "10px 22px 12px", background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                {/* Profile — left */}
                <button onClick={() => setScreen(SCREENS.SETTINGS)} style={{ width: 38, height: 38, borderRadius: 19, overflow: "hidden", border: `2px solid ${theme.primaryPale}`, background: "#C8D8C0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#5FA37D"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#5FA37D"/></svg>
                </button>
                {/* Title — center */}
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>My Fridge</div>
                {/* Hamburger — right */}
                <button onClick={() => setMenuOpen(true)} style={{ width: 38, height: 38, borderRadius: 12, background: theme.surfaceAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
                  <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
                  <div style={{ width: 18, height: 2, background: theme.text, borderRadius: 2 }} />
                </button>
              </div>

              {/* Search bar */}
              <div style={{ background: "#EAF4ED", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, border: `1px solid #C8E0D0` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#6BA882" strokeWidth="2.2"/><path d="m21 21-4.35-4.35" stroke="#6BA882" strokeWidth="2.2" strokeLinecap="round"/></svg>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search items..." style={{ flex: 1, fontSize: 14, color: theme.text, background: "transparent" }} />
              </div>

              {/* Category tabs */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22 }} className="hide-scroll">
                {[
                  { label: "All",          emoji: "🧊" },
                  { label: "Leftovers",    emoji: "🍕" },
                  { label: "Meat/Poultry", emoji: "🍗" },
                  { label: "Vegetables",   emoji: "🥦" },
                  { label: "Fruits",       emoji: "🍓" },
                  { label: "Seafood",      emoji: "🐟" },
                  { label: "Dairy",        emoji: "🥛" },
                  { label: "Condiments",   emoji: "🫙" },
                ].map(cat => (
                  <button key={cat.label} onClick={() => setActiveTab(cat.label)}
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 20, background: activeTab === cat.label ? theme.primary : theme.surfaceAlt, color: activeTab === cat.label ? "#fff" : theme.textMid, fontSize: 12, fontWeight: 600, transition: "all 0.2s", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ITEM GRID — with inline filter bar above it */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 24px" }}>

              {/* Filter row — sits right above the grid */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </div>
                <button onClick={() => setFilterOpen(!filterOpen)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: filterOpen ? theme.primary : theme.surfaceAlt, border: `1px solid ${filterOpen ? theme.primary : theme.border}`, transition: "all 0.2s" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M6 12h12M9 18h6" stroke={filterOpen ? "#fff" : theme.textMid} strokeWidth="2.2" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: filterOpen ? "#fff" : theme.textMid }}>Filter</span>
                </button>
              </div>

              {/* Filter panel — expands inline */}
              {filterOpen && (
                <div className="slide-up" style={{ background: theme.surface, borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Filter by</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Expiry Date", "Owner", "Location", "Category"].map(f => (
                      <button key={f} style={{ padding: "6px 12px", borderRadius: 10, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, fontSize: 12, color: theme.textMid, fontWeight: 600 }}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Item grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {filteredItems.map(item => {
                  const exp = getExpColor(item.expDays);
                  return (
                    <button key={item.id} onClick={() => { setSelectedItem(item); setConsumeQty(item.qty); setConsumeServing(item.qty); setScreen(SCREENS.ITEM_DETAIL); }} style={{ background: theme.surface, borderRadius: 20, padding: "14px", textAlign: "left", border: `1px solid ${theme.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 10 }}>{item.emoji}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4 }}>👤 {item.owner}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>{item.unit === "serving" ? `${item.qty}% remaining` : `${item.qty} ${item.qty === 1 ? "pc" : "pcs"}`}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: exp.bg, borderRadius: 8, padding: "4px 8px" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: exp.text }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: exp.text }}>{exp.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ITEM DETAIL */}
        {screen === SCREENS.ITEM_DETAIL && selectedItem && (
          <div className="slide-up" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setScreen(SCREENS.VIEW_FRIDGE)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textMid }}>Item Details</div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ width: "100%", height: 200, background: selectedItem.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>{selectedItem.emoji}</div>
            <div style={{ padding: "24px" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: theme.text, marginBottom: 4 }}>{selectedItem.name}</div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>{selectedItem.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Owner", val: selectedItem.owner },
                  { label: "Location", val: selectedItem.location },
                  { label: "Expires", val: selectedItem.expiresOn },
                  { label: "Shared", val: selectedItem.shared ? "Household" : "Private" },
                ].map(d => (
                  <div key={d.label} style={{ background: theme.surfaceAlt, borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500, marginBottom: 3 }}>{d.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{d.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: theme.surfaceAlt, borderRadius: 18, padding: "16px", marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Nutritional Info (per serving)</div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  {[{ label: "Calories", val: selectedItem.calories }, { label: "Protein", val: selectedItem.protein }, { label: "Carbs", val: selectedItem.carbs }, { label: "Fat", val: selectedItem.fat }].map(n => (
                    <div key={n.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: theme.primary }}>{n.val}</div>
                      <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 500 }}>{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => { setScreen(SCREENS.CONSUME); }} style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, boxShadow: "0 8px 24px rgba(61,122,90,0.3)" }}>Consume This Item</button>
            </div>
          </div>
        )}

        {/* NEW ITEM */}
        {screen === SCREENS.NEW_ITEM && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "16px 24px 12px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <button onClick={() => { setScreen(SCREENS.HOME); setScanDone(false); setNewItem(p => ({ ...p, scanning: false, manualMode: false, name: "" })); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>New Item</div>
              <div style={{ width: 24 }} />
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {/* ── SCAN PHASE (default) ── */}
              {!newItem.manualMode && !scanDone && (
                <div className="fade-in">
                  {/* Dark camera viewfinder */}
                  <div style={{ background: "#0A1A0F", position: "relative", overflow: "hidden", height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {/* Corner brackets */}
                    {[[0,0,"2px 0 0 2px"],[0,1,"2px 2px 0 0"],[1,0,"0 0 2px 2px"],[1,1,"0 2px 2px 0"]].map(([r,c,br], i) => (
                      <div key={i} style={{ position:"absolute", width:28, height:28, top:r===0?28:"auto", bottom:r===1?28:"auto", left:c===0?28:"auto", right:c===1?28:"auto", borderColor:"#3DFF7A", borderStyle:"solid", borderWidth: i===0?"2px 0 0 2px":i===1?"2px 2px 0 0":i===2?"0 0 2px 2px":"0 2px 2px 0", borderRadius:br, opacity:0.9 }} />
                    ))}

                    {newItem.scanning ? (
                      <>
                        {/* Animated scan line */}
                        <div className="scan-line" style={{ position:"absolute", left:28, right:28, height:2, background:"linear-gradient(90deg,transparent,#3DFF7A,transparent)", borderRadius:2 }} />
                        <div style={{ color:"#3DFF7A", fontSize:13, fontWeight:600, letterSpacing:1 }} className="pulse">SCANNING…</div>
                        <div style={{ position:"absolute", bottom:20, fontSize:12, color:"rgba(61,255,122,0.6)" }}>Hold steady over barcode</div>
                      </>
                    ) : (
                      <>
                        {/* Barcode icon */}
                        <div style={{ marginBottom:20, display:"flex", gap:3 }}>
                          {[3,6,3,8,3,5,3,7,3].map((h,i) => <div key={i} style={{ width:3, height:h*4, background:"rgba(61,255,122,0.35)", borderRadius:1 }} />)}
                        </div>
                        <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", marginBottom:24, textAlign:"center", lineHeight:1.5 }}>Point your camera at a barcode<br/>to auto-fill item details</div>
                        <button onClick={startScan} style={{ background:"#3D7A5A", border:"none", borderRadius:16, padding:"14px 32px", color:"#fff", fontSize:15, fontWeight:700, boxShadow:"0 6px 20px rgba(61,255,122,0.3)" }}>
                          📷 Scan Barcode
                        </button>
                      </>
                    )}
                  </div>

                  {/* Enter Manually button */}
                  <div style={{ padding:"20px 24px 0" }}>
                    <button onClick={() => setNewItem(p => ({ ...p, manualMode: true }))} style={{ width:"100%", padding:"15px", borderRadius:18, border:`1.5px dashed ${theme.border}`, background:"transparent", color:theme.textMid, fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={theme.textMid} strokeWidth="2" strokeLinecap="round"/></svg>
                      Enter Manually Instead
                    </button>
                  </div>
                </div>
              )}

              {/* ── POST-SCAN: item detected, show pre-populated card + remaining fields ── */}
              {!newItem.manualMode && scanDone && (
                <div className="slide-up" style={{ padding:"0 0 32px" }}>
                  {/* Auto-populated card */}
                  <div style={{ background:"linear-gradient(135deg,#E8F5E9,#F0F7F3)", padding:"24px", borderBottom:`1px solid ${theme.border}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                      <div style={{ width:72, height:72, borderRadius:22, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>🥛</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:theme.primary, borderRadius:8, padding:"3px 10px", marginBottom:6 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:"#fff" }}>✓ AUTO-FILLED</span>
                        </div>
                        <div style={{ fontSize:20, fontWeight:800, color:theme.text }}>Organic Whole Milk</div>
                        <div style={{ fontSize:12, color:theme.textMid }}>Dairy · Horizon Organic</div>
                      </div>
                    </div>
                    {/* Nutrition row */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                      {[{l:"Calories",v:"150"},{l:"Protein",v:"8g"},{l:"Carbs",v:"12g"},{l:"Fat",v:"8g"}].map(n => (
                        <div key={n.l} style={{ background:"rgba(255,255,255,0.7)", borderRadius:12, padding:"8px 6px", textAlign:"center" }}>
                          <div style={{ fontSize:15, fontWeight:800, color:theme.primary }}>{n.v}</div>
                          <div style={{ fontSize:10, color:theme.textMuted }}>{n.l}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setScanDone(false); setNewItem(p => ({ ...p, scanning:false })); }} style={{ marginTop:14, background:"none", border:"none", fontSize:12, color:theme.textMuted, fontWeight:500, textDecoration:"underline", cursor:"pointer" }}>
                      Not the right item? Rescan
                    </button>
                  </div>

                  {/* Remaining fields */}
                  <div style={{ padding:"22px 24px 0" }}>
                    <NewItemFields newItem={newItem} setNewItem={setNewItem} />
                    <button onClick={() => { setScanDone(false); setNewItem(p=>({...p, manualMode:false, name:"", scanning:false})); setScreen(SCREENS.HOME); }}
                      style={{ width:"100%", padding:"18px", background:theme.primary, borderRadius:20, color:"#fff", fontSize:16, fontWeight:700, boxShadow:"0 8px 24px rgba(61,122,90,0.3)", marginTop:8 }}>
                      Add to Fridge ✓
                    </button>
                  </div>
                </div>
              )}

              {/* ── MANUAL MODE ── */}
              {newItem.manualMode && (
                <div className="slide-up" style={{ padding:"22px 24px 32px" }}>
                  {/* Photo upload */}
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:theme.textMid, marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>Item Photo <span style={{ fontWeight:400, textTransform:"none", fontSize:11 }}>(optional)</span></div>
                    <button style={{ width:"100%", background:theme.surfaceAlt, borderRadius:18, padding:"28px 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, border:`1.5px dashed ${theme.border}` }}>
                      <span style={{ fontSize:28 }}>📷</span>
                      <span style={{ fontSize:13, color:theme.textMid, fontWeight:500 }}>Tap to take a photo</span>
                      <span style={{ fontSize:11, color:theme.textMuted }}>This will represent your item in the fridge</span>
                    </button>
                  </div>

                  {/* Name */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:theme.textMid, marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>Item Name</div>
                    <div style={{ background:theme.surface, borderRadius:14, padding:"14px 16px", border:`1px solid ${theme.border}` }}>
                      <input value={newItem.name} onChange={e => setNewItem(p=>({...p, name:e.target.value}))} placeholder="e.g. Chicken Breast" style={{ width:"100%", fontSize:15, color:theme.text }} />
                    </div>
                  </div>

                  <NewItemFields newItem={newItem} setNewItem={setNewItem} />

                  <button onClick={() => setScreen(SCREENS.HOME)} style={{ width:"100%", padding:"18px", background:theme.primary, borderRadius:20, color:"#fff", fontSize:16, fontWeight:700, boxShadow:"0 8px 24px rgba(61,122,90,0.3)", marginTop:8 }}>
                    Add to Fridge ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONSUME */}
        {screen === SCREENS.CONSUME && (
          <div className="slide-up" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", background: theme.bg }}>

            {/* ── PHASE 1: Item picker ── */}
            {!consumeItemSelected && (
              <>
                {/* Header */}
                <div style={{ padding: "16px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                  <button onClick={() => { setScreen(SCREENS.HOME); setConsumeSearch(""); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>What are you eating?</div>
                  <div style={{ width: 24 }} />
                </div>

                {/* Search bar */}
                <div style={{ padding: "14px 20px 10px", background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                  <div style={{ background: "#EAF4ED", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #C8E0D0" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#6BA882" strokeWidth="2.2"/><path d="m21 21-4.35-4.35" stroke="#6BA882" strokeWidth="2.2" strokeLinecap="round"/></svg>
                    <input
                      autoFocus
                      value={consumeSearch}
                      onChange={e => setConsumeSearch(e.target.value)}
                      placeholder="Search your items..."
                      style={{ flex: 1, fontSize: 14, color: theme.text, background: "transparent" }}
                    />
                    {consumeSearch.length > 0 && (
                      <button onClick={() => setConsumeSearch("")} style={{ background: theme.textMuted, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 8, paddingLeft: 2 }}>
                    Showing items you can eat — sorted by expiry
                  </div>
                </div>

                {/* Item list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 32px" }}>
                  {(() => {
                    const consumable = items
                      .filter(i => i.owner === "You" || i.owner === (userName || "Alex") || i.shared)
                      .filter(i => i.name.toLowerCase().includes(consumeSearch.toLowerCase()))
                      .sort((a, b) => a.expDays - b.expDays);

                    if (consumable.length === 0) return (
                      <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>No items found</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Try a different search term</div>
                      </div>
                    );

                    return consumable.map((item, idx) => {
                      const exp = getExpColor(item.expDays);
                      const isUrgent = item.expDays <= 1;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item);
                            setConsumeQty(1);
                            setConsumeServing(item.qty);
                            setConsumeItemSelected(true);
                          }}
                          style={{ width: "100%", background: theme.surface, borderRadius: 18, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, border: isUrgent ? `1.5px solid #FBBCB4` : `1px solid ${theme.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.05)", textAlign: "left", position: "relative", overflow: "hidden" }}>

                          {/* Urgency accent bar */}
                          {isUrgent && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: theme.danger, borderRadius: "18px 0 0 18px" }} />}

                          {/* Emoji */}
                          <div style={{ width: 52, height: 52, borderRadius: 16, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, marginLeft: isUrgent ? 6 : 0 }}>
                            {item.emoji}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 2 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 5 }}>
                              {item.unit === "count" ? `${item.qty} ${item.qty === 1 ? "pc" : "pcs"}` : `${item.qty}% remaining`}
                              {" · "}
                              <span style={{ color: item.shared ? theme.primary : theme.textMuted }}>{item.shared ? "Shared 👥" : "Mine 🔒"}</span>
                            </div>
                            {/* Expiry badge */}
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: exp.bg, borderRadius: 8, padding: "3px 8px" }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: exp.text, flexShrink: 0 }} />
                              <span style={{ fontSize: 10, fontWeight: 700, color: exp.text }}>{exp.label}</span>
                            </div>
                          </div>

                          {/* Chevron */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      );
                    });
                  })()}
                </div>
              </>
            )}

            {/* ── PHASE 2: Quantity / Serving adjustment ── */}
            {consumeItemSelected && selectedItem && (
              <>
                {/* Header */}
                <div style={{ padding: "16px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                  <button onClick={() => { setConsumeItemSelected(false); setConsumeSearch(""); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>Consume</div>
                  <div style={{ width: 24 }} />
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                  {/* Item card */}
                  <div style={{ background: selectedItem.color, borderRadius: 24, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: 68, height: 68, borderRadius: 20, background: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>{selectedItem.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: theme.text, marginBottom: 3 }}>{selectedItem.name}</div>
                      <div style={{ fontSize: 12, color: theme.textMid, marginBottom: 4 }}>{selectedItem.location} · {selectedItem.shared ? "Shared" : "Private"}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "3px 9px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: theme.primary }}>{selectedItem.calories} kcal/serving</span>
                      </div>
                    </div>
                  </div>

                  {/* COUNT-BASED: plus / minus stepper */}
                  {selectedItem.unit === "count" ? (
                    <div style={{ background: theme.surface, borderRadius: 24, padding: "26px 24px", border: `1px solid ${theme.border}`, marginBottom: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, textAlign: "center", marginBottom: 22, textTransform: "uppercase", letterSpacing: 0.8 }}>How many are you consuming?</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
                        <button
                          onClick={() => setConsumeQty(q => Math.max(0, q - 1))}
                          style={{ width: 56, height: 56, borderRadius: 18, background: consumeQty === 0 ? "#F0F4EC" : theme.dangerPale, border: `2px solid ${consumeQty === 0 ? theme.border : "#FBBCB4"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={consumeQty === 0 ? theme.textMuted : theme.danger} strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </button>
                        <div style={{ textAlign: "center", minWidth: 70 }}>
                          <div style={{ fontSize: 58, fontWeight: 900, color: theme.primary, lineHeight: 1 }}>{consumeQty}</div>
                          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>of {selectedItem.qty} available</div>
                        </div>
                        <button
                          onClick={() => setConsumeQty(q => Math.min(selectedItem.qty, q + 1))}
                          style={{ width: 56, height: 56, borderRadius: 18, background: consumeQty >= selectedItem.qty ? "#F0F4EC" : theme.primaryPale, border: `2px solid ${consumeQty >= selectedItem.qty ? theme.border : "#A8D4BC"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={consumeQty >= selectedItem.qty ? theme.textMuted : theme.primary} strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                      <div style={{ marginTop: 22, background: theme.surfaceAlt, borderRadius: 8, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${(consumeQty / selectedItem.qty) * 100}%`, height: "100%", background: consumeQty === selectedItem.qty ? theme.danger : theme.primary, borderRadius: 8, transition: "width 0.25s" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 10, color: theme.textMuted }}>0</span>
                        <span style={{ fontSize: 10, color: theme.textMuted }}>Max ({selectedItem.qty})</span>
                      </div>
                    </div>
                  ) : (
                    /* SERVING-BASED: 0–100% slider */
                    <div style={{ background: theme.surface, borderRadius: 24, padding: "26px 24px", border: `1px solid ${theme.border}`, marginBottom: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, textAlign: "center", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>How much is remaining?</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, textAlign: "center", marginBottom: 22 }}>Drag the slider to reflect what's left after eating</div>
                      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 22, gap: 2 }}>
                        <div style={{ fontSize: 64, fontWeight: 900, color: consumeServing <= 20 ? theme.danger : consumeServing <= 50 ? theme.accent : theme.primary, lineHeight: 1, transition: "color 0.3s" }}>{consumeServing}</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: theme.textMid, paddingBottom: 8 }}>%</div>
                      </div>
                      <div style={{ fontSize: 13, color: theme.textMid, textAlign: "center", marginBottom: 18 }}>
                        {consumeServing === 0 ? "All gone! 🎉" : consumeServing === 100 ? "Nothing consumed yet" : `${100 - consumeServing}% was consumed`}
                      </div>
                      <style>{`
                        .consume-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 8px; outline: none; cursor: pointer; background: linear-gradient(to right, #3D7A5A ${consumeServing}%, #E2EDE6 ${consumeServing}%); }
                        .consume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 3px solid #3D7A5A; box-shadow: 0 2px 8px rgba(61,122,90,0.35); cursor: grab; }
                        .consume-slider::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 3px solid #3D7A5A; box-shadow: 0 2px 8px rgba(61,122,90,0.35); cursor: grab; }
                      `}</style>
                      <input type="range" min={0} max={100} step={5} value={consumeServing} onChange={e => setConsumeServing(Number(e.target.value))} className="consume-slider" />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: theme.danger, fontWeight: 600 }}>Empty (0%)</span>
                        <span style={{ fontSize: 11, color: theme.primary, fontWeight: 600 }}>Full (100%)</span>
                      </div>
                    </div>
                  )}

                  {/* Calorie summary */}
                  <div style={{ background: theme.primaryPale, borderRadius: 18, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid #C8E0D0` }}>
                    <div>
                      <div style={{ fontSize: 12, color: theme.textMid, fontWeight: 500, marginBottom: 2 }}>Estimated calories consumed</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>Based on {selectedItem.calories} kcal/serving</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: theme.primary }}>
                      {selectedItem.unit === "count"
                        ? consumeQty * selectedItem.calories
                        : Math.round(((100 - consumeServing) / 100) * selectedItem.calories)
                      } <span style={{ fontSize: 13, fontWeight: 600 }}>kcal</span>
                    </div>
                  </div>

                  {/* Confirm button */}
                  <button
                    onClick={() => {
                      setConsumeItemSelected(false);
                      setConsumeSearch("");
                      setScreen(SCREENS.HOME);
                    }}
                    style={{ width: "100%", padding: "18px", background: theme.primary, borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 700, boxShadow: "0 8px 24px rgba(61,122,90,0.32)", letterSpacing: 0.3 }}>
                    Confirm Consumption ✓
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* RECIPE */}
        {screen === SCREENS.RECIPE && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", background: theme.bg }}>

            {/* Header */}
            <div style={{ padding: "16px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, background: theme.surface, flexShrink: 0 }}>
              <button onClick={() => { setRecipeResult(null); setRecipePickerIdx(null); setScreen(SCREENS.HOME); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>Recipe Ideas</div>
                <span style={{ background: "linear-gradient(135deg, #F4A24A, #E8604C)", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "3px 7px", letterSpacing: 0.5, textTransform: "uppercase" }}>PRO</span>
              </div>
              <div style={{ width: 24 }} />
            </div>

            {/* ── ITEM PICKER overlay ── */}
            {recipePickerIdx !== null && (
              <div className="slide-up" style={{ position: "absolute", inset: 0, zIndex: 50, background: theme.bg, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "16px 24px 12px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <button onClick={() => { setRecipePickerIdx(null); setRecipeSearch(""); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: theme.text }}>Pick an Ingredient</div>
                  <div style={{ width: 24 }} />
                </div>
                <div style={{ padding: "14px 20px 10px", background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                  <div style={{ background: "#EAF4ED", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #C8E0D0" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#6BA882" strokeWidth="2.2"/><path d="m21 21-4.35-4.35" stroke="#6BA882" strokeWidth="2.2" strokeLinecap="round"/></svg>
                    <input autoFocus value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} placeholder="Search fridge items…" style={{ flex: 1, fontSize: 14, color: theme.text, background: "transparent" }} />
                    {recipeSearch && <button onClick={() => setRecipeSearch("")} style={{ width: 18, height: 18, borderRadius: "50%", background: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </button>}
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 32px" }}>
                  {items
                    .filter(i => i.name.toLowerCase().includes(recipeSearch.toLowerCase()))
                    .map(item => {
                      const exp = getExpColor(item.expDays);
                      const alreadyPicked = recipeSlots.some(s => s && s.id === item.id);
                      return (
                        <button key={item.id} disabled={alreadyPicked}
                          onClick={() => {
                            const next = [...recipeSlots];
                            next[recipePickerIdx] = item;
                            setRecipeSlots(next);
                            setRecipePickerIdx(null);
                            setRecipeSearch("");
                            setRecipeResult(null);
                          }}
                          style={{ width: "100%", background: alreadyPicked ? theme.surfaceAlt : theme.surface, borderRadius: 18, padding: "13px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, border: `1px solid ${theme.border}`, textAlign: "left", opacity: alreadyPicked ? 0.45 : 1 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{item.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{item.category}</div>
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: exp.bg, borderRadius: 8, padding: "3px 8px", flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: exp.text }}>{exp.label}</span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ── Main recipe builder ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 32px" }}>
              <div style={{ fontSize: 13, color: theme.textMid, marginBottom: 18, lineHeight: 1.5 }}>
                Pick ingredients from your fridge and let AI craft a recipe for you. 🧑‍🍳
              </div>

              {/* Ingredient slots */}
              <div style={{ marginBottom: 10 }}>
                {recipeSlots.map((slot, idx) => (
                  <div key={idx} style={{ marginBottom: 10 }}>
                    {slot ? (
                      /* Filled slot */
                      <div className="slide-up" style={{ background: theme.surface, borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${theme.primaryPale}`, boxShadow: "0 2px 10px rgba(61,122,90,0.08)" }}>
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: slot.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{slot.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>{slot.name}</div>
                          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 1 }}>{slot.category}</div>
                        </div>
                        {/* Minus — remove slot item */}
                        <button onClick={() => { const next = [...recipeSlots]; next[idx] = null; setRecipeSlots(next); setRecipeResult(null); }}
                          style={{ width: 32, height: 32, borderRadius: 10, background: theme.dangerPale, border: `1.5px solid #FBBCB4`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={theme.danger} strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ) : (
                      /* Empty slot — plus button */
                      <button onClick={() => { setRecipePickerIdx(idx); setRecipeSearch(""); }}
                        style={{ width: "100%", background: theme.surface, borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1.5px dashed ${theme.border}`, boxShadow: "none" }}>
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: theme.primaryPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round"/></svg>
                        </div>
                        <span style={{ fontSize: 14, color: theme.textMid, fontWeight: 600 }}>Add ingredient {idx + 1}</span>
                      </button>
                    )}
                  </div>
                ))}

                {/* Add more */}
                <button onClick={() => setRecipeSlots(s => [...s, null])}
                  style={{ width: "100%", padding: "11px 16px", borderRadius: 14, background: "transparent", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={theme.textMuted} strokeWidth="2.2" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Add more ingredients</span>
                </button>
              </div>

              {/* Generate button */}
              <button
                disabled={recipeLoading || recipeSlots.filter(Boolean).length === 0}
                onClick={async () => {
                  const picked = recipeSlots.filter(Boolean);
                  if (!picked.length) return;
                  setRecipeLoading(true);
                  setRecipeResult(null);
                  try {
                    const ingredientList = picked.map(i => `${i.name} (${i.category})`).join(", ");
                    const resp = await fetch("https://api.anthropic.com/v1/messages", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: 1000,
                        messages: [{
                          role: "user",
                          content: `You are a creative home chef. Given these fridge ingredients: ${ingredientList}, generate ONE delicious recipe that uses them. Respond ONLY with a JSON object (no markdown, no backticks) with these exact fields: {"title": string, "emoji": string (single emoji), "time": string (e.g. "25 min"), "servings": string (e.g. "2 servings"), "calories": string (e.g. "420 kcal"), "description": string (1-2 sentences), "ingredients": [string] (full ingredient list with quantities), "steps": [string] (numbered cooking steps, 4-6 steps)}`
                        }]
                      })
                    });
                    const data = await resp.json();
                    const raw = data.content.map(b => b.text || "").join("");
                    const clean = raw.replace(/```json|```/g, "").trim();
                    setRecipeResult(JSON.parse(clean));
                  } catch (e) {
                    setRecipeResult({ error: true });
                  }
                  setRecipeLoading(false);
                }}
                style={{ width: "100%", padding: "18px", marginTop: 6, marginBottom: 24, background: recipeSlots.filter(Boolean).length === 0 ? "#C8D8C0" : "linear-gradient(135deg,#3D7A5A,#5FA37D)", borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 700, boxShadow: recipeSlots.filter(Boolean).length === 0 ? "none" : "0 8px 24px rgba(61,122,90,0.35)", letterSpacing: 0.3, border: "none", transition: "all 0.2s", cursor: recipeSlots.filter(Boolean).length === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {recipeLoading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)", borderTop: "2.5px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Generating Recipe…
                  </>
                ) : "✨ Generate Recipe"}
              </button>
              <style>{`.spin-anim { animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

              {/* Generated recipe result */}
              {recipeResult && !recipeResult.error && (
                <div className="slide-up" style={{ background: theme.surface, borderRadius: 24, overflow: "hidden", border: `1px solid ${theme.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  {/* Hero */}
                  <div style={{ background: "linear-gradient(135deg,#3D7A5A,#5FA37D)", padding: "22px 20px 18px" }}>
                    <div style={{ fontSize: 44, marginBottom: 10, textAlign: "center" }}>{recipeResult.emoji}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#fff", textAlign: "center", marginBottom: 6 }}>{recipeResult.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 1.5 }}>{recipeResult.description}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
                      {[{ icon: "⏱", val: recipeResult.time }, { icon: "🍽", val: recipeResult.servings }, { icon: "🔥", val: recipeResult.calories }].map(m => (
                        <div key={m.val} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 14 }}>{m.icon}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div style={{ padding: "18px 20px 0" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: theme.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Ingredients</div>
                    {recipeResult.ingredients?.map((ing, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.primary, marginTop: 6, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{ing}</div>
                      </div>
                    ))}
                  </div>

                  {/* Steps */}
                  <div style={{ padding: "16px 20px 22px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: theme.text, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Instructions</div>
                    {recipeResult.steps?.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
                        </div>
                        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.6, flex: 1 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recipeResult?.error && (
                <div style={{ background: theme.dangerPale, borderRadius: 16, padding: "16px 18px", textAlign: "center", border: `1px solid #FBBCB4` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>😕</div>
                  <div style={{ fontSize: 13, color: theme.danger, fontWeight: 600 }}>Couldn't generate a recipe right now. Please try again.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {screen === SCREENS.SETTINGS && (
          <div className="fade-in" style={{ height: "calc(100% - 54px)", display: "flex", flexDirection: "column", background: theme.bg }}>
            {/* Header */}
            <div style={{ padding: "16px 24px 14px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setScreen(SCREENS.HOME)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: theme.text }}>Settings</div>
              <div style={{ width: 24 }} />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 0 40px" }}>

              {/* Profile card */}
              <div style={{ background: theme.surface, margin: "16px 20px", borderRadius: 24, padding: "20px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: "linear-gradient(135deg,#5FA37D,#3D7A5A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#fff"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#fff"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: theme.text }}>{userName || "Alex"}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{email || "alex@email.com"}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, background: theme.primaryPale, borderRadius: 8, padding: "3px 10px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.primary }}>Free Plan</span>
                  </div>
                </div>
                <button style={{ background: theme.surfaceAlt, borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: theme.textMid, border: `1px solid ${theme.border}` }}>Edit</button>
              </div>

              {/* Upgrade banner */}
              <div style={{ margin: "0 20px 16px", background: "linear-gradient(135deg,#3D7A5A,#5FA37D)", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 32 }}>⭐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>Upgrade to Pro</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Unlock recipes, smart suggestions & more</div>
                </div>
                <button style={{ background: "#fff", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 800, color: theme.primary, flexShrink: 0, border: "none" }}>Upgrade</button>
              </div>

              {/* Section: Account */}
              <SettingsSection label="Account">
                <SettingsRow icon="👤" label="Display Name" value={userName || "Alex"} tappable />
                <SettingsRow icon="📧" label="Email" value={email || "alex@email.com"} tappable />
                <SettingsRow icon="🔑" label="Change Password" tappable />
                <SettingsRow icon="🏠" label="Household Name" value={householdName} tappable last />
              </SettingsSection>

              {/* Section: Notifications */}
              <SettingsSection label="Notifications">
                <SettingsRow icon="⏰" label="Expiry Reminders" toggle value={notifExpiry} onToggle={() => setNotifExpiry(v => !v)} />
                <SettingsRow icon="💡" label="Food Recommendations" toggle value={notifRecommend} onToggle={() => setNotifRecommend(v => !v)} />
                <SettingsRow icon="👥" label="Shared Item Alerts" toggle value={notifShared} onToggle={() => setNotifShared(v => !v)} last />
              </SettingsSection>

              {/* Section: Preferences */}
              <SettingsSection label="Preferences">
                <SettingsRow icon="🌙" label="Dark Mode" toggle value={darkMode} onToggle={() => setDarkMode(v => !v)} />
                <SettingsRow icon="🔔" label="Notification Sound" value="Default" tappable last />
              </SettingsSection>

              {/* Section: Household */}
              <SettingsSection label="Household">
                <SettingsRow icon="➕" label="Invite Member" tappable />
                <SettingsRow icon="👥" label="Manage Members" value="2 members" tappable last />
              </SettingsSection>

              {/* Section: App */}
              <SettingsSection label="App">
                <SettingsRow icon="🔒" label="Privacy Policy" tappable />
                <SettingsRow icon="📄" label="Terms of Service" tappable />
                <SettingsRow icon="⭐" label="Rate Fridgit" tappable />
                <SettingsRow icon="📣" label="Send Feedback" tappable last />
              </SettingsSection>

              {/* Sign out */}
              <div style={{ margin: "8px 20px 0" }}>
                <button onClick={() => setScreen(SCREENS.ONBOARDING_WELCOME)}
                  style={{ width: "100%", padding: "16px", background: theme.dangerPale, borderRadius: 18, border: `1px solid #FBBCB4`, fontSize: 14, fontWeight: 700, color: theme.danger }}>
                  Sign Out
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: theme.textMuted }}>FRIDGIT v1.0.0 · Made with 🥬</div>
            </div>
          </div>
        )}

        {/* HAMBURGER MENU OVERLAY */}
        {menuOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 100 }}>
            <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(26,42,30,0.5)", backdropFilter: "blur(4px)" }} />
            <div className="menu-slide" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 280, background: theme.surface, padding: "60px 0 40px", display: "flex", flexDirection: "column" }}>
              {/* Branding */}
              <div style={{ padding: "0 28px 24px", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: theme.primary, marginBottom: 2 }}>🧊 FRIDGIT</div>
                <div style={{ fontSize: 13, color: theme.textMid }}>{userName || "Alex"}'s Fridge</div>
              </div>
              {/* Nav items */}
              <div style={{ flex: 1, padding: "16px 14px", overflowY: "auto" }}>
                {[
                  { label: "Home",           icon: "🏠",  sc: SCREENS.HOME,        pro: false },
                  { label: "View My Fridge", icon: "🧊",  sc: SCREENS.VIEW_FRIDGE, pro: false },
                  { label: "New Item",       icon: "➕",  sc: SCREENS.NEW_ITEM,    pro: false },
                  { label: "Consume",        icon: "🍽️", sc: SCREENS.CONSUME,     pro: false },
                  { label: "Recipe",         icon: "👨‍🍳", sc: SCREENS.RECIPE,      pro: true  },
                ].map(m => (
                  <button key={m.label}
                    onClick={() => {
                      if (m.sc === SCREENS.CONSUME) { setConsumeItemSelected(false); setConsumeSearch(""); }
                      goTo(m.sc);
                    }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 16, background: screen === m.sc ? theme.primaryPale : "transparent", marginBottom: 3, border: "none", cursor: "pointer" }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{m.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: screen === m.sc ? theme.primary : theme.text }}>{m.label}</span>
                    {m.pro && (
                      <span style={{ marginLeft: "auto", background: "linear-gradient(135deg, #F4A24A, #E8604C)", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "3px 7px", letterSpacing: 0.5, textTransform: "uppercase" }}>PRO</span>
                    )}
                  </button>
                ))}
              </div>
              {/* Sign out */}
              <div style={{ padding: "18px 28px", borderTop: `1px solid ${theme.border}` }}>
                <button onClick={() => { setMenuOpen(false); setScreen(SCREENS.ONBOARDING_WELCOME); }} style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>Sign Out</button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav (home indicator) */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, background: theme.text, borderRadius: 10, opacity: 0.2 }} />
      </div>
    </div>
  );
}
