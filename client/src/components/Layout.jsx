import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Refrigerator, ShoppingCart, UtensilsCrossed, Settings } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/fridge', icon: Refrigerator, label: 'Fridge' },
  { path: '/shopping', icon: ShoppingCart, label: 'Shop' },
  { path: '/recipes', icon: UtensilsCrossed, label: 'Recipes' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-fridgit-bg flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20 pt-4">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-fridgit-border">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  active ? 'text-fridgit-primary' : 'text-fridgit-textMuted hover:text-fridgit-textMid'
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
