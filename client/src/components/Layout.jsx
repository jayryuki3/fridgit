import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Refrigerator, ShoppingCart, UtensilsCrossed, Settings, Menu } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/fridge', icon: Refrigerator, label: 'Fridge' },
  { path: '/shopping', icon: ShoppingCart, label: 'Shop' },
  { path: '/recipes', icon: UtensilsCrossed, label: 'Recipes' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

function applyDarkMode() {
  const dark = localStorage.getItem('fridgit_dark_mode') === 'true';
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    applyDarkMode();
    const handler = () => applyDarkMode();
    window.addEventListener('fridgit-theme-change', handler);
    return () => window.removeEventListener('fridgit-theme-change', handler);
  }, []);

  return (
    <div className="min-h-screen bg-fridgit-bg dark:bg-dracula-bg flex flex-col md:flex-row transition-colors">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-dracula-currentLine border-r border-fridgit-border dark:border-dracula-line transition-colors shrink-0 sticky top-0 h-screen overflow-y-auto pt-6 px-4">
        <div className="font-bold text-2xl text-fridgit-primary dark:text-dracula-green mb-8 px-2 flex items-center gap-2">
          <Refrigerator className="w-8 h-8" />
          Fridgit
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${
                  active
                    ? 'bg-fridgit-primary/10 dark:bg-dracula-selection text-fridgit-primary dark:text-dracula-green font-semibold'
                    : 'text-fridgit-textMuted dark:text-dracula-comment hover:bg-black/5 dark:hover:bg-dracula-selection/50 hover:text-fridgit-textMid dark:hover:text-dracula-fg'
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className="text-base font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-8 pt-4 md:pt-8 transition-all relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dracula-currentLine border-t border-fridgit-border dark:border-dracula-line transition-colors z-40">
        <div className="w-full flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  active
                    ? 'text-fridgit-primary dark:text-dracula-green'
                    : 'text-fridgit-textMuted dark:text-dracula-comment hover:text-fridgit-textMid dark:hover:text-dracula-fg'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}