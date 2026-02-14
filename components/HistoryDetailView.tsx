
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Waves, Popcorn, ShoppingBag, ChevronRight, Watch } from 'lucide-react';
import { DailyHistory } from '../App';

interface HistoryDetailViewProps {
  item: DailyHistory;
  onBack: () => void;
}

export const HistoryDetailView: React.FC<HistoryDetailViewProps> = ({ item, onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' F';

  const sections = [
    { id: 'pool', name: 'Piscine', icon: <Waves />, color: 'text-cyan-500', bg: 'bg-cyan-50', data: item.activities.pool },
    { id: 'maillot', name: 'Boutique Maillot', icon: <ShoppingBag />, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', data: item.activities.maillot },
    { id: 'popcorn', name: 'Caisse Popcorn', icon: <Popcorn />, color: 'text-amber-500', bg: 'bg-amber-50', data: item.activities.popcorn },
    { id: 'bracelets', name: 'Stock Bracelets', icon: <Watch />, color: 'text-violet-500', bg: 'bg-violet-50', data: item.activities.bracelets },
  ].filter(s => s.data);

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in zoom-in-95 h-[calc(100vh-180px)] flex flex-col">
      <div className="p-6 bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              Archives du Jour
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{item.displayDate}</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total CA Global</span>
           <span className="text-2xl font-black text-white">{formatCurrency(item.total)}</span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto no-scrollbar space-y-4">
         {sections.map((section) => (
            <div key={section.id} className={`${section.bg} rounded-2xl border border-white p-4 shadow-sm transition-all`}>
               <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl bg-white shadow-sm ${section.color}`}>{section.icon}</div>
                     <div>
                        <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">{section.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400">
                          Archivé • {section.id === 'bracelets' ? `${section.data.rows?.length || 0} couleurs` : formatCurrency(section.data.total)}
                        </p>
                     </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} />
               </div>

               {expandedSection === section.id && (
                  <div className="mt-4 pt-4 border-t border-white/50 animate-in slide-in-from-top-2 duration-300">
                     {section.id === 'bracelets' ? (
                       <div className="space-y-4">
                          <div className="grid grid-cols-4 text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                             <span>Couleur</span>
                             <span className="text-center">Qté S.</span>
                             <span className="text-center">Numérotation</span>
                             <span className="text-right">Reste</span>
                          </div>
                          {section.data.rows?.map((row: any, i: number) => (
                             <div key={i} className="grid grid-cols-4 items-center text-xs py-2 border-b border-slate-100/50 last:border-0">
                                <span className="font-bold text-slate-700">{row.color}</span>
                                <span className="text-center text-red-400 font-bold">{row.sortie || 0}</span>
                                <div className="text-[9px] font-mono text-slate-500 flex flex-col items-center">
                                   <span title="Nº Entrée">E: {row.nEntree || '-'}</span>
                                   <span title="Nº Sortie">S: {row.nSortie || '-'}</span>
                                </div>
                                <div className="text-right flex flex-col">
                                   <span className="font-black text-slate-900">{(row.entree || 0) - (row.sortie || 0)}</span>
                                   <span className="text-[8px] text-violet-500 font-mono">{row.nReste || '-'}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                     ) : (
                       <>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 px-1">
                            <span>Article / Qty</span>
                            <div className="flex gap-8">
                                <span>P.U</span>
                                <span>Total</span>
                            </div>
                            </div>
                            {section.data.items?.map((subItem: any, i: number) => {
                            const qty = subItem.sold || subItem.qty || 0;
                            const price = subItem.price || 0;
                            const subTotal = qty * price;
                            return (
                                <div key={i} className="flex justify-between text-xs py-1 px-1 border-b border-slate-100/50 last:border-0">
                                    <span className="text-slate-500 font-medium truncate max-w-[120px]">
                                    {subItem.service || subItem.name || subItem.category} <span className="text-slate-900 font-bold ml-1">x{qty}</span>
                                    </span>
                                    <div className="flex gap-6 font-mono text-[10px]">
                                    <span className="text-slate-400">{price}</span>
                                    <span className="font-bold text-slate-700 min-w-[50px] text-right">{subTotal}F</span>
                                    </div>
                                </div>
                            );
                            })}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="bg-white/40 p-2 rounded-lg">
                            <span className="text-[8px] font-black text-slate-400 uppercase block">Wave</span>
                            <span className="text-xs font-bold text-slate-800">{formatCurrency(section.data.wave || 0)}</span>
                            </div>
                            <div className="bg-white/40 p-2 rounded-lg">
                            <span className="text-[8px] font-black text-slate-400 uppercase block">Orange</span>
                            <span className="text-xs font-bold text-slate-800">{formatCurrency(section.data.orange || 0)}</span>
                            </div>
                        </div>
                        <div className="mt-2 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex justify-between items-center">
                            <span className="text-[8px] font-black text-emerald-600 uppercase">Versement Cash Effectué</span>
                            <span className="text-xs font-black text-emerald-700">{formatCurrency(section.data.versement || 0)}</span>
                        </div>
                       </>
                     )}
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};
