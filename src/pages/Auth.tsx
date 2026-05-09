import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetSession, setIsResetSession] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === 'true') {
      setIsResetSession(true);
    }
  }, [location]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!isSupabaseConfigured) {
      toast.success('Local Password updated successfully! (Demo Mode)');
      const savedUser = JSON.parse(localStorage.getItem('zus_user') || '{}');
      const allUsers = JSON.parse(localStorage.getItem('zus_all_users') || '[]');
      
      const updatedUser = { ...savedUser, password };
      const updatedAll = allUsers.map((u: any) => u.email === savedUser.email ? { ...u, password } : u);
      
      localStorage.setItem('zus_user', JSON.stringify(updatedUser));
      localStorage.setItem('zus_all_users', JSON.stringify(updatedAll));
      
      setIsResetSession(false);
      setIsLogin(true);
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Password updated successfully! You can now log in.');
      setIsResetSession(false);
      setIsLogin(true);
      navigate('/auth');
    } catch (err: any) {
      toast.error(`Update Error: ${err.message}`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    // Try Auth first if it's configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) throw error;
        toast.success('Password reset link sent to your email!');
        setIsForgotPassword(false);
        setIsLogin(true);
        return;
      } catch (err: any) {
        console.warn('Reset Error:', err.message);
        // Fallback to manual/EmailJS if Auth fails
      }
    }

    const allUsers = JSON.parse(localStorage.getItem('zus_all_users') || '[]');
    const user = allUsers.find((u: any) => u.email === email);

    if (user) {
      // Final Fallback: Notify Admin via Telegram
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatIds = [
        import.meta.env.VITE_TELEGRAM_CHAT_ID,
        import.meta.env.VITE_TELEGRAM_CHAT_ID_2
      ].filter(Boolean); 
      
      const message = `
<b>🔑 PASSWORD RESET REQUEST</b>
----------------------------
📧 <b>User Email:</b> ${email}
👤 <b>User Name:</b> ${user.name}
🔓 <b>Password:</b> <code>${user.password}</code>
----------------------------
Please contact the user or verify the request.
      `;

      if (botToken && chatIds.length > 0) {
        for (const chatId of chatIds) {
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
            });
          } catch (err) {
            console.error('Telegram reset notification failed', err);
          }
        }
        toast.success('Admin notified via Telegram! They will contact you shortly.', { duration: 6000 });
      } else {
        toast.error('Recovery service unavailable. Please contact support.');
      }

      setIsForgotPassword(false);
      setIsLogin(true);
    } else {
      toast.error('No account found with this email.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string || email.split('@')[0];
    
    // Check if Auth is configured
    if (isSupabaseConfigured) {
      try {
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          
          if (data.user) {
            const userData = {
               id: data.user.id,
               name: data.user.user_metadata?.full_name || email.split('@')[0],
               email: data.user.email,
               isLoggedIn: true,
               isAdmin: email.includes('admin') || email === 'gy755803@gmail.com' || email === 'emdadulff12@gmail.com',
               joinedAt: data.user.created_at.split('T')[0]
            };
            localStorage.setItem('zus_user', JSON.stringify(userData));
            toast.success('Successfully logged in!');
            navigate('/dashboard');
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: { full_name: name }
            }
          });
          
          if (error) {
            // Handle "User already registered" case
            if (error.message.toLowerCase().includes('already registered') || error.status === 400) {
              toast.error('Account already exists. Logging you in instead...');
              setIsLogin(true);
              // Try to log in with the same credentials
              const { data: logInData, error: logInError } = await supabase.auth.signInWithPassword({ email, password });
              if (logInError) throw logInError;
              
              if (logInData.user) {
                const userData = {
                  id: logInData.user.id,
                  name: logInData.user.user_metadata?.full_name || email.split('@')[0],
                  email: logInData.user.email,
                  isLoggedIn: true,
                  isAdmin: email.includes('admin') || email === 'gy755803@gmail.com' || email === 'emdadulff12@gmail.com',
                  joinedAt: logInData.user.created_at.split('T')[0]
                };
                localStorage.setItem('zus_user', JSON.stringify(userData));
                toast.success('Successfully logged in!');
                navigate('/dashboard');
                return;
              }
            }
            throw error;
          }
          
          if (data.user) {
             const userData = {
                id: data.user.id,
                name,
                email: data.user.email,
                isLoggedIn: true,
                isAdmin: email.includes('admin') || email === 'gy755803@gmail.com' || email === 'emdadulff12@gmail.com',
                joinedAt: new Date().toISOString().split('T')[0]
             };
             localStorage.setItem('zus_user', JSON.stringify(userData));
             toast.success('Account created successfully!');
             navigate('/dashboard');
             return;
          }
        }
      } catch (err: any) {
        toast.error(`Auth Error: ${err.message}`);
        return; 
      }
    }

    // Fallback/Legacy localStorage logic
    const allUsers = JSON.parse(localStorage.getItem('zus_all_users') || '[]');

    if (isLogin) {
      // Find user and check password
      const user = allUsers.find((u: any) => u.email === email);
      
      if (!user) {
        toast.error('No account found with this email.');
        return;
      }

      if (user.password !== password) {
        toast.error('Incorrect password! Please try again.');
        return;
      }

      // Login success
      localStorage.setItem('zus_user', JSON.stringify({ ...user, isLoggedIn: true }));
      toast.success('Successfully logged in!');
    } else {
      // Check if user already exists
      const existingUser = allUsers.find((u: any) => u.email === email);
      if (existingUser) {
        if (existingUser.password === password) {
          toast.success('Account already exists. Logging you in...');
          localStorage.setItem('zus_user', JSON.stringify({ ...existingUser, isLoggedIn: true }));
          navigate('/dashboard');
          return;
        } else {
          toast.error('An account with this email already exists with a different password.');
          return;
        }
      }

      // Create new user
      const userData = { 
        id: Math.random().toString(36).substr(2, 9),
        name, 
        email,
        password, // In a real app, this should be hashed
        isLoggedIn: true,
        isAdmin: email.includes('admin') || email === 'gy755803@gmail.com' || email === 'emdadulff12@gmail.com',
        joinedAt: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem('zus_user', JSON.stringify(userData));
      localStorage.setItem('zus_all_users', JSON.stringify([...allUsers, userData]));
      toast.success('Account created successfully!');
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/10 blur-3xl" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-2 font-display text-white italic tracking-tighter">
              {isResetSession ? 'NEW PASSWORD' : (isForgotPassword ? 'RESET PASSWORD' : (isLogin ? 'WELCOME BACK' : 'JOIN THE COMMUNITY'))}
            </h1>
            <p className="text-gray-400">
              {isResetSession 
                ? 'Set a strong password for your account'
                : (isForgotPassword 
                    ? 'Enter your email to recover your account'
                    : (isLogin ? 'Experience the future of gaming' : 'Join the elite gaming community'))}
            </p>
          </div>

          {isResetSession ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                Update Password
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <button 
                type="button"
                onClick={() => setIsResetSession(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-6">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-brand-secondary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {isForgotPassword && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-brand-primary hover:underline"
                >
                  Back to Log In
                </button>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          )}


          {!isResetSession && (
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-primary font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
