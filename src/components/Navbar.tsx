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
  const user = savedUser ? JSON.parse(savedUser) : null;
  
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
              <Link to="/dashboard" className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center hover:border-brand-primary transition-colors">
                <User className="w-5 h-5 text-gray-400" />
              </Link>
            ) : (
              <Link to="/auth" className="btn-primary flex items-center gap-2 !py-2 !px-5 text-sm">
                <LogIn className="w-4 h-4 text-white" />
                Sign In
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
              {!isLoggedIn && (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
