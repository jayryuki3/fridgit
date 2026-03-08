import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Camera, X, Search, ArrowLeft, Loader2, Package } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.jsx';
import SharePicker from '../components/SharePicker.jsx';

const categoryOptions = [
  { key: 'dairy', emoji: '\u{1F95B}', label: 'Dairy' },
  { key: 'meat', emoji: '\u{1F357}', label: 'Meat' },
  { key: 'vegetables', emoji: '\u{1F96C}', label: 'Veggies' },
  { key: 'fruits', emoji: '\u{1F34E}', label: 'Fruits' },
  { key: 'beverages', emoji: '\u{1F964}', label: 'Drinks' },
  { key: 'condiments', emoji: '\u{1FAD9}', label: 'Sauces' },
  { key: 'grains', emoji: '\u{1F33E}', label: 'Grains' },
  { key: 'snacks', emoji: '\u{1F36A}', label: 'Snacks' },
  { key: 'other', emoji: '\u{1F4E6}', label: 'Other' },
];

const locationOptions = ['fridge', 'freezer', 'pantry', 'counter'];
const expiryNumberOptions = Array.from({ length: 30 }, (_, i) => i + 1);
const expiryUnitOptions = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];
const WHEEL_ROW_HEIGHT = 40;
const WHEEL_VISIBLE_ROWS = 5;
const WHEEL_SIDE_PADDING = Math.floor(WHEEL_VISIBLE_ROWS / 2);

function r1(val) {
  const n = parseFloat(val);
  if (!val || isNaN(n)) return '';
  return String(Math.round(n * 10) / 10);
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addToDate(value, unit) {
  const date = new Date();
  if (unit === 'days') date.setDate(date.getDate() + value);
  if (unit === 'weeks') date.setDate(date.getDate() + value * 7);
  if (unit === 'months') date.setMonth(date.getMonth() + value);
  if (unit === 'years') date.setFullYear(date.getFullYear() + value);
  return toDateInputValue(date);
}

export default function NewItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState('form');
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const scannerRef = useRef(null);
  const [form, setForm] = useState({
    name: '', barcode: '', category: 'other', quantity: 1, unit: 'count',
    location: 'fridge', expiry_date: '', calories: '', protein: '', carbs: '', fat: '',
    emoji: '\u{1F4E6}', color: '#F5F5F5', shared: false, image_url: '', shared_with: [],
  });
  const [expiryNumber, setExpiryNumber] = useState(3);
  const [expiryUnit, setExpiryUnit] = useState('days');
  const expiryNumberWheelRef = useRef(null);
  const expiryUnitWheelRef = useRef(null);
  const numberScrollTimeoutRef = useRef(null);
  const unitScrollTimeoutRef = useRef(null);

  const numberWheelOptions = useMemo(
    () => [
      ...Array.from({ length: WHEEL_SIDE_PADDING }, (_, i) => ({ key: `number-pad-top-${i}`, value: null, label: '' })),
      ...expiryNumberOptions.map((value) => ({ key: `number-${value}`, value, label: String(value) })),
      ...Array.from({ length: WHEEL_SIDE_PADDING }, (_, i) => ({ key: `number-pad-bottom-${i}`, value: null, label: '' })),
    ],
    []
  );
  const unitWheelOptions = useMemo(
    () => [
      ...Array.from({ length: WHEEL_SIDE_PADDING }, (_, i) => ({ key: `unit-pad-top-${i}`, value: null, label: '' })),
      ...expiryUnitOptions.map((option) => ({ key: `unit-${option.value}`, value: option.value, label: option.label })),
      ...Array.from({ length: WHEEL_SIDE_PADDING }, (_, i) => ({ key: `unit-pad-bottom-${i}`, value: null, label: '' })),
    ],
    []
  );

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    updateForm('expiry_date', addToDate(expiryNumber, expiryUnit));
  }, [expiryNumber, expiryUnit]);

  const snapWheel = (ref, index) => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: index * WHEEL_ROW_HEIGHT, behavior: 'smooth' });
  };

  const syncNumberFromScroll = () => {
    if (!expiryNumberWheelRef.current) return;
    const rawIndex = Math.round(expiryNumberWheelRef.current.scrollTop / WHEEL_ROW_HEIGHT);
    const clampedValue = expiryNumberOptions[Math.min(expiryNumberOptions.length - 1, Math.max(0, rawIndex - WHEEL_SIDE_PADDING))];
    if (clampedValue !== expiryNumber) setExpiryNumber(clampedValue);
  };

  const syncUnitFromScroll = () => {
    if (!expiryUnitWheelRef.current) return;
    const rawIndex = Math.round(expiryUnitWheelRef.current.scrollTop / WHEEL_ROW_HEIGHT);
    const optionIndex = Math.min(expiryUnitOptions.length - 1, Math.max(0, rawIndex - WHEEL_SIDE_PADDING));
    const clampedValue = expiryUnitOptions[optionIndex].value;
    if (clampedValue !== expiryUnit) setExpiryUnit(clampedValue);
  };

  const handleWheelScroll = (type) => {
    if (type === 'number') {
      syncNumberFromScroll();
      if (numberScrollTimeoutRef.current) clearTimeout(numberScrollTimeoutRef.current);
      numberScrollTimeoutRef.current = setTimeout(() => {
        if (!expiryNumberWheelRef.current) return;
        const rawIndex = Math.round(expiryNumberWheelRef.current.scrollTop / WHEEL_ROW_HEIGHT);
        const snappedIndex = Math.min(expiryNumberOptions.length - 1, Math.max(0, rawIndex - WHEEL_SIDE_PADDING)) + WHEEL_SIDE_PADDING;
        snapWheel(expiryNumberWheelRef, snappedIndex);
      }, 90);
      return;
    }

    syncUnitFromScroll();
    if (unitScrollTimeoutRef.current) clearTimeout(unitScrollTimeoutRef.current);
    unitScrollTimeoutRef.current = setTimeout(() => {
      if (!expiryUnitWheelRef.current) return;
      const rawIndex = Math.round(expiryUnitWheelRef.current.scrollTop / WHEEL_ROW_HEIGHT);
      const snappedIndex = Math.min(expiryUnitOptions.length - 1, Math.max(0, rawIndex - WHEEL_SIDE_PADDING)) + WHEEL_SIDE_PADDING;
      snapWheel(expiryUnitWheelRef, snappedIndex);
    }, 90);
  };

  useEffect(() => {
    snapWheel(expiryNumberWheelRef, expiryNumberOptions.indexOf(expiryNumber) + WHEEL_SIDE_PADDING);
  }, [expiryNumber]);

  useEffect(() => {
    snapWheel(expiryUnitWheelRef, expiryUnitOptions.findIndex((option) => option.value === expiryUnit) + WHEEL_SIDE_PADDING);
  }, [expiryUnit]);

  useEffect(() => () => {
    if (numberScrollTimeoutRef.current) clearTimeout(numberScrollTimeoutRef.current);
    if (unitScrollTimeoutRef.current) clearTimeout(unitScrollTimeoutRef.current);
  }, []);

  const startScan = async () => {
    setMode('scan');
    setScanning(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText) => {
          await scanner.stop();
          scannerRef.current = null;
          setScanning(false);
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      toast.error('Camera access denied or not available');
      setMode('form');
      setScanning(false);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
    setMode('form');
  };

  useEffect(() => { return () => { if (scannerRef.current) { scannerRef.current.stop().catch(() => {}); } }; }, []);

  const lookupBarcode = async (code) => {
    updateForm('barcode', code);
    setMode('form');
    try {
      const res = await api.get(`/barcode/${code}`);
      const p = res.data;
      setForm(prev => ({
        ...prev, name: p.name || prev.name, category: p.category || prev.category,
        calories: p.calories ? String(Math.round(Number(p.calories))) : '',
        protein: r1(p.protein), carbs: r1(p.carbs), fat: r1(p.fat),
        emoji: p.emoji || prev.emoji, color: p.color || prev.color, barcode: code,
        image_url: p.image_url || prev.image_url,
      }));
      toast.success(`Found: ${p.name}`);
    } catch {
      toast.error('Product not found. Enter details manually.');
    }
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.get(`/barcode/search/${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
    } catch { toast.error('Search failed'); }
    setSearching(false);
  };

  const selectProduct = (product) => {
    setForm(prev => ({
      ...prev, name: product.name, category: product.category,
      calories: product.calories ? String(Math.round(Number(product.calories))) : '',
      protein: r1(product.protein), carbs: r1(product.carbs), fat: r1(product.fat),
      emoji: product.emoji || prev.emoji, color: product.color || prev.color,
      barcode: product.barcode || prev.barcode,
      image_url: product.image_url || prev.image_url,
    }));
    setMode('form');
    setSearchResults([]);
    toast.success(`Selected: ${product.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await api.post('/items', {
        ...form,
        quantity: parseInt(form.quantity) || 1,
        calories: form.calories ? Math.round(Number(form.calories)) : null,
        protein: r1(form.protein) || null,
        carbs: r1(form.carbs) || null,
        fat: r1(form.fat) || null,
        expiry_date: form.expiry_date || null,
        image_url: form.image_url || null,
        shared_with: form.shared_with,
      });
      toast.success('Item added!');
      navigate('/fridge');
    } catch { toast.error('Failed to add item'); }
    setSaving(false);
  };

  if (mode === 'scan') {
    return (
      <Layout>
        <div className="slide-up">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-serif text-fridgit-text dark:text-dracula-fg">Scan Barcode</h1>
            <button onClick={stopScan} className="p-2 rounded-xl hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-surface transition-colors"><X size={20} /></button>
          </div>
          <div id="barcode-reader" className="rounded-xl overflow-hidden bg-black" style={{ minHeight: 300 }}></div>
          <p className="text-center text-sm text-fridgit-textMuted dark:text-dracula-comment mt-3">Point camera at a barcode</p>
        </div>
      </Layout>
    );
  }

  if (mode === 'search') {
    return (
      <Layout>
        <div className="slide-up">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setMode('form')} className="p-2 rounded-xl hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-surface transition-colors"><ArrowLeft size={20} /></button>
            <h1 className="text-xl font-serif text-fridgit-text dark:text-dracula-fg">Search Products</h1>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchProducts()}
              placeholder="Search by name..." className="flex-1 px-3 py-2.5 rounded-xl border border-fridgit-border dark:border-dracula-surface bg-white dark:bg-dracula-surface text-fridgit-text dark:text-dracula-fg focus:border-fridgit-primary dark:focus:border-dracula-green transition" />
            <button onClick={searchProducts} disabled={searching}
              className="px-4 py-2.5 rounded-xl bg-fridgit-primary dark:bg-dracula-green text-white dark:text-dracula-bg font-medium disabled:opacity-50">
              {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          <div className="space-y-2">
            {searchResults.map((p, i) => (
              <button key={i} onClick={() => selectProduct(p)}
                className="w-full bg-white dark:bg-dracula-surface rounded-xl border border-fridgit-border dark:border-dracula-line p-3 flex items-center gap-3 text-left hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-highlight transition-colors">
                {p.image_url ? <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <span className="text-2xl">{p.emoji || '\u{1F4E6}'}</span>}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fridgit-text dark:text-dracula-fg text-sm truncate">{p.name}</div>
                  <div className="text-xs text-fridgit-textMuted dark:text-dracula-comment">{p.category} {p.calories ? `- ${Math.round(Number(p.calories))} kcal` : ''}</div>
                </div>
              </button>
            ))}
            {searchResults.length === 0 && !searching && searchQuery && (
              <p className="text-center text-sm text-fridgit-textMuted dark:text-dracula-comment py-8">No results. Try different keywords.</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="slide-up">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-surface transition-colors"><ArrowLeft size={20} className="text-fridgit-text dark:text-dracula-fg" /></button>
          <h1 className="text-xl font-serif text-fridgit-text dark:text-dracula-fg">Add Item</h1>
        </div>

        {/* Scan / Search buttons */}
        <div className="flex gap-3 mb-4">
          <button onClick={startScan} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-fridgit-primary dark:border-dracula-green text-fridgit-primary dark:text-dracula-green font-medium hover:bg-fridgit-primaryPale dark:hover:bg-dracula-green/10 transition-colors">
            <Camera size={20} /> Scan Barcode
          </button>
          <button onClick={() => setMode('search')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-fridgit-accent dark:border-dracula-orange text-fridgit-accent dark:text-dracula-orange font-medium hover:bg-fridgit-accentPale dark:hover:bg-dracula-orange/10 transition-colors">
            <Search size={20} /> Search
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-dracula-surface rounded-xl border border-fridgit-border dark:border-dracula-line p-4 space-y-3">
            {/* Product image preview */}
            {form.image_url && (
              <div className="flex justify-center">
                <img src={form.image_url} alt={form.name} className="w-24 h-24 rounded-xl object-cover border border-fridgit-border dark:border-dracula-line" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-fridgit-textMid dark:text-dracula-comment mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} required
                className="w-full px-3 py-2.5 rounded-xl border border-fridgit-border dark:border-dracula-line bg-fridgit-bg dark:bg-dracula-bg text-fridgit-text dark:text-dracula-fg focus:border-fridgit-primary dark:focus:border-dracula-green transition" placeholder="e.g. Whole Milk" />
            </div>

            {/* Category chips */}
            <div>
              <label className="block text-sm font-medium text-fridgit-textMid dark:text-dracula-comment mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map(cat => (
                  <button type="button" key={cat.key} onClick={() => { updateForm('category', cat.key); updateForm('emoji', cat.emoji); }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.category === cat.key ? 'bg-fridgit-primary dark:bg-dracula-green text-white dark:text-dracula-bg' : 'bg-fridgit-surfaceAlt dark:bg-dracula-highlight text-fridgit-textMid dark:text-dracula-fg hover:bg-fridgit-primaryPale dark:hover:bg-dracula-green/20'
                    }`}>
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-fridgit-textMid dark:text-dracula-comment mb-1">Quantity</label>
                <div className="flex items-center rounded-xl border border-fridgit-border dark:border-dracula-line bg-fridgit-bg dark:bg-dracula-bg overflow-hidden shadow-sm">
                  <button type="button" onClick={() => updateForm('quantity', Math.max(1, Number(form.quantity || 1) - 1))}
                    className="w-11 h-11 flex items-center justify-center text-lg font-semibold text-fridgit-text dark:text-dracula-fg hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-highlight transition-colors">-</button>
                  <div className="flex-1 text-center font-semibold text-fridgit-text dark:text-dracula-fg">{form.quantity}</div>
                  <button type="button" onClick={() => updateForm('quantity', Number(form.quantity || 1) + 1)}
                    className="w-11 h-11 flex items-center justify-center text-lg font-semibold text-fridgit-text dark:text-dracula-fg hover:bg-fridgit-surfaceAlt dark:hover:bg-dracula-highlight transition-colors">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-fridgit-textMid dark:text-dracula-comment mb-1">Location</label>
                <div className="relative">
                  <select value={form.location} onChange={e => updateForm('location', e.target.value)}
                    className="w-full appearance-none px-3 py-3 rounded-xl border border-fridgit-border dark:border-dracula-line bg-fridgit-bg dark:bg-dracula-bg text-fridgit-text dark:text-dracula-fg capitalize shadow-sm focus:border-fridgit-primary dark:focus:border-dracula-green transition">
                    {locationOptions.map(loc => <option key={loc} value={loc} className="capitalize">{loc}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-fridgit-textMuted dark:text-dracula-comment">v</div>
                </div>
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-fridgit-textMid dark:text-dracula-comment mb-1">Expiry Date</label>
              <div className="rounded-2xl border border-fridgit-border dark:border-dracula-line bg-fridgit-bg dark:bg-dracula-bg p-3 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs font-medium text-fridgit-textMuted dark:text-dracula-comment mb-2">Number</div>
                    <div className="relative rounded-xl border border-fridgit-border dark:border-dracula-line bg-white/80 dark:bg-dracula-surface shadow-inner overflow-hidden">
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white dark:from-dracula-surface to-transparent" />
                      <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-10 -translate-y-1/2 rounded-lg border border-fridgit-primary/20 dark:border-dracula-green/25 bg-fridgit-primary/5 dark:bg-dracula-green/10" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white dark:from-dracula-surface to-transparent" />
                      <div
                        ref={expiryNumberWheelRef}
                        onScroll={() => handleWheelScroll('number')}
                        className="h-52 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-y"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        {numberWheelOptions.map((option, index) => {
                          const isSelected = option.value === expiryNumber;
                          return (
                            <div
                              key={option.key}
                              className={`flex h-10 snap-center items-center justify-center px-3 text-center select-none transition-all ${
                                option.value == null
                                  ? 'opacity-0'
                                  : isSelected
                                    ? 'text-2xl font-semibold text-fridgit-primary dark:text-dracula-green'
                                    : 'text-sm text-fridgit-textMuted dark:text-dracula-comment opacity-45'
                              }`}
                              onClick={() => {
                                if (option.value == null) return;
                                setExpiryNumber(option.value);
                                snapWheel(expiryNumberWheelRef, index);
                              }}
                            >
                              {option.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-fridgit-textMuted dark:text-dracula-comment mb-2">Unit</div>
                    <div className="relative rounded-xl border border-fridgit-border dark:border-dracula-line bg-white/80 dark:bg-dracula-surface shadow-inner overflow-hidden">
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white dark:from-dracula-surface to-transparent" />
                      <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-10 -translate-y-1/2 rounded-lg border border-fridgit-primary/20 dark:border-dracula-green/25 bg-fridgit-primary/5 dark:bg-dracula-green/10" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white dark:from-dracula-surface to-transparent" />
                      <div
                        ref={expiryUnitWheelRef}
                        onScroll={() => handleWheelScroll('unit')}
                        className="h-52 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-y"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        {unitWheelOptions.map((option, index) => {
                          const isSelected = option.value === expiryUnit;
                          return (
                            <div
                              key={option.key}
                              className={`flex h-10 snap-center items-center justify-center px-3 text-center select-none transition-all ${
                                option.value == null
                                  ? 'opacity-0'
                                  : isSelected
                                    ? 'text-lg font-semibold text-fridgit-primary dark:text-dracula-green'
                                    : 'text-sm text-fridgit-textMuted dark:text-dracula-comment opacity-45'
                              }`}
                              onClick={() => {
                                if (option.value == null) return;
                                setExpiryUnit(option.value);
                                snapWheel(expiryUnitWheelRef, index);
                              }}
                            >
                              {option.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-fridgit-border dark:border-dracula-line bg-white/80 dark:bg-dracula-surface p-3 overflow-hidden">
                  <div className="text-xs font-medium text-fridgit-textMuted dark:text-dracula-comment mb-2">Or pick an exact date</div>
                  <input type="date" value={form.expiry_date} onChange={e => updateForm('expiry_date', e.target.value)}
                    className="block w-full min-w-0 px-3 py-3 rounded-lg border border-fridgit-border dark:border-dracula-line bg-fridgit-bg dark:bg-dracula-bg text-fridgit-text dark:text-dracula-fg focus:border-fridgit-primary dark:focus:border-dracula-green transition shadow-sm" />
                </div>
              </div>
            </div>

            {/* Sharing */}
            <SharePicker
              shared={form.shared}
              sharedWith={form.shared_with}
              currentUserId={user?.id}
              onChange={({ shared, sharedWith }) => setForm(prev => ({ ...prev, shared, shared_with: sharedWith }))}
            />
          </div>

          {/* Nutrition info */}
          {(form.calories || form.protein || form.carbs || form.fat) && (
            <div className="bg-white dark:bg-dracula-surface rounded-xl border border-fridgit-border dark:border-dracula-line p-4">
              <h3 className="text-sm font-semibold text-fridgit-textMid dark:text-dracula-comment mb-2">Nutrition (per 100g)</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-fridgit-bg dark:bg-dracula-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-fridgit-text dark:text-dracula-fg">{form.calories ? Math.round(Number(form.calories)) : '-'}</div>
                  <div className="text-[10px] text-fridgit-textMuted dark:text-dracula-comment">kcal</div>
                </div>
                <div className="bg-fridgit-bg dark:bg-dracula-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-fridgit-text dark:text-dracula-fg">{r1(form.protein) || '-'}</div>
                  <div className="text-[10px] text-fridgit-textMuted dark:text-dracula-comment">Protein</div>
                </div>
                <div className="bg-fridgit-bg dark:bg-dracula-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-fridgit-text dark:text-dracula-fg">{r1(form.carbs) || '-'}</div>
                  <div className="text-[10px] text-fridgit-textMuted dark:text-dracula-comment">Carbs</div>
                </div>
                <div className="bg-fridgit-bg dark:bg-dracula-bg rounded-lg p-2">
                  <div className="text-sm font-bold text-fridgit-text dark:text-dracula-fg">{r1(form.fat) || '-'}</div>
                  <div className="text-[10px] text-fridgit-textMuted dark:text-dracula-comment">Fat</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-fridgit-primary dark:bg-dracula-green text-white dark:text-dracula-bg font-semibold hover:bg-fridgit-primaryLight dark:hover:bg-dracula-green/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Package size={20} />}
            Add to Fridge
          </button>
        </form>
      </div>
    </Layout>
  );
}
