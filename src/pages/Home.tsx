import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Laptop, Smartphone, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const features = [
  { icon: Zap, title: 'Instant Delivery', description: 'Top-ups are processed and delivered within minutes.' },
  { icon: ShieldCheck, title: 'Secure Payment', description: 'Trusted by thousands with safe bKash/Nagad gateways.' },
  { icon: Star, title: 'Best Prices', description: 'Competitive rates and exclusive bonuses on every purchase.' },
];

export function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('zus_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isLoggedIn) setUser(parsed);
      } catch (e) {
        console.error('User parse error', e);
      }
    }

    const loadGames = async () => {
      // Try Supabase first if configured
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('game_packages')
            .select('game_name, category, image_url')
            .eq('is_active', true);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Group by game_name to get unique games
            const uniqueGames = data.reduce((acc: any[], current: any) => {
              const gameId = current.game_name.toLowerCase().replace(/\s+/g, '-');
              if (!acc.find(g => g.id === gameId)) {
                acc.push({
                  id: gameId,
                  name: current.game_name,
                  category: current.category || 'Credits',
                  image: current.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
                  tags: ['Direct'],
                  icon: '🎮'
                });
              }
              return acc;
            }, []);
            setGames(uniqueGames);
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local storage', err);
        }
      }

      const savedGames = localStorage.getItem('zus_games');
      const defaultGames = [
        { id: 'free-fire', name: 'Free Fire', category: 'Settle Diamond', tags: ['Popular', 'Instant'], image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', icon: '🔥' },
        { id: 'blood-strike', name: 'Blood Strike', category: 'Gold', tags: ['New', 'Secure'], image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2066&auto=format&fit=crop', icon: '🩸' },
        { id: 'mobile-legends', name: 'Mobile Legends', category: 'Diamonds', tags: ['Hot'], image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', icon: '⚔️' },
        { id: 'pubg-mobile', name: 'PUBG Mobile', category: 'UC', tags: ['Trusted'], image: 'https://images.unsplash.com/photo-1552824236-07779189891e?q=80&w=2070&auto=format&fit=crop', icon: '🪂' },
      ];

      if (savedGames) {
        try {
          setGames(JSON.parse(savedGames));
        } catch (e) {
          setGames(defaultGames);
        }
      } else {
        localStorage.setItem('zus_games', JSON.stringify(defaultGames));
        setGames(defaultGames);
      }
    };

    loadGames();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-24 pb-24"
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/80 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2400&auto=format&fit=crop" 
            alt="Gaming Background"
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Animated Glow Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              #1 Trusted Gaming Hub in Bangladesh
            </div>
            <h1 className="text-6xl md:text-[7.5rem] font-black mb-8 leading-[0.85] tracking-tighter uppercase font-display">
              Elevate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">Your Play</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl font-medium">
              Instant delivery, lightning-fast processing, and the most secure top-up experience for elite gamers.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <a href="#games" className="btn-primary flex items-center gap-3 px-10 py-5 rounded-2xl group">
                EXPLORE INVENTORY
                <Zap className="w-5 h-5 group-hover:fill-current transition-all" />
              </a>
              <Link to={user ? "/dashboard" : "/auth"} className="btn-secondary px-10 py-5 rounded-2xl border-white/20 hover:bg-white/10 uppercase font-black tracking-widest text-[10px]">
                {user ? "MY DASHBOARD" : "CREATE ACCOUNT"}
              </Link>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Featured Games */}
      <section id="games" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-display">READY FOR TOP-UP</h2>
            <div className="h-1.5 w-24 bg-brand-primary rounded-full" />
          </div>
          <Link to="/" className="inline-flex items-center gap-2 group text-xs font-black uppercase tracking-widest text-brand-primary">
            Browse All Games
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {games.length > 0 ? (
            games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link to={`/game/${game.id}`} className="group block relative">
                  <div className="glass-card overflow-hidden rounded-[2rem] border-white/5 group-hover:border-brand-primary/50 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={game.image} 
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent" />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-brand-primary rounded-lg text-[8px] font-black uppercase tracking-widest text-white transform -rotate-1 shadow-lg">
                        {game.tags?.[0] || 'HOT'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5">
                       <p className="text-[8px] font-black text-brand-primary uppercase tracking-widest mb-1">
                         {game.category}
                       </p>
                       <h3 className="text-lg font-black text-white uppercase tracking-tight truncate font-display">
                         {game.name}
                       </h3>
                       <div className="mt-3 flex items-center justify-between">
                          <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Instant Delivery</span>
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                             <ChevronRight className="w-3 h-3 text-white" />
                          </div>
                       </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                <Star className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest">No games available currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* Instructions / How it Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display">HOW TO TOP-UP</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">Get your game currency in three simple steps. Safe, fast, and secure.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent -z-10" />
          
          {[
            { step: '01', title: 'Select Game', desc: 'Browse our extensive catalog and pick your favorite game.' },
            { step: '02', title: 'Enter Details', desc: 'Provide your Player ID and select your desired package.' },
            { step: '03', title: 'Pay & Receive', desc: 'Complete payment via bKash/Nagad and get instant delivery.' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center space-y-6 group"
            >
              <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] border-2 border-brand-primary/20 flex items-center justify-center mx-auto group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                <span className="text-2xl font-black">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Stats Counter (Animated) */}
      <section className="bg-brand-primary/10 border-y border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'DELIVERED ITEMS', value: '1.2M+' },
            { label: 'SECURE TRANSIT', value: '100%' },
            { label: 'SUPPORT AGENTS', value: '24/7' },
            { label: 'HAPPY GAMERS', value: '500K+' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
              <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/[0.02] -skew-y-3 origin-right" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
             <h4 className="text-brand-primary text-xs font-black uppercase tracking-[0.3em]">The ZUS Standard</h4>
             <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter font-display">ENGINEERED FOR GAMERS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent border border-white/5 hover:border-brand-primary/30 transition-all relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all" />
                
                <div className="w-16 h-16 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center mb-8 border border-brand-primary/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.description}</p>
                
                <div className="mt-8 h-1 w-12 bg-brand-primary/30 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Community */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Orders Banner */}
          <div className="glass-card group p-2 rounded-[2rem] flex items-center overflow-hidden border-white/10 hover:border-brand-primary/30 transition-all bg-brand-primary/5">
            <div className="bg-brand-primary/10 text-brand-primary px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] border-r border-white/10 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Live Feed
            </div>
            <div className="flex-grow whitespace-nowrap overflow-hidden relative">
              <motion.div 
                animate={{ x: [0, -1200] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="flex gap-20 py-5 px-12 text-[11px] font-black uppercase tracking-widest text-gray-500"
              >
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-white">Player_402{i}</span>
                    <span className="text-brand-primary/60">processed</span>
                    <span className="text-gray-200">1,200 Credits</span>
                  </div>
                ))}
              </motion.div>
              {/* Fade masks */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-dark to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-dark to-transparent z-10" />
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-[2rem] border-white/10 flex items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-dark bg-white/10 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Trust Community</p>
                   <p className="text-sm font-bold">Over 50K Verified Sales</p>
                </div>
             </div>
             <ShieldCheck className="w-8 h-8 text-brand-primary opacity-20" />
          </div>
        </div>
      </section>

    </motion.div>
  );
}
