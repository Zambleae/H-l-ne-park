
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, CalendarCheck } from 'lucide-react';

interface MaillotPageProps {
  initialData?: any;
  onBack: () => void;
  onDataChange: (data: any) => void;
  onFinalize: (data: any) => void;
}

interface MaillotItem {
  id: number;
  category: string;
  qty: number | '';
  price: number;
}

export const MaillotPage: React.FC<MaillotPageProps> = ({ initialData, onBack, onDataChange, onFinalize }) => {
  const [items, setItems] = useState<MaillotItem[]>(initialData?.items || [
    { id: 1, category: 'Homme', qty: 0, price: 1000 },
    { id: 2, category: 'Femme', qty: 0, price: 1000 },
    { id: 3, category: 'Enfant', qty: 0, price: 1000 },
  ]);

  const [wave, setWave] = useState<number | ''>(initialData?.wave || '');
  const [orange, setOrange] = useState<number | ''>(initialData?.orange || '');

  const totalGeneral = items.reduce((acc, item) => acc + ((typeof item.qty === 'number' ? item.qty : 0) * (item.price || 0)), 0);
  const waveAmount = typeof wave === 'number' ? wave : 0;
  const orangeAmount = typeof orange === 'number' ? orange : 0;
  const versement = totalGeneral - (waveAmount + orangeAmount);

  useEffect(() => {
    onDataChange({ items, wave, orange, total: totalGeneral, versement });
  }, [items, wave, orange]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' F';

  const handleFinalize = () => {
    onFinalize({ items, wave, orange, total: totalGeneral, versement });
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0a1a] via-[#1a0b2e] to-[#0a0510] rounded-[2.5rem] shadow-2xl overflow-hidden mx-4 mb-20 relative animate-in fade-in h-[calc(100vh-180px)] flex flex-col border border-violet-900/30">
      <div className="p-6 bg-white/5 backdrop-blur-md border-b border-white/10 text-white shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-white/10 backdrop-blur-sm rounded-2xl active:scale-90 border border-white/10"><ArrowLeft className="w-5 h-5 text-violet-200" /></button>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">Boutique Maillot <ShoppingBag className="w-4 h-4 text-fuchsia-400" /></h2>
              <div className="flex items-center gap-1.5 opacity-60">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto relative z-10 no-scrollbar">
        <div className="bg-emerald-500/10 backdrop-blur-xl rounded-[2rem] p-6 mb-6 flex items-center justify-between border border-emerald-500/20 shadow-xl">
          <div>
            <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.2em] block mb-1">Versement Espèces</span>
            <span className="text-[10px] text-emerald-300/40 font-medium">(Net collecté)</span>
          </div>
          <span className="text-2xl font-black text-emerald-400">{formatCurrency(versement)}</span>
        </div>

        <div className="overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-[2rem] shadow-2xl mb-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-4 text-[9px] font-bold uppercase text-violet-300/40 tracking-widest">Catégorie</th>
                <th className="p-2 text-center text-[9px] font-bold uppercase text-violet-300/40 tracking-widest w-[60px]">Qté</th>
                <th className="p-2 text-center text-[9px] font-bold uppercase text-violet-300/40 tracking-widest w-[80px]">P.U</th>
                <th className="p-4 text-right text-[9px] font-bold uppercase text-violet-300/40 tracking-widest">Sous-Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 text-xs font-semibold text-violet-100">{item.category}</td>
                  <td className="p-2">
                    <input type="number" min="0" value={item.qty} onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].qty = e.target.value === '' ? '' : parseInt(e.target.value);
                      setItems(newItems);
                    }} className="w-full text-center bg-white/5 border border-white/10 rounded-xl py-2 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  </td>
                  <td className="p-2">
                    <input type="number" min="0" value={item.price || ''} onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].price = parseInt(e.target.value) || 0;
                      setItems(newItems);
                    }} className="w-full text-center bg-white/5 border border-white/10 rounded-xl py-2 text-[11px] font-mono font-bold text-fuchsia-300 outline-none focus:ring-1 focus:ring-fuchsia-500" />
                  </td>
                  <td className="p-4 text-right text-xs font-black text-fuchsia-400 font-mono">{formatCurrency((typeof item.qty === 'number' ? item.qty : 0) * (item.price || 0)).replace(' F', '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-[2rem] p-6 space-y-6 border border-white/5 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/5 pb-5">
                <span className="font-bold text-violet-300/40 text-[10px] uppercase tracking-widest">CA Total</span>
                <span className="font-black text-2xl text-white">{formatCurrency(totalGeneral)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-sky-500/5 p-4 rounded-2xl border border-sky-500/20">
                    <span className="text-sky-400 font-bold text-[10px] uppercase block mb-1">Wave</span>
                    <input type="number" value={wave} onChange={(e) => setWave(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-black/40 border border-sky-500/20 rounded-xl py-2 px-3 text-right font-bold text-white text-sm outline-none" />
                </div>
                <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20">
                    <span className="text-orange-400 font-bold text-[10px] uppercase block mb-1">Orange</span>
                    <input type="number" value={orange} onChange={(e) => setOrange(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-black/40 border border-orange-500/20 rounded-xl py-2 px-3 text-right font-bold text-white text-sm outline-none" />
                </div>
            </div>
        </div>

        <button onClick={handleFinalize} className="w-full py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl mt-8 active:scale-95 transition-all">
          Finaliser Maillot
        </button>
      </div>
    </div>
  );
};
