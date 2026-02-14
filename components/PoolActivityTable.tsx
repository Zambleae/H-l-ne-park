
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Watch, CalendarCheck } from 'lucide-react';

interface PoolActivityTableProps {
  initialData?: any;
  onBack: () => void;
  onNavigateToBracelets: () => void;
  onDataChange: (data: any) => void;
  onFinalize: (data: any) => void;
}

interface ServiceItem {
  service: string;
  sold: number;
  price: number;
}

export const PoolActivityTable: React.FC<PoolActivityTableProps> = ({ 
  initialData, 
  onBack, 
  onNavigateToBracelets, 
  onDataChange, 
  onFinalize 
}) => {
  const [items, setItems] = useState<ServiceItem[]>(initialData?.items || [
    { service: 'Piscine', sold: 0, price: 500 },
    { service: 'Forfait Piscine', sold: 0, price: 4500 },
    { service: 'Forfait Piscine 2', sold: 0, price: 4000 },
    { service: 'Visite', sold: 0, price: 200 },
    { service: 'Terrain Foot', sold: 0, price: 3000 },
    { service: 'Forfait Terrain', sold: 0, price: 25000 },
    { service: 'Événement', sold: 0, price: 50000 },
    { service: 'Anniversaire', sold: 0, price: 15000 },
    { service: 'Cours Natation', sold: 0, price: 1000 },
    { service: 'Baby-foot', sold: 0, price: 100 },
  ]);

  const [orange, setOrange] = useState<number>(initialData?.orange || 0);
  const [wave, setWave] = useState<number>(initialData?.wave || 0);
  const [depenses, setDepenses] = useState<number>(initialData?.depenses || 0);
  const [depenseNote, setDepenseNote] = useState<string>(initialData?.depenseNote || '');

  const processedData = items.map(item => ({ ...item, total: (item.sold || 0) * (item.price || 0) }));
  const grandTotal = processedData.reduce((acc, curr) => acc + curr.total, 0);
  const versement = grandTotal - (orange + wave + depenses);

  useEffect(() => {
    onDataChange({ items, orange, wave, depenses, depenseNote, total: grandTotal, versement });
  }, [items, orange, wave, depenses, depenseNote]);

  const handleFinalize = () => {
    onFinalize({ items, orange, wave, depenses, depenseNote, total: grandTotal, versement });
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR').format(value) + ' F';

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in fade-in slide-in-from-bottom-8 duration-700 h-[calc(100vh-180px)] flex flex-col">
       <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 bg-white/20 rounded-full active:scale-95 transition-all"><ArrowLeft className="w-5 h-5" /></button>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Activité Piscine</h2>
                <div className="flex items-center gap-1.5 opacity-80">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <button onClick={onNavigateToBracelets} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl border border-white/20 active:scale-95">
              <Watch className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Bracelets</span>
            </button>
          </div>
       </div>

       <div className="overflow-auto flex-1 no-scrollbar">
         <table className="w-full text-left border-collapse">
           <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
             <tr>
               <th className="p-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider">Service</th>
               <th className="p-2 text-center text-slate-500 font-bold uppercase text-[9px] tracking-wider w-[60px]">Qté</th>
               <th className="p-2 text-center text-slate-500 font-bold uppercase text-[9px] tracking-wider w-[80px]">P.U</th>
               <th className="p-4 text-right text-slate-500 font-bold uppercase text-[9px] tracking-wider">Total</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {processedData.map((row, index) => (
               <tr key={index} className="hover:bg-slate-50 transition-colors">
                 <td className="p-4 font-bold text-slate-700 text-xs">{row.service}</td>
                 <td className="p-2 text-center">
                   <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={row.sold || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].sold = parseInt(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-400"
                   />
                 </td>
                 <td className="p-2 text-center">
                   <input
                    type="number"
                    min="0"
                    value={row.price || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].price = parseInt(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    className="w-full text-center bg-transparent border border-transparent rounded-lg py-1.5 text-[10px] font-mono font-bold text-slate-400 outline-none focus:border-slate-200"
                   />
                 </td>
                 <td className="p-4 text-right font-black text-slate-900 font-mono text-xs">
                   {formatCurrency(row.total).replace(' F', '')}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         <div className="p-6 space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-center text-slate-900 font-bold text-sm p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
               <span className="text-[10px] uppercase tracking-wider text-slate-400">Versement Cash</span>
               <span className="text-xl font-black text-emerald-600">{formatCurrency(versement)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <span className="text-[9px] font-bold text-orange-600 block mb-1 uppercase tracking-widest">Orange Money</span>
                  <input type="number" value={orange || ''} onChange={(e) => setOrange(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-orange-200 rounded-xl py-2 px-3 text-right text-xs font-bold text-orange-800 outline-none" />
               </div>
               <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                  <span className="text-[9px] font-bold text-sky-600 block mb-1 uppercase tracking-widest">Wave Pay</span>
                  <input type="number" value={wave || ''} onChange={(e) => setWave(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-sky-200 rounded-xl py-2 px-3 text-right text-xs font-bold text-sky-800 outline-none" />
               </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dépenses</span>
                  <input type="number" value={depenses || ''} onChange={(e) => setDepenses(parseFloat(e.target.value) || 0)} className="w-28 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-right text-xs font-bold text-slate-800 outline-none" />
               </div>
               <textarea value={depenseNote} onChange={(e) => setDepenseNote(e.target.value)} placeholder="Note de dépense..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-medium text-slate-500 resize-none h-16 outline-none" />
            </div>

            <button onClick={handleFinalize} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all mt-4">
              Finaliser Piscine
            </button>
         </div>
       </div>
    </div>
  );
};
