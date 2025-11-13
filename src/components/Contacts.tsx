import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { toast } from 'sonner';

export const Contacts: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contacts" className="py-16 relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-[#F5569B] mb-4">
            <AnimatedIcon delay={0.1}><Mail className="w-4 h-4 text-[#F5569B]" /></AnimatedIcon>
            <span className="text-sm font-bold text-[#F5569B] uppercase tracking-wider">{t('contact_label')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-[#F5569B] via-[#A88AED] to-[#1355B2] bg-clip-text text-transparent">{t('contact_title')}</h2>
        </div>

        <div className="max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl bg-white">
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Message sent!'); }}>
            <input type="text" placeholder={t('contact_form_name')} className="w-full p-4 mb-4 rounded-xl border-2 border-gray-200 focus:border-[#F5569B] outline-none" />
            <input type="email" placeholder={t('contact_form_email')} className="w-full p-4 mb-4 rounded-xl border-2 border-gray-200 focus:border-[#F5569B] outline-none" />
            <textarea placeholder={t('contact_form_message')} rows={5} className="w-full p-4 mb-4 rounded-xl border-2 border-gray-200 focus:border-[#F5569B] outline-none resize-none" />
            <button type="submit" className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5569B] to-[#A88AED] text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
              {t('contact_form_submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
