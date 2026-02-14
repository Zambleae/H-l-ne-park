
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ChevronDown, Save } from 'lucide-react';

interface BraceletManagementProps {
  initialData?: any;
  onBack: () => void;
  onDataChange: (data: any) => void;
  onFinalize: (data: any) => void;
}

interface BraceletRow {
  id: number;
  color: string;
  entree: number | '';
  sortie: number | '';
  nEntree: string;
  nSortie: string;
  nReste: string;
}

const COLOR_OPTIONS = [
  'Blanc',
  'Jaune',
  'Vert',
  'Bleu',
  'Rouge',
  'Orange',
  'Violet',
  'Gris',
  'Marron'
];

export const BraceletManagement: React.FC<BraceletManagementProps> = ({ initialData, onBack, onDataChange, onFinalize }) => {
  const [rows, setRows] = useState<BraceletRow[]>(initialData?.rows || [
    { id: 1, color: 'Bleu', entree: 100, sortie: 0, nEntree: 'A001', nSortie: 'A020', nReste: 'A021-A100' },
    { id: 2, color: 'Rouge', entree: 50, sortie: 0, nEntree: 'R10', nSortie: 'R15', nReste: 'R16...' },
  ]);

  useEffect(() => {
    onDataChange({ rows });
  }, [rows]);

  const handleAddRow = () => {
    const newRow: BraceletRow = {
      id: Date.now(),
      color: 'Blanc',
      entree: 0,
      sortie: 0,
      nEntree: '',
      nSortie: '',
      nReste: '',
    };
    setRows([...rows, newRow]);
  };

  const handleChange = (id: number, field: keyof BraceletRow, value: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        if (field === 'color' || field === 'nEntree' || field === 'nSortie' || field === 'nReste') {
          return { ...row, [field]: value };
        }
        const numValue = value === '' ? '' : parseInt(value, 10);
        return { ...row, [field]: numValue };
      }
      return row;
    }));
  };

  const handleFinalize = () => {
    onFinalize({ rows });
  };

  const calculateStockRestant = (row: BraceletRow) => {
    const entree = typeof row.entree === 'number' ? row.entree : 0;
    const sortie = typeof row.sortie === 'number' ? row.sortie : 0;
    return entree - sortie;
  };

  const getColorStyle = (color: string) => {
    switch (color) {
      case 'Blanc': return 'bg-white border-gray-300 text-slate-800';
      case 'Jaune': return 'bg-yellow-400 border-yellow-500 text-yellow-950';
      case 'Vert': return 'bg-emerald-500 border-emerald-600 text-white';
      case 'Bleu': return 'bg-blue-500 border-blue-600 text-white';
      case 'Rouge': return 'bg-red-500 border-red-600 text-white';
      case 'Orange': return 'bg-orange-500 border-orange-600 text-white';
      case 'Violet': return 'bg-violet-500 border-violet-600 text-white';
      case 'Gris': return 'bg-slate-500 border-slate-600 text-white';
      case 'Marron': return 'bg-amber-800 border-amber-900 text-white';
      default: return 'bg-white border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mx-4 mb-20 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out h-[calc(100vh-180px)] flex flex-col">
      <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shrink-0">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-sm rounded-full active:scale-95">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Stock Bracelets</h2>
                <p className="text-purple-50 text-[10px] font-medium opacity-90 uppercase tracking-widest">Priorité Quantités</p>
            </div>
            </div>
            <button onClick={handleFinalize} className="bg-white/20 p-2.5 rounded-xl border border-white/20 active:scale-95">
                <Save className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="overflow-auto flex-1 no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm border-b border-gray-100">
            <tr>
              <th className="p-3 text-gray-500 font-bold uppercase text-[8px] tracking-wider min-w-[80px]">Couleur</th>
              <th className="p-2 text-center text-emerald-600 font-bold uppercase text-[8px] tracking-wider w-[50px]">Entrée</th>
              <th className="p-2 text-center text-red-500 font-bold uppercase text-[8px] tracking-wider w-[50px]">Sortie</th>
              <th className="p-2 text-center text-violet-600 font-black uppercase text-[8px] tracking-wider w-[50px] bg-violet-50/50">Reste</th>
              <th className="p-2 text-center text-gray-400 font-bold uppercase text-[8px] tracking-wider">Suivi Nº</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-violet-50/20 transition-colors">
                <td className="p-2">
                  <div className="relative">
                    <select
                      value={row.color}
                      onChange={(e) => handleChange(row.id, 'color', e.target.value)}
                      className={`w-full appearance-none rounded-lg py-2 pl-2 pr-6 text-[10px] font-black border outline-none shadow-sm ${getColorStyle(row.color)}`}
                    >
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color} className="bg-white text-gray-800">{color}</option>
                      ))}
                    </select>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><ChevronDown className="w-3 h-3" /></div>
                  </div>
                </td>

                <td className="p-1">
                  <input 
                    type="number" 
                    value={row.entree} 
                    onChange={(e) => handleChange(row.id, 'entree', e.target.value)} 
                    placeholder="0" 
                    className="w-full text-center bg-emerald-50/30 border border-emerald-100 rounded-lg py-2 text-xs font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-200" 
                  />
                </td>

                <td className="p-1">
                  <input 
                    type="number" 
                    value={row.sortie} 
                    onChange={(e) => handleChange(row.id, 'sortie', e.target.value)} 
                    placeholder="0" 
                    className="w-full text-center bg-red-50/30 border border-red-100 rounded-lg py-2 text-xs font-black text-red-700 outline-none focus:ring-2 focus:ring-red-200" 
                  />
                </td>

                <td className="p-1 bg-violet-50/30 text-center">
                   <span className="inline-block bg-white border border-violet-100 px-2 py-1 rounded-md font-black text-violet-700 text-xs shadow-sm">
                    {calculateStockRestant(row)}
                   </span>
                </td>

                <td className="p-1">
                   <div className="flex flex-col gap-1">
                     <input 
                        type="text" 
                        value={row.nEntree} 
                        onChange={(e) => handleChange(row.id, 'nEntree', e.target.value)} 
                        placeholder="Nº E" 
                        className="w-full text-[9px] bg-gray-50 border border-gray-100 rounded-md py-0.5 px-1 font-mono text-gray-400 outline-none focus:border-violet-300 focus:bg-white" 
                     />
                     <input 
                        type="text" 
                        value={row.nSortie} 
                        onChange={(e) => handleChange(row.id, 'nSortie', e.target.value)} 
                        placeholder="Nº S" 
                        className="w-full text-[9px] bg-gray-50 border border-gray-100 rounded-md py-0.5 px-1 font-mono text-gray-400 outline-none focus:border-violet-300 focus:bg-white" 
                     />
                     <input 
                        type="text" 
                        value={row.nReste} 
                        onChange={(e) => handleChange(row.id, 'nReste', e.target.value)} 
                        placeholder="Nº R" 
                        className="w-full text-[9px] bg-violet-100/30 border border-violet-200/50 rounded-md py-0.5 px-1 font-mono text-violet-400 outline-none focus:border-violet-300" 
                     />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 flex flex-col gap-3">
            <button onClick={handleAddRow} className="flex items-center justify-center gap-2 py-3 bg-violet-50 text-violet-600 border border-violet-100 rounded-xl active:scale-95 transition-all">
                <Plus className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Nouvelle Couleur</span>
            </button>
            <button onClick={handleFinalize} className="py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg active:scale-95 transition-all">
                Finaliser l'inventaire
            </button>
        </div>
      </div>
    </div>
  );
};
