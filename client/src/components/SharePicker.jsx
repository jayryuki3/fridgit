import { useState, useEffect } from 'react';
import { Users, Globe, Loader2 } from 'lucide-react';
import api from '../services/api.js';

const COLORS = [
  'bg-fridgit-primary', 'bg-fridgit-accent', 'bg-fridgit-danger',
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500',
];

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function SharePicker({ shared, sharedWith, currentUserId, onChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const otherUsers = users.filter(u => u.id !== currentUserId);

  const toggleShared = () => {
    if (!shared) {
      // Turning on "share with everyone" clears individual shares
      onChange({ shared: true, sharedWith: [] });
    } else {
      onChange({ shared: false, sharedWith: sharedWith });
    }
  };

  const toggleUser = (userId) => {
    const current = sharedWith || [];
    const next = current.includes(userId)
      ? current.filter(id => id !== userId)
      : [...current, userId];
    onChange({ shared, sharedWith: next });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader2 size={16} className="animate-spin text-fridgit-textMuted dark:text-dracula-comment" />
        <span className="text-sm text-fridgit-textMuted dark:text-dracula-comment">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Share with everyone toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-fridgit-textMid dark:text-dracula-comment" />
          <span className="text-sm font-medium text-fridgit-textMid dark:text-dracula-comment">Share with everyone</span>
        </div>
        <button type="button" onClick={toggleShared}
          className={`w-12 h-6 rounded-full transition-colors ${shared ? 'bg-fridgit-primary dark:bg-dracula-green' : 'bg-fridgit-border dark:bg-dracula-line'}`}>
          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${shared ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Individual user picker */}
      {otherUsers.length > 0 && (
        <div className={shared ? 'opacity-40 pointer-events-none' : ''}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-fridgit-textMuted dark:text-dracula-comment" />
            <span className="text-xs font-medium text-fridgit-textMuted dark:text-dracula-comment uppercase tracking-wide">
              Or share with specific people
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {otherUsers.map((u, i) => {
              const isSelected = (sharedWith || []).includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleUser(u.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-fridgit-primary dark:bg-dracula-green text-white dark:text-dracula-bg shadow-sm'
                      : 'bg-fridgit-surfaceAlt dark:bg-dracula-surface text-fridgit-textMid dark:text-dracula-fg border border-fridgit-border dark:border-dracula-line hover:border-fridgit-primary dark:hover:border-dracula-green'
                  }`}
                >
                  <div className={`w-6 h-6 ${isSelected ? 'bg-white/30' : COLORS[i % COLORS.length]} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {getInitials(u.name)}
                  </div>
                  {u.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {!shared && (sharedWith || []).length > 0 && (
        <p className="text-xs text-fridgit-textMuted dark:text-dracula-comment">
          Shared with {sharedWith.length} {sharedWith.length === 1 ? 'person' : 'people'}
        </p>
      )}
    </div>
  );
}
