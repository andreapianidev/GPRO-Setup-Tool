// GPRO Setup Tool - Demo notice: banner and onboarding with WhatsApp contact

import React, { useEffect, useState } from 'react';
import { MessageCircle, Info, X, UserCog, Database, Wrench } from 'lucide-react';

export const WHATSAPP_URL =
  'https://wa.me/393516248936?text=' +
  encodeURIComponent("Hi Andrea, I tried the GPRO Setup Tool demo and I'd like my personalized version.");

const ONBOARDING_KEY = 'gpro_demo_onboarding_seen';

export const WhatsAppButton: React.FC<{ className?: string; label?: string }> = ({
  className = '',
  label = 'Get your personalized version on WhatsApp',
}) => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors ${className}`}
  >
    <MessageCircle className="w-5 h-5" />
    {label}
  </a>
);

// Thin strip shown on every page of the app
export const DemoBanner: React.FC = () => (
  <div className="mb-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
    <div className="flex items-start gap-2 text-sm text-yellow-100 flex-1">
      <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <span>
        <strong>Demo version.</strong> Sample data, not real calculations, and some screens are still in Italian.
        The real tool is set up and personalized for each GPRO manager.
      </span>
    </div>
    <WhatsAppButton className="px-4 py-2 text-sm whitespace-nowrap" label="Contact me on WhatsApp" />
  </div>
);

// Welcome dialog shown the first time someone enters the demo
export const DemoOnboarding: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  const points = [
    {
      icon: <Database className="w-5 h-5 text-yellow-400" />,
      text: 'This demo runs on sample data. The numbers you see show how the tool works, they are not calculated on your team.',
    },
    {
      icon: <UserCog className="w-5 h-5 text-blue-400" />,
      text: 'The real version is personalized for each player: setup calculated on your own driver, car and tracks, plus fuel and tyre strategy.',
    },
    {
      icon: <Wrench className="w-5 h-5 text-red-400" />,
      text: 'It runs as your own private instance, in English, and I can adapt features to the way you play.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-800 p-6 shadow-2xl">
        <button
          onClick={close}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Welcome to the demo</h2>
        <p className="text-slate-300 mb-5">
          Have a look around: dashboard, setup calculator, strategy and post-race analysis.
        </p>

        <div className="space-y-4 mb-6">
          {points.map((p, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
              <p className="text-slate-300 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        <p className="text-slate-200 text-sm mb-4">
          For info, prices, or to get your personalized version, write to me on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <WhatsAppButton className="px-5 py-3 flex-1" label="Write on WhatsApp" />
          <button
            onClick={close}
            className="px-5 py-3 rounded-xl border border-slate-500 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            Explore the demo
          </button>
        </div>
      </div>
    </div>
  );
};
