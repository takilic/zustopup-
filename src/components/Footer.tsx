import { Gamepad2, Globe, Play, ExternalLink, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded flex items-center justify-center">
                <Gamepad2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter neon-text">
                ZUS<span className="text-white">TOPUP</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              ZUS TopUp is the most trusted and fastest gaming marketplace in Bangladesh. 
              Get your game credits instantly with secure payment methods.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-brand-primary transition-colors">Browse Games</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-primary transition-colors">My Orders</Link></li>
              <li><Link to="/support" className="hover:text-brand-primary transition-colors">Support Center</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Connect With Us</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors text-white">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors text-white">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors text-white">
                <Globe className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Accepted Payments: bKash, Nagad
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ZUS TopUp. Powered by Gamers.</p>
        </div>
      </div>
    </footer>
  );
}
