import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  TrendingUp,
  DollarSign,
  UserPlus,
  MoreVertical,
  Shield,
  ShieldOff,
  UserX,
  Edit2,
  CheckCircle2,
  Trash2,
  Gamepad2,
  CreditCard
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'packages' | 'games' | 'payments'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingGame, setEditingGame] = useState<any | null>(null);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [paymentLogoPreview, setPaymentLogoPreview] = useState<string | null>(null);
  const [packageFilter, setPackageFilter] = useState('All Games');
  const [packageSearchQuery, setPackageSearchQuery] = useState('');
  const [orderSortConfig, setOrderSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderGameFilter, setOrderGameFilter] = useState('all');
  const [userSortConfig, setUserSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'joinedAt', direction: 'desc' });
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('zus_user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      
      if (!user || !user.isAdmin) {
        toast.error('Access denied. Admins only.');
        navigate('/');
        return false;
      }
      return true;
    };

    if (!checkAuth()) return;

    const loadData = () => {
      const savedOrders = localStorage.getItem('zus_orders');
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          setOrders(Array.isArray(parsed) ? (parsed as any[]).reverse() : []);
        } catch (e) {
          setOrders([]);
        }
      }

      const savedUsers = localStorage.getItem('zus_all_users');
      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);
          setUsers(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setUsers([]);
        }
      }

      const savedPackages = localStorage.getItem('zus_packages');
      if (savedPackages) {
        try {
          const parsed = JSON.parse(savedPackages);
          setPackages(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setPackages([]);
        }
      } else {
        // Initial default packages
        const defaultPackages = [
          { id: '1', gameId: 'free-fire', amount: 100, price: 85, bonus: '+10 Bonus' },
          { id: '2', gameId: 'free-fire', amount: 310, price: 260, bonus: '+35 Bonus' },
          { id: '3', gameId: 'free-fire', amount: 520, price: 430, bonus: '+60 Bonus' },
          { id: '4', gameId: 'free-fire', amount: 1060, price: 860, bonus: '+120 Bonus' },
          { id: '5', gameId: 'free-fire', amount: 2180, price: 1750, bonus: '+250 Bonus' },
          { id: '6', gameId: 'free-fire', amount: 5600, price: 4400, bonus: '+600 Bonus' },
          { id: '7', gameId: 'blood-strike', amount: 100, price: 90, bonus: '+5 Bonus' },
          { id: '8', gameId: 'blood-strike', amount: 500, price: 450, bonus: '+30 Bonus' },
        ];
        localStorage.setItem('zus_packages', JSON.stringify(defaultPackages));
        setPackages(defaultPackages);
      }

      const savedGames = localStorage.getItem('zus_games');
      if (savedGames) {
        try {
          const parsed = JSON.parse(savedGames);
          setGamesList(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setGamesList([]);
        }
      } else {
        const defaultGamesList = [
          { id: 'free-fire', name: 'Free Fire', category: 'Settle Diamond', tags: ['Popular', 'Instant'], image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', icon: '🔥' },
          { id: 'blood-strike', name: 'Blood Strike', category: 'Gold', tags: ['New', 'Secure'], image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2066&auto=format&fit=crop', icon: '🩸' },
          { id: 'mobile-legends', name: 'Mobile Legends', category: 'Diamonds', tags: ['Hot'], image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', icon: '⚔️' },
          { id: 'pubg-mobile', name: 'PUBG Mobile', category: 'UC', tags: ['Trusted'], image: 'https://images.unsplash.com/photo-1552824236-07779189891e?q=80&w=2070&auto=format&fit=crop', icon: '🪂' },
        ];
        localStorage.setItem('zus_games', JSON.stringify(defaultGamesList));
        setGamesList(defaultGamesList);
      }

      const savedPayments = localStorage.getItem('zus_payment_methods');
      if (savedPayments) {
        try {
          const parsed = JSON.parse(savedPayments);
          setPaymentMethods(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setPaymentMethods([]);
        }
      } else {
        const defaultPayments = [
          { id: 'bkash', name: 'bKash', number: '01700000000', logo: 'https://searchlogovector.com/wp-content/uploads/2019/02/bkash-logo-vector.png', color: '#D12053', status: 'active', apiKey: '' },
          { id: 'nagad', name: 'Nagad', number: '01800000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png', color: '#F7941D', status: 'active', apiKey: '' }
        ];
        localStorage.setItem('zus_payment_methods', JSON.stringify(defaultPayments));
        setPaymentMethods(defaultPayments);
      }
    };

    loadData();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'zus_orders') {
        const oldOrders = orders.length;
        loadData();
        
        // If current count is more than before, play sound
        const newOrders = localStorage.getItem('zus_orders');
        if (newOrders) {
          try {
            const parsed = JSON.parse(newOrders);
            if (parsed.length > orders.length) {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play().catch(e => console.log('Audio play blocked by browser policies'));
              toast('🔔 New Order Received!', {
                icon: '🛍️',
                style: {
                  borderRadius: '16px',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #FF5A1F'
                },
              });
            }
          } catch (e) {}
        }
      } else if (e.key === 'zus_all_users') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [navigate]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      const rawOrders = localStorage.getItem('zus_orders');
      const currentOrders = rawOrders ? JSON.parse(rawOrders) : [];
      
      const updatedOrders = currentOrders.map((o: any) => 
        String(o.id) === String(orderId) ? { ...o, status: newStatus } : o
      );

      localStorage.setItem('zus_orders', JSON.stringify(updatedOrders));
      setOrders([...updatedOrders].reverse());
      
      toast.success(`Success: Order marked as ${newStatus.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePaymentMethod = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payData = {
      id: editingPayment?.id || Date.now().toString(),
      name: formData.get('name'),
      number: formData.get('number'),
      apiKey: formData.get('apiKey'),
      status: formData.get('status'),
      color: formData.get('color') || '#FF5A1F',
      logo: paymentLogoPreview || editingPayment?.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    };

    let updatedPayments;
    if (editingPayment) {
      updatedPayments = paymentMethods.map(p => p.id === editingPayment.id ? payData : p);
      toast.success('Payment method updated');
    } else {
      updatedPayments = [...paymentMethods, payData];
      toast.success('Payment method added');
    }

    localStorage.setItem('zus_payment_methods', JSON.stringify(updatedPayments));
    setPaymentMethods(updatedPayments);
    setEditingPayment(null);
    setIsAddingPayment(false);
    setPaymentLogoPreview(null);
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (window.confirm('Delete this payment method?')) {
      const updated = paymentMethods.filter(p => p.id !== id);
      localStorage.setItem('zus_payment_methods', JSON.stringify(updated));
      setPaymentMethods(updated);
      toast.success('Payment method deleted');
    }
  };

  const handleSaveGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingGame?.id || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-');
    
    // Check if ID exists for new games
    if (!editingGame && gamesList.find(g => g.id === id)) {
      toast.error('A game with this name/ID already exists');
      return;
    }

    const gameData = {
      id,
      name: formData.get('name'),
      category: formData.get('category'),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      icon: formData.get('icon') || '🎮',
      image: logoPreview || editingGame?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    };

    let updatedGames;
    if (editingGame) {
      updatedGames = gamesList.map(g => g.id === editingGame.id ? gameData : g);
      toast.success('Game updated successfully');
    } else {
      updatedGames = [...gamesList, gameData];
      toast.success('Game added successfully');
    }

    localStorage.setItem('zus_games', JSON.stringify(updatedGames));
    setGamesList(updatedGames);
    setEditingGame(null);
    setIsAddingGame(false);
    setLogoPreview(null);
  };

  const handleDeleteGame = (id: string) => {
    const updatedGames = gamesList.filter(g => g.id !== id);
    localStorage.setItem('zus_games', JSON.stringify(updatedGames));
    setGamesList(updatedGames);
    toast.success('Game removed from inventory');
  };

  const handleSavePackage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pkgData = {
      id: editingPackage?.id || Date.now().toString(),
      gameId: formData.get('gameId'),
      label: formData.get('label'),
      amount: parseInt(formData.get('amount') as string) || 0,
      price: parseInt(formData.get('price') as string),
      bonus: formData.get('bonus'),
    };

    let updatedPackages;
    if (editingPackage) {
      updatedPackages = packages.map(p => p.id === editingPackage.id ? pkgData : p);
      toast.success('Package updated successfully');
    } else {
      updatedPackages = [pkgData, ...packages];
      toast.success('Package added successfully');
    }

    localStorage.setItem('zus_packages', JSON.stringify(updatedPackages));
    setPackages(updatedPackages);
    setEditingPackage(null);
    setIsAddingPackage(false);
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      const updatedPackages = packages.filter(p => p.id !== id);
      localStorage.setItem('zus_packages', JSON.stringify(updatedPackages));
      setPackages(updatedPackages);
      toast.success('Package deleted');
    }
  };
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (userSortConfig && userSortConfig.key === key && userSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setUserSortConfig({ key, direction });
  };

  const handleOrderSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (orderSortConfig && orderSortConfig.key === key && orderSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setOrderSortConfig({ key, direction });
  };

  const getSortIcon = (key: string, config: any) => {
    if (!config || config.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return config.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-brand-primary" /> 
      : <ArrowDown className="w-3 h-3 ml-1 text-brand-primary" />;
  };

  const filteredAndSortedOrders = [...orders]
    .filter(order => {
      const query = orderSearchQuery.toLowerCase();
      const matchesSearch = (
        order.id.toLowerCase().includes(query) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(query)) ||
        order.game.toLowerCase().includes(query) ||
        (order.playerId && order.playerId.toLowerCase().includes(query))
      );
      
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesGame = orderGameFilter === 'all' || order.game.toLowerCase() === orderGameFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesGame;
    })
    .sort((a, b) => {
      if (!orderSortConfig) return 0;
      const { key, direction } = orderSortConfig;
      
      let valA = a[key] || '';
      let valB = b[key] || '';
      
      if (key === 'price' || key === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (key === 'id' && a.createdAt && b.createdAt) {
        // Use createdAt for better date sorting if available
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const filteredAndSortedUsers = [...users]
    .filter(user => {
      const query = userSearchQuery.toLowerCase();
      const matchesSearch = (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.id && user.id.toLowerCase().includes(query))
      );

      const matchesRole = userRoleFilter === 'all' || 
        (userRoleFilter === 'admin' && user.isAdmin) || 
        (userRoleFilter === 'user' && !user.isAdmin);

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (!userSortConfig) return 0;
      const { key, direction } = userSortConfig;
      
      let valA = a[key] || '';
      let valB = b[key] || '';
      
      if (key === 'joinedAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const stats = [
    { label: 'Total Revenue', value: `৳${orders.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Orders', value: orders.filter(o => o.status !== 'completed').length.toString(), icon: ShoppingBag, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
    { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight mb-2 uppercase">COMMAND CENTER</h1>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'packages', label: 'Packages', icon: Package },
              { id: 'games', label: 'Games', icon: Gamepad2 },
              { id: 'payments', label: 'Payments', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {activeTab === 'users' ? (
            <button className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Admin
            </button>
          ) : activeTab === 'games' ? (
            <button 
              onClick={() => setIsAddingGame(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Game
            </button>
          ) : activeTab === 'payments' ? (
            <button 
              onClick={() => setIsAddingPayment(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Payment
            </button>
          ) : (
            <>
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button 
                onClick={() => setIsAddingPackage(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Package
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(isAddingPayment || editingPayment) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-dark border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">
                {editingPayment ? 'Edit Payment' : 'Add New Payment'}
              </h3>
              <form onSubmit={handleSavePaymentMethod} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Method Name</label>
                  <input 
                    name="name"
                    type="text"
                    required
                    defaultValue={editingPayment?.name}
                    placeholder="bKash"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number / Account Detail</label>
                  <input 
                    name="number"
                    type="text"
                    required
                    defaultValue={editingPayment?.number}
                    placeholder="01700000000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gateway API Key (Optional)</label>
                  <input 
                    name="apiKey"
                    type="password"
                    defaultValue={editingPayment?.apiKey}
                    placeholder="sk_test_..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">GateWay Status</label>
                  <select 
                    name="status"
                    defaultValue={editingPayment?.status || 'active'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary appearance-none"
                  >
                    <option value="active" className="bg-bg-dark">Active</option>
                    <option value="inactive" className="bg-bg-dark">Inactive</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Theme Color</label>
                    <input 
                      name="color"
                      type="color"
                      defaultValue={editingPayment?.color || '#FF5A1F'}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-2 py-2 outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo Upload</label>
                    <input 
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentLogoChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                    />
                  </div>
                </div>
                
                {(paymentLogoPreview || editingPayment?.logo) && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-2">
                      {paymentLogoPreview ? 'New Logo Preview' : 'Current Logo Preview'}
                    </p>
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center p-2 border border-white/10">
                      <img 
                        src={paymentLogoPreview || editingPayment.logo} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingPayment(false); setEditingPayment(null); setPaymentLogoPreview(null); }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Save Method
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {(isAddingGame || editingGame) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-dark border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">
                {editingGame ? 'Edit Game' : 'Add New Game'}
              </h3>
              <form onSubmit={handleSaveGame} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Game Name</label>
                  <input 
                    name="name"
                    type="text"
                    required
                    defaultValue={editingGame?.name}
                    placeholder="Free Fire"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category (e.g. Diamonds)</label>
                  <input 
                    name="category"
                    type="text"
                    required
                    defaultValue={editingGame?.category}
                    placeholder="Diamonds"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tags (Comma separated)</label>
                  <input 
                    name="tags"
                    type="text"
                    defaultValue={editingGame?.tags?.join(', ')}
                    placeholder="Popular, Instant, Hot"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Icon (Emoji/Text)</label>
                    <input 
                      name="icon"
                      type="text"
                      defaultValue={editingGame?.icon}
                      placeholder="🔥"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo Upload</label>
                    <input 
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                    />
                  </div>
                </div>
                
                {(logoPreview || editingGame?.image) && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-2">
                      {logoPreview ? 'New Logo Preview' : 'Current Logo Preview'}
                    </p>
                    <img 
                      src={logoPreview || editingGame.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-2xl border border-white/10 shadow-xl" 
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingGame(false); setEditingGame(null); setLogoPreview(null); }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Save Game
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {(isAddingPackage || editingPackage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-dark border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <form onSubmit={handleSavePackage} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Game</label>
                  <select 
                    name="gameId" 
                    defaultValue={editingPackage?.gameId || 'free-fire'}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  >
                    {gamesList.map(game => (
                      <option key={game.id} value={game.id} className="bg-bg-dark">
                        {game.icon} {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Label (e.g. Elite Pass)</label>
                    <input 
                      name="label"
                      type="text"
                      defaultValue={editingPackage?.label}
                      placeholder="Optional"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount (Numeric)</label>
                    <input 
                      name="amount"
                      type="number"
                      required
                      defaultValue={editingPackage?.amount}
                      placeholder="1000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (BDT)</label>
                  <input 
                    name="price"
                    type="number"
                    required
                    defaultValue={editingPackage?.price}
                    placeholder="850"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bonus Text (Optional)</label>
                  <input 
                    name="bonus"
                    defaultValue={editingPackage?.bonus}
                    placeholder="+150 Bonus"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingPackage(false); setEditingPackage(null); }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Save Package
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'payments' ? (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
              <h3 className="text-2xl font-black flex items-center gap-3 font-display uppercase tracking-tight">
                <CreditCard className="w-7 h-7 text-brand-primary" />
                PAYMENT METHODS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="glass-card group overflow-hidden p-6 flex flex-col items-center text-center relative">
                  <div 
                    className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none" 
                    style={{ backgroundColor: method.color, maskImage: `url(${method.logo})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} 
                  />
                  
                  <div className="relative w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/10 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/40">
                    <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-dark" style={{ backgroundColor: method.color }} />
                  </div>
                  
                  <h4 className="text-xl font-black uppercase tracking-tight mb-1">{method.name}</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      method.status === 'inactive' ? 'bg-red-500' : 'bg-green-500'
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {method.status === 'inactive' ? 'OFFLINE' : 'ONLINE'}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-gray-400 mb-6 bg-white/5 px-3 py-1 rounded-lg border border-white/5">{method.number}</p>
                  
                  <div className="flex gap-2 w-full mt-auto">
                    <button 
                      onClick={() => {
                        setEditingPayment(method);
                        setPaymentLogoPreview(null);
                      }}
                      className="flex-1 p-3 bg-white/5 rounded-xl hover:bg-brand-primary/20 hover:text-brand-primary transition-all text-gray-500 flex items-center justify-center gap-2 border border-white/5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all text-gray-500 border border-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setIsAddingPayment(true)}
                className="glass-card p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-gray-500 hover:text-brand-primary min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Add New Method</span>
              </button>
            </div>
          </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Grid Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card p-5 md:p-8">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl md:text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Platform Activity</h3>
                  <p className="text-sm text-gray-400">Real-time stats from the last 24 hours</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Completion Rate</p>
                  <p className="text-2xl font-black text-brand-secondary">94.2%</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Avg. Response Time</p>
                  <p className="text-2xl font-black text-blue-500">4.5 mins</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">System Health</p>
                  <p className="text-2xl font-black text-green-500">Operational</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'orders' ? (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <h3 className="text-2xl font-black flex items-center gap-3 font-display">
                <ShoppingBag className="w-6 h-6 text-brand-primary" />
                ORDER MANAGEMENT
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    placeholder="Search ID, Player, or Game..." 
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-primary" 
                  />
                </div>
                <div className="relative w-full md:w-40">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <select 
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-primary appearance-none"
                  >
                    <option value="all" className="bg-bg-dark">All Status</option>
                    <option value="pending" className="bg-bg-dark">Pending</option>
                    <option value="completed" className="bg-bg-dark">Completed</option>
                    <option value="cancelled" className="bg-bg-dark">Cancelled</option>
                  </select>
                </div>
                <div className="relative w-full md:w-48">
                  <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <select 
                    value={orderGameFilter}
                    onChange={(e) => setOrderGameFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-primary appearance-none"
                  >
                    <option value="all" className="bg-bg-dark">All Games</option>
                    {gamesList.map(g => (
                      <option key={g.id} value={g.name} className="bg-bg-dark">{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th 
                        className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleOrderSort('game')}
                      >
                        <div className="flex items-center">
                          Order / Game
                          {getSortIcon('game', orderSortConfig)}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleOrderSort('userEmail')}
                      >
                        <div className="flex items-center">
                          Player & Payment
                          {getSortIcon('userEmail', orderSortConfig)}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleOrderSort('status')}
                      >
                        <div className="flex items-center justify-center">
                          Status
                          {getSortIcon('status', orderSortConfig)}
                        </div>
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-32 text-center">
                          <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium tracking-tight">No orders found.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                          <td className="px-4 py-6">
                            <div className="flex flex-col">
                              <span className="font-mono text-[9px] text-brand-primary mb-1">#{order.id.slice(-8)}</span>
                              <span className="text-base font-black text-white uppercase font-display leading-tight">{order.game}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-gray-400">{order.amount} {order.game === 'Free Fire' ? 'Diamonds' : 'Gold'}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-xs font-black text-brand-secondary">{formatCurrency(order.price)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-gray-500" />
                                <span className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[120px]">{order.userEmail || 'guest@example.com'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                                  <span className="text-[8px] font-black text-brand-secondary">ID</span>
                                </div>
                                <span className="text-xs font-black text-gray-200 font-mono tracking-wider">{order.playerId || 'N/A'}</span>
                              </div>
                              <div className="px-2 py-1 bg-brand-primary/5 border border-brand-primary/10 rounded-lg flex items-center justify-between gap-2 max-w-[180px]">
                                <span className="text-[9px] text-brand-primary font-black tracking-widest truncate">{order.transactionId || 'N/A'}</span>
                                <span className="text-[8px] font-black text-brand-secondary">{order.paymentMethod || 'BKASH'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  const nextStatus = order.status === 'pending' ? 'completed' : order.status === 'completed' ? 'cancelled' : 'pending';
                                  handleUpdateOrderStatus(order.id, nextStatus);
                                }}
                                className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm transition-all active:scale-95 cursor-pointer",
                                  order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                  order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'
                                )}
                              >
                                {order.status}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex justify-end gap-2">
                              {order.status === 'pending' ? (
                                <>
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 active:scale-90"
                                    title="Approve"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                    className="p-2 bg-white/5 text-gray-500 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all active:scale-90"
                                    title="Cancel"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                  className="p-2 bg-white/5 hover:bg-white/10 text-gray-500 rounded-lg border border-white/5 transition-all"
                                  title="Reset to Pending"
                                >
                                  <BarChart3 className="w-4 h-4 rotate-180" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'users' ? (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold">User Management</h3>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      type="text" 
                      placeholder="Search by name, email or UID..." 
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-primary/50" 
                    />
                  </div>
                  <div className="relative w-full md:w-40">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <select 
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-primary appearance-none"
                    >
                      <option value="all" className="bg-bg-dark">All Roles</option>
                      <option value="admin" className="bg-bg-dark">Admins</option>
                      <option value="user" className="bg-bg-dark">Users</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th 
                        className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          User Info
                          {getSortIcon('name', userSortConfig)}
                        </div>
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                      <th 
                        className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors text-center"
                        onClick={() => handleSort('joinedAt')}
                      >
                        <div className="flex items-center justify-center">
                          Joined At
                          {getSortIcon('joinedAt', userSortConfig)}
                        </div>
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAndSortedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-20 text-center text-gray-500">No users found matching your search.</td>
                      </tr>
                    ) : (
                      filteredAndSortedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] group">
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center font-bold text-brand-primary">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{user.name}</p>
                                <p className="text-[10px] text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className={cn(
                              "px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider",
                              user.isAdmin ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30" : "bg-white/10 text-gray-400"
                            )}>
                              {user.isAdmin ? 'admin' : 'user'}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase"
                            )}>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center text-xs text-gray-400 font-mono">
                            {user.joinedAt || '2024-03-01'}
                          </td>
                          <td className="px-4 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 text-red-500" title="Disable User">
                                <UserX className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-white/[0.02] flex items-center justify-between text-xs text-gray-500">
                <p>Showing {filteredAndSortedUsers.length} of {users.length} users</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10">Next</button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'packages' ? (
          <motion.div
            key="packages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
              <h3 className="text-2xl font-black flex items-center gap-3 font-display uppercase tracking-tight">
                <Package className="w-7 h-7 text-brand-secondary" />
                PACKAGE INVENTORY
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                   <input 
                    type="text" 
                    placeholder="Search package..." 
                    value={packageSearchQuery}
                    onChange={(e) => setPackageSearchQuery(e.target.value)}
                    className="w-full lg:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-brand-secondary focus:bg-white/10 transition-all placeholder:text-gray-700"
                   />
                </div>
                <div className="relative">
                   <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                   <select 
                    value={packageFilter}
                    onChange={(e) => setPackageFilter(e.target.value)}
                    className="w-full lg:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 py-4 text-sm font-bold outline-none appearance-none focus:border-brand-secondary focus:bg-white/10 transition-all cursor-pointer"
                   >
                      <option className="bg-bg-dark font-sans" value="All Games">All Games</option>
                      {gamesList.map(g => <option key={g.id} value={g.id} className="bg-bg-dark font-sans">{g.name}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Game / Category</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Quantity</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Pricing</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {packages
                      .filter(p => {
                        const matchesGame = packageFilter === 'All Games' || p.gameId === packageFilter;
                        const matchesSearch = 
                          (p.label?.toLowerCase() || '').includes(packageSearchQuery.toLowerCase()) ||
                          p.amount.toString().includes(packageSearchQuery) ||
                          p.price.toString().includes(packageSearchQuery);
                        return matchesGame && matchesSearch;
                      }).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-20 text-center text-gray-500 italic">No packages found for this selection.</td>
                      </tr>
                    ) : (
                      packages
                        .filter(p => {
                          const matchesGame = packageFilter === 'All Games' || p.gameId === packageFilter;
                          const matchesSearch = 
                            (p.label?.toLowerCase() || '').includes(packageSearchQuery.toLowerCase()) ||
                            p.amount.toString().includes(packageSearchQuery) ||
                            p.price.toString().includes(packageSearchQuery);
                          return matchesGame && matchesSearch;
                        })
                        .map((pkg) => {
                        const game = gamesList.find(g => g.id === pkg.gameId);
                        return (
                          <tr key={pkg.id} className="hover:bg-white/[0.02] transition-all">
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                                  {game?.icon || '🎮'}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-black text-white uppercase">{game?.name || pkg.gameId}</span>
                                  <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                                    {game?.category || 'Premium Currency'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-3">
                                <span className="text-base font-black">
                                  {pkg.label || pkg.amount.toLocaleString()}
                                </span>
                                {pkg.bonus && (
                                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black rounded border border-green-500/20">
                                    {pkg.bonus}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                               <span className="text-base font-black text-brand-primary tracking-tight">{formatCurrency(pkg.price)}</span>
                            </td>
                            <td className="px-4 py-5 text-right">
                              <div className="inline-flex gap-2">
                                <button 
                                  onClick={() => setEditingPackage(pkg)}
                                  className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="p-1.5 bg-white/5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black flex items-center gap-3 font-display">
                <Gamepad2 className="w-6 h-6 text-brand-primary" />
                GAME MANAGEMENT
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gamesList.map((game) => (
                <div key={game.id} className="glass-card group overflow-hidden flex flex-col md:flex-row lg:flex-col xl:flex-row">
                  <div className="relative w-full md:w-40 lg:w-full xl:w-40 h-32 md:h-full lg:h-32 xl:h-auto overflow-hidden">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent md:bg-gradient-to-r md:from-bg-dark md:to-transparent lg:bg-gradient-to-t lg:from-bg-dark lg:to-transparent xl:bg-gradient-to-r xl:from-bg-dark xl:to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                         <span className="text-2xl">{game.icon}</span>
                         <h4 className="text-lg font-black uppercase tracking-tight truncate max-w-[120px]">{game.name}</h4>
                       </div>
                       <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingGame(game)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-brand-primary/20 hover:text-brand-primary transition-all text-gray-500"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGame(game.id)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all text-gray-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-black mb-4 uppercase tracking-widest leading-none">{game.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {game.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-brand-primary/10 rounded text-[8px] font-black text-brand-primary uppercase border border-brand-primary/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
