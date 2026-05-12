import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, MessageCircle, Phone, ChevronDown, Search, Zap, LifeBuoy } from 'lucide-react';
import { cn } from '../lib/utils';

export function Support() {
  const [supportData, setSupportData] = useState<any>(null);
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zus_support');
    if (saved) {
      try {
        setSupportData(JSON.parse(saved));
      } catch (e) {
        setSupportData({
          title: 'ZUS SUPPORT CENTER',
          description: 'We are here to help you 24/7 with any issues.',
          telegram: '@zustopup',
          whatsapp: '+8801700000000',
          faqs: []
        });
      }
    } else {
      // Fallback default
      setSupportData({
        title: 'ZUS SUPPORT CENTER',
        description: 'We are here to help you 24/7 with any issues.',
        telegram: '@zustopup',
        whatsapp: '+8801700000000',
        faqs: [
          { id: '1', question: 'How long does top-up take?', answer: 'Most top-ups are instant, but some may take 5-30 minutes.' },
          { id: '2', question: 'Is it safe?', answer: 'Yes, we use secure gateways and verified diamond sources.' }
        ]
      });
    }
  }, []);

  if (!supportData) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <LifeBuoy className="w-3 h-3" />
            Help Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-display tracking-tight mb-6 uppercase"
          >
            {supportData.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {supportData.description}
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <motion.a
            href={`https://t.me/${supportData.telegram?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 flex items-center gap-6 group hover:border-brand-primary/40 transition-all active:scale-95"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-1">Telegram</h3>
              <p className="text-gray-500 text-sm font-bold">{supportData.telegram}</p>
            </div>
          </motion.a>

          <motion.a
            href={`https://wa.me/${supportData.whatsapp?.replace(/\+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 flex items-center gap-6 group hover:border-green-500/40 transition-all active:scale-95"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-1">WhatsApp</h3>
              <p className="text-gray-500 text-sm font-bold">{supportData.whatsapp}</p>
            </div>
          </motion.a>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl font-black uppercase tracking-tight mb-8 text-center md:text-left flex items-center gap-3"
          >
            <HelpCircle className="w-6 h-6 text-brand-primary" />
            Frequently Asked Questions
          </motion.h2>

          <div className="grid gap-4">
            {supportData.faqs?.map((faq: any, index: number) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden"
              >
                <div 
                  onClick={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                  className={cn(
                    "glass-card p-6 cursor-pointer transition-all flex items-center justify-between group",
                    activeFAQ === faq.id ? "border-brand-primary/30 bg-brand-primary/5" : "hover:border-white/20"
                  )}
                >
                  <span className="font-black uppercase tracking-tight text-sm md:text-base">{faq.question}</span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform duration-300", activeFAQ === faq.id && "rotate-180 text-brand-primary")} />
                </div>
                {activeFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white/5 border-l-2 border-brand-primary rounded-b-2xl text-gray-400 text-sm leading-relaxed mb-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Still need help? */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-10 glass-card bg-brand-primary/5 border border-brand-primary/20 rounded-[2rem] text-center"
        >
          <Zap className="w-12 h-12 text-brand-primary mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">STILL NEED ASSISTANCE?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Our dedicated support team is ready to assist you with any questions or concerns.</p>
          <button 
            onClick={() => window.open(`https://wa.me/${supportData.whatsapp?.replace(/\+/g, '')}`, '_blank')}
            className="btn-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
          >
            Live Chat Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
