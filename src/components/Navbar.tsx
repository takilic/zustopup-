import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, User, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Load auth state from localStorage
  const savedUser = localStorage.getItem('zus_user');
  let user = null;
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      localStorage.removeItem('zus_user');
    }
  }
  
  const isLoggedIn = !!user; 
  const isAdmin = user?.isAdmin || false;

  const navLinks = [
    { name: 'Games', path: '/', icon: Gamepad2 },
    { name: 'Dashboard', path: '/dashboard', icon: User, hidden: !isLoggedIn },
    { name: 'Admin', path: '/admin', icon: LayoutDashboard, hidden: !isAdmin },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-dark/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter neon-text">
              ZUS<span className="text-white">TOPUP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(link => !link.hidden).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-primary flex items-center gap-2",
                  location.pathname === link.path ? "text-brand-primary" : "text-gray-400"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="text-xs font-black uppercase text-brand-primary hover:underline hidden sm:block">
                    Admin Portal
                  </Link>
                )}
                <Link to="/dashboard" className="btn-primary flex items-center gap-2 !py-2 !px-5 text-xs font-black uppercase tracking-widest">
                  <User className="w-4 h-4" />
                  My Dashboard
                </Link>
              </div>
            ) : (
              <Link to="/auth" state={{ mode: 'signup' }} className="btn-primary flex items-center gap-2 !py-2 !px-5 text-xs font-black uppercase tracking-widest">
                <User className="w-4 h-4 text-white" />
                Account Create
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.filter(link => !link.hidden).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium text-gray-300 hover:text-brand-primary"
                >
                  <link.icon className="w-6 h-6" />
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <div className="space-y-2">
                   <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full flex items-center justify-center gap-2 font-black uppercase text-xs"
                  >
                    <User className="w-5 h-5" />
                    My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 font-black uppercase text-xs text-brand-primary py-2"
                    >
                      Admin Portal
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  state={{ mode: 'signup' }}
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2 font-black uppercase text-xs"
                >
                  <User className="w-5 h-5" />
                  Account Create
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
