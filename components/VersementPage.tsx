
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Banknote, Smartphone, ReceiptText } from 'lucide-react';

interface VersementPageProps {
  onBack: () => void;
  aggregatedData?: {
    cash: number;
    orange: number;
    wave: number;
  };
}

export const VersementPage: React.FC<VersementPageProps> = ({ 
  onBack, 
  aggregatedData = { cash: 0, orange: 0, wave: 0 } 
}) => {
  const [especes, setEspeces] = useState<number>(aggregatedData.cash);
  const [orangeMoney, setOrangeMoney] = useState<number>(aggregatedData.orange);
  const [wave, setWave] = useState<number>(aggregatedData.wave);

  // Sync state with props when they change
  useEffect(() => {
    if (aggregatedData) {
      setEspeces(aggregatedData.cash);
      setOrangeMoney(aggregatedData.orange);
      setWave(aggregatedData.wave);
    }
  }, [aggregatedData]);

  const total = especes + orangeMoney + wave;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Versement du Jour</h2>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Récapitulatif Automatique</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto space-y-6 no-scrollbar">
        {/* Total Card */}
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/10 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Recettes du Jour</p>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black tracking-tighter text-emerald-400">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
            <ReceiptText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                Ce rapport agrège automatiquement les montants validés dans les modules Piscine, Popcorn et Maillot.
            </p>
        </div>

        {/* Inputs (Read-only or adjusted) */}
        <div className="space-y-4">
          <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-3xl space-y-2 group transition-all hover:bg-white hover:shadow-md hover:border-emerald-100">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2 mb-1">
              <Banknote className="w-4 h-4 text-emerald-500" />
              Espèces (Total Cash)
            </label>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-800">{formatCurrency(especes).replace(' FCFA', '')}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Piscine + Popcorn + Maillot</span>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-3xl space-y-2 group transition-all hover:bg-white hover:shadow-md hover:border-orange-100">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-orange-500" />
              Orange Money (Total)
            </label>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-800">{formatCurrency(orangeMoney).replace(' FCFA', '')}</span>
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-orange-500/20">OM</div>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-3xl space-y-2 group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-blue-500" />
              Wave Pay (Total)
            </label>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-800">{formatCurrency(wave).replace(' FCFA', '')}</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-blue-500/20">W</div>
            </div>
          </div>
        </div>

        <button className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-xl shadow-emerald-900/10 active:scale-95 transition-all mt-4 border border-emerald-500">
          Clôturer la Caisse
        </button>
      </div>
    </div>
  );
};
