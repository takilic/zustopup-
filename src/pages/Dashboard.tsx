import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Clock, ShoppingBag, Settings, LogOut, CheckCircle2, TrendingUp, Star } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabase';


export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'history'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: 'Gamer User',
    email: 'user@example.com'
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
  });

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('zus_user');
    if (!savedUser) {
      navigate('/auth');
      return;
    }
    const user = JSON.parse(savedUser);
    setUserProfile(user);
    setProfileForm({ name: user.name || '' });

    const loadOrdersData = async () => {
      setIsLoading(true);
      
      // Try Supabase if configured
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_email', user.email)
            .order('created_at', { ascending: false });
          
          if (data && data.length > 0) {
            setOrders(data.map(o => ({
              id: o.id.toString(),
              game: o.game_name,
              amount: o.package_id, // Simplified mapping
              price: o.amount_paid,
              status: o.status,
              date: o.created_at,
              paymentMethod: o.payment_method
            })));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase orders fetch failed', err);
        }
      }

      // Fallback
      const savedOrders = localStorage.getItem('zus_orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        const userOrders = allOrders.filter((order: any) => order.userEmail === user.email);
        setOrders(userOrders);
      }
      setIsLoading(false);
    };

    loadOrdersData();

    const handleStorageChange = () => {
      loadOrdersData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const user = {
    name: userProfile.name,
    email: userProfile.email,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=cover',
    orders: orders.length,
    spent: orders.reduce((acc, curr) => acc + (curr.price || 0), 0),
  };

  const nameInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'GU';

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('zus_user');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = { ...userProfile, name: profileForm.name };
      
      // Update local storage
      localStorage.setItem('zus_user', JSON.stringify(updatedUser));
      setUserProfile(updatedUser);

      // Update Supabase metadata if logged in and configured
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: profileForm.name }
        });
        if (error) throw error;
      }

      toast.success('Profile updated successfully!');
      setActiveTab('orders');
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full rounded-full border-2 border-brand-primary p-1 bg-surface flex items-center justify-center font-black text-2xl text-brand-primary">
                {nameInitials}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-surface rounded-full" />
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400 mb-6">{user.email}</p>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Orders</p>
                <p className="text-lg font-black text-brand-secondary">{user.orders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Spent</p>
                <p className="text-lg font-black text-brand-primary">৳{user.spent}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-2">
            {[
              { id: 'orders', label: 'My Orders', icon: ShoppingBag },
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'history', label: 'Order History', icon: Clock },
              { id: 'security', label: 'Security', icon: Settings },
              { id: 'signout', label: 'Sign Out', icon: LogOut, danger: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.danger) handleSignOut();
                  else if (item.id === 'orders' || item.id === 'profile' || item.id === 'history') setActiveTab(item.id as any);
                  else toast.error('This feature is currently under maintenance');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  (activeTab === item.id) ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                } ${item.danger ? 'hover:text-red-500' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'orders' ? (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black font-display tracking-tight uppercase">MY ORDERS</h1>
                {orders.length > 0 && (
                  <button onClick={() => setActiveTab('history')} className="text-sm text-brand-primary font-bold hover:underline">View All History</button>
                )}
              </div>

              <div className="glass-card overflow-hidden">
                {isLoading ? (
                  <div className="p-20 text-center text-gray-500">Loading your history...</div>
                ) : orders.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold">No orders yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Start your gaming journey by topping up your favorite games now!</p>
                    <div className="pt-4">
                      <Link to="/" className="btn-primary">Browse Games</Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Game / Details</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-6 font-mono text-xs text-brand-secondary">{order.id}</td>
                            <td className="px-6 py-6">
                              <p className="font-bold">{order.game}</p>
                              <p className="text-xs text-gray-500">{order.amount} Credits</p>
                            </td>
                            <td className="px-6 py-6 font-bold">{formatCurrency(order.price)}</td>
                            <td className="px-6 py-6">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                'bg-blue-500/10 text-blue-500'
                              )}>
                                {order.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                {order.status === 'processing' && <TrendingUp className="w-3 h-3" />}
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'history' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black font-display tracking-tight uppercase">TRANSACTION HISTORY</h1>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">
                    TOTAL ORDERS: {orders.length}
                  </div>
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                {isLoading ? (
                  <div className="p-20 text-center text-gray-500">Retrieving full history...</div>
                ) : orders.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold">No history found</h3>
                    <p className="text-gray-500">You haven't made any transactions yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date / Time</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Game</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Package</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-6 font-mono text-[10px] text-brand-secondary">{order.id}</td>
                            <td className="px-6 py-6">
                              <p className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</p>
                              <p className="text-[10px] text-gray-500">{new Date(order.date).toLocaleTimeString()}</p>
                            </td>
                            <td className="px-6 py-6 font-bold text-sm">{order.game}</td>
                            <td className="px-6 py-6 text-sm text-gray-300">{order.amount} Units</td>
                            <td className="px-6 py-6 font-black text-brand-primary">{formatCurrency(order.price)}</td>
                            <td className="px-6 py-6">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                'bg-blue-500/10 text-blue-500'
                              )}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-black font-display tracking-tight uppercase">PROFILE SETTINGS</h1>
              
              <div className="glass-card p-8 space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-primary p-1 bg-surface flex items-center justify-center font-black text-2xl text-brand-primary overflow-hidden">
                      {nameInitials}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer rounded-full">
                       <p className="text-[10px] font-black tracking-tighter text-white">UPDATE</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase">{userProfile.name}</h3>
                    <p className="text-gray-500 text-sm">{userProfile.email}</p>
                    <span className="inline-flex mt-2 px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-brand-primary/20">
                      ZUS ELITE MEMBER
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">DISPLAY NAME</label>
                    <input 
                      type="text" 
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary transition-all font-medium"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={userProfile.email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none opacity-50 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSaving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loyalty Banner */}
          <div className="relative rounded-3xl overflow-hidden p-1 bg-gradient-to-r from-brand-primary to-brand-secondary">
            <div className="glass-card p-10 bg-bg-dark/90 text-center relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-brand-primary/5 blur-3xl rounded-full" />
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
              <h2 className="text-3xl font-black mb-4">LOYALTY REWARDS</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                You're just 2 orders away from unlocking the <b>Gold Tier</b>. 
                Get 5% cashback on all future diamond top-ups.
              </p>
              <button className="btn-primary">Check Rewards</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
