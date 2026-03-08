import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Refrigerator, ShoppingCart, UtensilsCrossed, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-fridgit-bg dark:bg-dracula-bg flex flex-col transition-colors">
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20 pt-4">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dracula-currentLine border-t border-fridgit-border dark:border-dracula-line transition-colors">
        <div className="max-w-lg mx-auto flex justify-around py-2">
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
