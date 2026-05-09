import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronRight, CheckCircle2, AlertCircle, CreditCard, Copy } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<any | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [step, setStep] = useState(1);
  const [gamePackages, setGamePackages] = useState<any[]>([]);
  const [gameInfo, setGameInfo] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 1. Load Game Info
      let foundGame = null;
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('game_packages')
            .select('game_name, category, image_url')
            .eq('game_name', id?.replace(/-/g, ' ')) // Rough match
            .limit(1)
            .maybeSingle();
            
          if (data) {
            foundGame = {
              name: data.game_name,
              banner: data.image_url,
              currency: data.category || 'Premium Currency'
            };
          }
        } catch (e) {
          console.warn('Supabase game fetch failed', e);
        }
      }

      if (!foundGame) {
        const defaultGamesList = [
          { id: 'free-fire', name: 'Free Fire', category: 'Settle Diamond', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop' },
          { id: 'blood-strike', name: 'Blood Strike', category: 'Gold', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2066&auto=format&fit=crop' },
          { id: 'mobile-legends', name: 'Mobile Legends', category: 'Diamonds', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
          { id: 'pubg-mobile', name: 'PUBG Mobile', category: 'UC', image: 'https://images.unsplash.com/photo-1552824236-07779189891e?q=80&w=2070&auto=format&fit=crop' },
        ];

        const savedGames = localStorage.getItem('zus_games');
        let allGames = defaultGamesList;
        if (savedGames) {
          try {
            allGames = JSON.parse(savedGames);
          } catch (e) {}
        }

        const current = allGames.find((g: any) => g.id === id);
        if (current) {
          foundGame = {
            name: current.name,
            banner: current.image,
            currency: current.category || 'Premium Currency'
          };
        }
      }
      setGameInfo(foundGame);

      // 2. Load Packages
      let foundPackages = [];
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('game_packages')
            .select('*')
            .eq('game_name', foundGame?.name || id)
            .eq('is_active', true);
          
          if (data && data.length > 0) {
            foundPackages = data.map(p => ({
              id: p.id,
              gameId: id,
              amount: p.package_name,
              price: p.price,
              bonus: p.bonus_info,
              label: p.package_name
            }));
          }
        } catch (e) {
          console.warn('Supabase packages fetch failed', e);
        }
      }

      if (foundPackages.length === 0) {
        const savedPackages = localStorage.getItem('zus_packages');
        if (savedPackages) {
          try {
            const allPackages = JSON.parse(savedPackages);
            foundPackages = allPackages.filter((p: any) => p.gameId === id);
          } catch (e) {}
        } else if (id === 'free-fire') {
          foundPackages = [
            { id: '1', gameId: 'free-fire', amount: 100, price: 85, bonus: '+10 Bonus' },
            { id: '2', gameId: 'free-fire', amount: 310, price: 260, bonus: '+35 Bonus' },
            { id: '3', gameId: 'free-fire', amount: 520, price: 430, bonus: '+60 Bonus' },
          ];
        }
      }
      setGamePackages(foundPackages);

      // 3. Load Payment Methods
      const savedPayments = localStorage.getItem('zus_payment_methods');
      if (savedPayments) {
        try {
          const parsed = JSON.parse(savedPayments);
          const activeOnly = Array.isArray(parsed) ? parsed.filter((m: any) => m.status !== 'inactive') : [];
          setPaymentMethods(activeOnly);
        } catch (e) {
          setPaymentMethods([]);
        }
      } else {
        const defaultPayments = [
          { id: 'bkash', name: 'bKash', number: '01700000000', logo: 'https://searchlogovector.com/wp-content/uploads/2019/02/bkash-logo-vector.png', color: '#D12053' },
          { id: 'nagad', name: 'Nagad', number: '01800000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png', color: '#F7941D' }
        ];
        setPaymentMethods(defaultPayments);
      }
    };
    loadData();
  }, [id]);

  if (!gameInfo) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading game details...</div>;
  }

  const sendTelegramNotification = async (order: any) => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatIds = [
      import.meta.env.VITE_TELEGRAM_CHAT_ID,
      import.meta.env.VITE_TELEGRAM_CHAT_ID_2
    ].filter(Boolean); 

    const message = `
<b>🔔 NEW ORDER RECEIVED</b>
----------------------------
🆔 <b>Order ID:</b> ${order.id}
🎮 <b>Game:</b> ${order.game}
👤 <b>Player ID:</b> ${order.playerId}
💎 <b>Package:</b> ${order.amount}
💰 <b>Price:</b> ${order.price} BDT
🏦 <b>Payment:</b> ${order.paymentMethod}
📜 <b>Transaction:</b> <code>${order.transactionId}</code>
📧 <b>Customer:</b> ${order.userEmail}
----------------------------
Check Admin Dashboard for details.
    `;

    if (botToken && chatIds.length > 0) {
      for (const chatId of chatIds) {
        try {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML',
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            console.error(`❌ Telegram API Error for ${chatId}:`, data);
          }
        } catch (err) {
          console.error(`❌ Telegram Network error for ${chatId}:`, err);
        }
      }
    }
  };

  const handleCheckout = () => {
    if (!playerId) return toast.error('Please enter your Player ID');
    if (!selectedPackage) return toast.error('Please select a package');
    setStep(2);
  };

  const handlePayment = () => {
    if (!paymentMethod) return toast.error('Please select a payment method');
    if (!transactionId) return toast.error('Please enter the Transaction ID');
    
    // Create real order object
    const savedUser = localStorage.getItem('zus_user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    const selectedPkg = selectedPackage ? gamePackages.find(p => p.id === selectedPackage) : null;
    const newOrder = {
      id: `ZUS-${Math.floor(Math.random() * 90000) + 10000}`,
      game: gameInfo.name,
      amount: selectedPkg ? (selectedPkg.label || selectedPkg.amount) : 0,
      price: selectedPkg ? selectedPkg.price : 0,
      status: 'pending',
      date: new Date().toISOString(),
      playerId,
      transactionId,
      paymentMethod: paymentMethod?.name || 'Unknown',
      userEmail: user?.email || 'guest@example.com'
    };

    // Save to localStorage (and Supabase if configured)
    const existingOrders = JSON.parse(localStorage.getItem('zus_orders') || '[]');
    localStorage.setItem('zus_orders', JSON.stringify([newOrder, ...existingOrders]));

    if (isSupabaseConfigured) {
      const selectedPkg = selectedPackage ? gamePackages.find(p => p.id === selectedPackage) : null;
      supabase
        .from('orders')
        .insert([{
          user_id: user?.id || 'guest',
          game_name: gameInfo.name,
          player_id: playerId,
          package_id: selectedPkg?.id || 'unknown',
          amount_paid: selectedPkg?.price || 0,
          payment_method: paymentMethod?.name || 'Unknown',
          transaction_id: transactionId,
          status: 'pending'
        }])
        .then(({ error }) => {
          if (error) console.error('Supabase order save failed', error);
        });
    }

    // Trigger Admin notifications
    sendTelegramNotification(newOrder);

    toast.success('Order placed successfully!');
    navigate('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info & Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game Banner */}
          <div className="relative h-64 rounded-3xl overflow-hidden glass-card p-0">
            <img 
              src={gameInfo.banner} 
              alt={gameInfo.name}
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl font-black">{gameInfo.name}</h1>
              <p className="text-gray-400">Direct Top-Up (Region: BD)</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Player Details</h2>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">Enter Player ID (UID)</label>
              <input 
                type="text" 
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Ex: 582910394"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-brand-primary transition-colors text-lg font-mono"
              />
              <p className="text-xs text-brand-secondary flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Double check your UID. We are not responsible for wrong inputs.
              </p>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center text-brand-secondary">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Select Package</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gamePackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative p-6 rounded-2xl border text-left transition-all group",
                    selectedPackage === pkg.id 
                      ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                      : "bg-white/5 border-white/10 hover:border-brand-secondary/40"
                  )}
                >
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{gameInfo.currency}</p>
                  <p className={cn(
                    "font-black mb-2",
                    (pkg.label && pkg.label.length > 8) ? "text-lg" : "text-2xl"
                  )}>
                    {pkg.label || pkg.amount}
                  </p>
                  <p className="text-brand-secondary font-bold text-sm">{formatCurrency(pkg.price)}</p>
                  {pkg.bonus && (
                    <div className="mt-2 inline-block px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">
                      {pkg.bonus}
                    </div>
                  )}
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Checkout */}
        <div className="space-y-6">
          <div className=" glass-card p-8 sticky top-32">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              Order Summary
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </h3>
            
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Game</span>
                    <span className="text-gray-200">{gameInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Player ID</span>
                    <span className="text-brand-secondary font-mono">{playerId || 'Not Entered'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Package</span>
                    <span className="text-gray-200">
                      {selectedPackage ? (gamePackages.find(p => p.id === selectedPackage)?.label || gamePackages.find(p => p.id === selectedPackage)?.amount) : 0} {gameInfo.currency}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-400 font-medium">Total Amount</span>
                    <span className="text-3xl font-black text-brand-primary">
                      {selectedPackage ? formatCurrency(gamePackages.find(p => p.id === selectedPackage)!.price) : '0.00'}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">SELECT PAYMENT METHOD</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <button 
                          key={method.id}
                          onClick={() => setPaymentMethod(method)}
                          className={cn(
                            "relative p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all overflow-hidden group",
                            paymentMethod?.id === method.id 
                              ? "bg-white/5 ring-2 ring-brand-primary border-transparent" 
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center p-2 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
                            <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{method.name}</span>
                          {paymentMethod?.id === method.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentMethod && (
                      <motion.div 
                        key={paymentMethod.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none -mr-8 -mt-8">
                          <img src={paymentMethod.logo} alt="" className="w-full h-full object-contain rotate-12" />
                        </div>

                        <div className="space-y-6 relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Process Payment via</p>
                              <h5 className="text-lg font-black uppercase text-white tracking-tight">{paymentMethod.name} Instructions</h5>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 p-2 border border-white/10 shadow-inner">
                              <img src={paymentMethod.logo} alt={paymentMethod.name} className="w-full h-full object-contain" />
                            </div>
                          </div>

                          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Dial / Use Number</p>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-2xl font-black font-mono tracking-tighter text-brand-primary">{paymentMethod.number}</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(paymentMethod.number);
                                  toast.success('Number copied!');
                                }}
                                className="px-3 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 rounded-xl transition-all border border-brand-primary/20 text-brand-primary flex items-center gap-2 group active:scale-95"
                              >
                                <Copy className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Copy</span>
                              </button>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                               <div className="px-2 py-0.5 bg-brand-secondary/20 rounded text-[8px] font-black uppercase text-brand-secondary text-center min-w-[60px]">Personal</div>
                               <div className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black uppercase text-gray-500 text-center min-w-[70px]">Send Money</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 border border-white/10">1</div>
                              <p className="text-xs text-gray-400 leading-tight">Send <span className="text-white font-bold">৳{selectedPackage ? gamePackages.find(p => p.id === selectedPackage)!.price : '0'}</span> using Send Money to the number above.</p>
                            </div>
                            <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 border border-white/10">2</div>
                              <p className="text-xs text-gray-400 leading-tight">Copy your <span className="text-white font-bold">Transaction ID</span> from the SMS or app history.</p>
                            </div>
                            <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 border border-white/10">3</div>
                              <p className="text-xs text-gray-400 leading-tight">Enter the Transaction ID in the field below to verify.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Transaction ID</label>
                    <input 
                      type="text" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="EX: 4J893SKD9" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-gray-700 font-mono tracking-widest uppercase" 
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 text-sm">Back</button>
                    <button onClick={handlePayment} className="btn-primary flex-[2] py-3 text-sm">Pay Now</button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
