import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Rocket, Heart } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { toast } from 'sonner';

export const Contacts: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('send_button'));
  };

  return (
    <section id="contacts" className="py-16 pt-24 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}><Send className="w-4 h-4 text-[#F5569B]" /></AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">{t('contacts_label')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-[#F5569B] via-[#A88AED] to-[#1355B2] bg-clip-text text-transparent">{t('contacts_title')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#F5569B]/20 to-[#F5569B]/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-[#F5569B]" />
              </div>
              <h3 className="text-xl font-black mb-3 text-black">{t('faq1_title')}</h3>
              <p className="text-sm text-black/80 leading-relaxed">{t('faq1_text')}</p>
            </div>
            <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#D4E157]/30 to-[#D4E157]/20 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-black/70" />
              </div>
              <h3 className="text-xl font-black mb-3 text-black">{t('faq2_title')}</h3>
              <p className="text-sm text-black/80 leading-relaxed">{t('faq2_text')}</p>
            </div>
            <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#1355B2]/20 to-[#5B7FDB]/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-[#1355B2]" />
              </div>
              <h3 className="text-xl font-black mb-3 text-black">{t('faq3_title')}</h3>
              <p className="text-sm text-black/80 leading-relaxed">{t('faq3_text')}</p>
            </div>
            <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#A88AED]/20 to-[#C5B3F5]/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-[#A88AED]" />
              </div>
              <h3 className="text-xl font-black mb-3 text-black">{t('faq4_title')}</h3>
              <p className="text-sm text-black/80 leading-relaxed">{t('faq4_text')}</p>
            </div>
          </div>
          <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#F5569B]/30 via-[#A88AED]/20 to-[#1355B2]/20 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2 text-black">{t('write_me')}</h3>
              <p className="text-sm text-black/80 mb-1">Email: your@email.com</p>
              <p className="text-sm text-black/80">Instagram: @your_instagram</p>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-2 text-black">{t('request_format')}</h4>
              <p className="text-sm text-black/80 leading-relaxed">{t('request_format_text')}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder={t('name_placeholder')} className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border-2 border-white/50 focus:border-[#A88AED] outline-none transition-colors" required />
              <input type="email" placeholder={t('email_placeholder')} className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border-2 border-white/50 focus:border-[#A88AED] outline-none transition-colors" required />
              <textarea placeholder={t('message_placeholder')} className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border-2 border-white/50 focus:border-[#A88AED] outline-none transition-colors h-32 resize-none" required />
              <button type="submit" className="w-full p-4 rounded-2xl bg-white text-[#F5569B] font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                {t('send_button')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
