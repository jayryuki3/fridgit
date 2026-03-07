import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import Layout from '../components/Layout.jsx';
import { Plus, AlertTriangle, ShoppingCart, UtensilsCrossed, Refrigerator } from 'lucide-react';
import api from '../services/api.js';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, expiring: 0, shopping: 0 });
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/items'),
      api.get('/items/expiring?days=3'),
      api.get('/shopping-list'),
    ]).then(([items, expiring, shopping]) => {
      setStats({
        total: items.data.length,
        expiring: expiring.data.length,
        shopping: shopping.data.filter(i => !i.purchased).length,
      });
      setExpiringItems(expiring.data.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="slide-up">
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-fridgit-text">{greeting()}, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-fridgit-textMuted text-sm mt-1">Here's what's in your kitchen</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => navigate('/fridge')} className="bg-white rounded-xl border border-fridgit-border p-3 text-center hover:shadow-md transition-shadow">
            <Refrigerator size={24} className="text-fridgit-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-fridgit-text">{loading ? '-' : stats.total}</div>
            <div className="text-xs text-fridgit-textMuted">Items</div>
          </button>
          <button onClick={() => navigate('/fridge')} className="bg-white rounded-xl border border-fridgit-border p-3 text-center hover:shadow-md transition-shadow">
            <AlertTriangle size={24} className="text-fridgit-accent mx-auto mb-1" />
            <div className="text-xl font-bold text-fridgit-text">{loading ? '-' : stats.expiring}</div>
            <div className="text-xs text-fridgit-textMuted">Expiring</div>
          </button>
          <button onClick={() => navigate('/shopping')} className="bg-white rounded-xl border border-fridgit-border p-3 text-center hover:shadow-md transition-shadow">
            <ShoppingCart size={24} className="text-fridgit-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-fridgit-text">{loading ? '-' : stats.shopping}</div>
            <div className="text-xs text-fridgit-textMuted">To Buy</div>
          </button>
        </div>

        {/* Add item button */}
        <button onClick={() => navigate('/new-item')}
          className="w-full mb-6 py-3 rounded-xl bg-fridgit-primary text-white font-semibold hover:bg-fridgit-primaryLight transition-colors flex items-center justify-center gap-2">
          <Plus size={20} /> Add Item
        </button>

        {/* Expiring soon */}
        {expiringItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-fridgit-textMid mb-2">Expiring Soon</h2>
            <div className="space-y-2">
              {expiringItems.map(item => {
                const days = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000*60*60*24));
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-fridgit-border p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji || '📦'}</span>
                      <div>
                        <div className="text-sm font-medium text-fridgit-text">{item.name}</div>
                        <div className="text-xs text-fridgit-textMuted">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${days <= 0 ? 'bg-fridgit-dangerPale text-fridgit-danger' : days <= 1 ? 'bg-fridgit-accentPale text-fridgit-accent' : 'bg-fridgit-primaryPale text-fridgit-primary'}`}>
                      {days <= 0 ? 'Expired' : days === 1 ? 'Tomorrow' : `${days} days`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/recipes')} className="bg-white rounded-xl border border-fridgit-border p-4 text-left hover:shadow-md transition-shadow">
            <UtensilsCrossed size={20} className="text-fridgit-accent mb-2" />
            <div className="text-sm font-medium text-fridgit-text">Find Recipes</div>
            <div className="text-xs text-fridgit-textMuted">From your ingredients</div>
          </button>
          <button onClick={() => navigate('/shopping')} className="bg-white rounded-xl border border-fridgit-border p-4 text-left hover:shadow-md transition-shadow">
            <ShoppingCart size={20} className="text-fridgit-primary mb-2" />
            <div className="text-sm font-medium text-fridgit-text">Shopping List</div>
            <div className="text-xs text-fridgit-textMuted">{stats.shopping} items to buy</div>
          </button>
        </div>
      </div>
    </Layout>
  );
}