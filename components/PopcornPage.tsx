
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CalendarCheck } from 'lucide-react';

interface PopcornPageProps {
  initialData?: any;
  onBack: () => void;
  onDataChange: (data: any) => void;
  onFinalize: (data: any) => void;
}

interface PopcornItem {
  id: number;
  name: string;
  qty: number | '';
  price: number;
}

export const PopcornPage: React.FC<PopcornPageProps> = ({ initialData, onBack, onDataChange, onFinalize }) => {
  const [items, setItems] = useState<PopcornItem[]>(initialData?.items || [
    { id: 1, name: 'Sachet', qty: 0, price: 200 },
    { id: 2, name: 'Petit pot', qty: 0, price: 500 },
    { id: 3, name: 'Grand pot', qty: 0, price: 1000 },
    { id: 4, name: 'Barbapapa', qty: 0, price: 200 },
    { id: 5, name: 'Lotus', qty: 0, price: 500 },
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
    <div className="bg-[#fffdf5] rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in fade-in h-[calc(100vh-180px)] flex flex-col border border-amber-100">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 select-none">
        <span className="absolute top-10 left-10 text-8xl rotate-12">🍿</span>
        <span className="absolute bottom-20 right-10 text-9xl rotate-45 opacity-20">🍿</span>
      </div>

      <div className="p-6 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-sm rounded-full active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Caisse Popcorn</h2>
            <div className="flex items-center gap-1.5 opacity-80">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto relative z-10 no-scrollbar">
        <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-5 mb-6 flex items-center justify-between border border-emerald-200 shadow-sm">
          <div>
            <span className="text-emerald-800 font-bold uppercase text-[10px] tracking-wider block mb-1">Versement Espèces</span>
            <span className="text-[10px] text-emerald-600 font-medium opacity-70">(Net en caisse)</span>
          </div>
          <span className="text-2xl font-black text-emerald-600">{formatCurrency(versement)}</span>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const subTotal = (typeof item.qty === 'number' ? item.qty : 0) * (item.price || 0);
            return (
              <div key={item.id} className="bg-white/90 border border-amber-100 rounded-[1.5rem] p-4 flex flex-col shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide">{item.name}</h3>
                  <span className={`text-[11px] font-mono font-black ${subTotal > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                    {formatCurrency(subTotal)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase block mb-1 text-center">Qté</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={item.qty || ''}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].qty = e.target.value === '' ? '' : parseInt(e.target.value);
                        setItems(newItems);
                      }}
                      className="w-full bg-amber-50/50 border border-amber-100 rounded-xl py-2 text-center text-sm font-black text-amber-900 outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase block mb-1 text-center">P.U</span>
                    <input
                      type="number"
                      min="0"
                      value={item.price || ''}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].price = parseInt(e.target.value) || 0;
                        setItems(newItems);
                      }}
                      className="w-full bg-white border border-amber-100 rounded-xl py-2 text-center text-sm font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-amber-900/5 backdrop-blur-md rounded-[1.5rem] p-5 space-y-4 mb-6">
            <div className="flex justify-between items-center border-b border-amber-200/40 pb-4">
                <span className="font-black text-amber-800/40 text-[10px] uppercase tracking-widest">CA Total</span>
                <span className="font-black text-xl text-amber-900">{formatCurrency(totalGeneral)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-200/50">
                    <span className="text-sky-700 font-black text-[10px] block mb-1 uppercase tracking-tighter">Wave</span>
                    <input type="number" value={wave} onChange={(e) => setWave(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-white border border-sky-100 rounded-xl py-1 px-2 text-right font-black text-sky-800 text-sm outline-none" />
                </div>
                <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-200/50">
                    <span className="text-orange-700 font-black text-[10px] block mb-1 uppercase tracking-tighter">Orange</span>
                    <input type="number" value={orange} onChange={(e) => setOrange(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-white border border-orange-100 rounded-xl py-1 px-2 text-right font-black text-orange-800 text-sm outline-none" />
                </div>
            </div>
        </div>

        <button onClick={handleFinalize} className="w-full py-5 bg-amber-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95 transition-all">
          Finaliser Popcorn
        </button>
      </div>
    </div>
  );
};
