
import React from 'react';
import { ArrowLeft, ChevronRight, LayoutDashboard, Waves, ShoppingBag, Popcorn } from 'lucide-react';
import { DailyHistory } from '../App';

interface HistoryPageProps {
  onBack: () => void;
  historyItems: DailyHistory[];
  onSelectItem: (item: DailyHistory) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, historyItems, onSelectItem }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in fade-in h-[calc(100vh-180px)] flex flex-col">
      <div className="p-6 bg-gradient-to-r from-slate-700 to-slate-800 text-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-sm rounded-full active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Archives Journalières</h2>
            <p className="text-slate-300 text-xs font-medium opacity-90">Rapports consolidés par jour</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto no-scrollbar">
         <div className="space-y-4">
            {historyItems.map((item, index) => (
              <div 
                key={item.dateKey} 
                onClick={() => onSelectItem(item)}
                className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-[0.98]"
              >
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <h3 className="font-bold text-slate-800 text-sm">{item.displayDate}</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Validé</span>
                 </div>
                 
                 <div className="flex items-center gap-3 mb-4">
                    {item.activities.pool && <Waves className="w-4 h-4 text-cyan-500" />}
                    {item.activities.maillot && <ShoppingBag className="w-4 h-4 text-fuchsia-500" />}
                    {item.activities.popcorn && <Popcorn className="w-4 h-4 text-amber-500" />}
                 </div>

                 <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Chiffre d'Affaire</span>
                       <span className="font-mono font-black text-slate-900 text-lg">{new Intl.NumberFormat('fr-FR').format(item.total)} F</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                 </div>
              </div>
            ))}
            
            {historyItems.length === 0 && (
              <div className="text-center py-20 text-slate-300 italic text-sm">Aucun historique disponible</div>
            )}
         </div>
      </div>
    </div>
  );
};
