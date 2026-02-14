
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { PoolActivityTable } from './components/PoolActivityTable';
import { BraceletManagement } from './components/BraceletManagement';
import { PopcornPage } from './components/PopcornPage';
import { VersementPage } from './components/VersementPage';
import { HistoryPage } from './components/HistoryPage';
import { MaillotPage } from './components/MaillotPage';
import { HistoryDetailView } from './components/HistoryDetailView';
import { ImageEditor } from './components/ImageEditor';
import { Home, Camera, User, Settings, Waves, CheckCircle2 } from 'lucide-react';

export interface DailyHistory {
  dateKey: string; // YYYY-MM-DD
  displayDate: string;
  activities: {
    pool?: any;
    popcorn?: any;
    maillot?: any;
    bracelets?: any;
  };
  total: number;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'pool' | 'bracelets' | 'popcorn' | 'versement' | 'history' | 'maillot' | 'history-detail' | 'editor'>('home');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DailyHistory | null>(null);

  const [poolData, setPoolData] = useState<any>(null);
  const [popcornData, setPopcornData] = useState<any>(null);
  const [maillotData, setMaillotData] = useState<any>(null);
  const [braceletsData, setBraceletsData] = useState<any>(null);

  const [history, setHistory] = useState<Record<string, DailyHistory>>(() => {
    const saved = localStorage.getItem('helene_park_history');
    return saved ? JSON.parse(saved) : {
      '2024-02-23': {
        dateKey: '2024-02-23',
        displayDate: '23 Février 2024',
        total: 410500,
        activities: {
          pool: { total: 230500, versement: 200000 },
          popcorn: { total: 180000, versement: 150000 }
        }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('helene_park_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const lastResetDate = localStorage.getItem('last_reset_date');
      const today = now.toDateString();

      if (currentHour >= 17 && lastResetDate !== today) {
        setPoolData((prev: any) => prev ? {
          ...prev,
          items: prev.items.map((it: any) => ({ ...it, sold: 0 })),
          orange: 0, wave: 0, depenses: 0, total: 0, versement: 0
        } : null);
        
        setPopcornData((prev: any) => prev ? {
          ...prev,
          items: prev.items.map((it: any) => ({ ...it, qty: 0 })),
          orange: 0, wave: 0, total: 0, versement: 0
        } : null);

        setMaillotData((prev: any) => prev ? {
          ...prev,
          items: prev.items.map((it: any) => ({ ...it, qty: 0 })),
          orange: 0, wave: 0, total: 0, versement: 0
        } : null);

        setBraceletsData((prev: any) => prev ? {
          ...prev,
          rows: prev.rows.map((r: any) => ({ ...r, sortie: 0, nSortie: '', nReste: '' }))
        } : null);

        localStorage.setItem('last_reset_date', today);
      }
    };

    const timer = setInterval(checkReset, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleFinalize = (type: 'pool' | 'popcorn' | 'maillot' | 'bracelets', data: any) => {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const displayDate = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    setHistory(prev => {
      const existing = prev[dateKey] || {
        dateKey,
        displayDate,
        activities: {},
        total: 0
      };

      const updatedActivities = { ...existing.activities, [type]: data };
      const newTotal = Object.entries(updatedActivities).reduce((acc: number, [key, curr]: [string, any]) => {
        if (key === 'bracelets') return acc;
        return acc + (curr?.total || 0);
      }, 0);

      return {
        ...prev,
        [dateKey]: {
          ...existing,
          activities: updatedActivities,
          total: newTotal
        }
      };
    });

    setShowSuccess(true);
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleViewDetail = (item: DailyHistory) => {
    setSelectedHistoryItem(item);
    setCurrentView('history-detail');
  };

  // Aggregated data for VersementPage
  const aggregatedTotals = {
    cash: (poolData?.versement || 0) + (popcornData?.versement || 0) + (maillotData?.versement || 0),
    orange: (poolData?.orange || 0) + (popcornData?.orange || 0) + (maillotData?.orange || 0),
    wave: (poolData?.wave || 0) + (popcornData?.wave || 0) + (maillotData?.wave || 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-500">
          <div className="bg-emerald-500 text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-black uppercase tracking-[0.2em] text-sm">Validé</span>
          </div>
        </div>
      )}

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-100 rounded-full blur-[100px] -ml-32 -mb-32 opacity-50 pointer-events-none"></div>

      <div className="relative z-10 pt-safe">
        <header className="px-6 py-6 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-white/40">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Hélène Park</h1>
          </div>
        </header>

        <div className="min-h-[calc(100vh-180px)]">
          {currentView === 'home' && <Dashboard onNavigate={(page) => setCurrentView(page as any)} />}

          {currentView === 'pool' && (
             <PoolActivityTable 
                initialData={poolData}
                onBack={() => setCurrentView('home')} 
                onNavigateToBracelets={() => setCurrentView('bracelets')}
                onDataChange={setPoolData}
                onFinalize={(data) => handleFinalize('pool', data)}
             />
          )}

          {currentView === 'bracelets' && (
             <BraceletManagement 
                initialData={braceletsData}
                onBack={() => setCurrentView('pool')} 
                onDataChange={setBraceletsData}
                onFinalize={(data) => handleFinalize('bracelets', data)}
             />
          )}

          {currentView === 'popcorn' && (
             <PopcornPage 
                initialData={popcornData}
                onBack={() => setCurrentView('home')}
                onDataChange={setPopcornData}
                onFinalize={(data) => handleFinalize('popcorn', data)}
             />
          )}

          {currentView === 'maillot' && (
             <MaillotPage 
                initialData={maillotData}
                onBack={() => setCurrentView('home')} 
                onDataChange={setMaillotData}
                onFinalize={(data) => handleFinalize('maillot', data)}
             />
          )}

          {currentView === 'history' && (
             <HistoryPage 
                onBack={() => setCurrentView('home')} 
                historyItems={(Object.values(history) as DailyHistory[]).sort((a,b) => b.dateKey.localeCompare(a.dateKey))} 
                onSelectItem={handleViewDetail}
             />
          )}

          {currentView === 'history-detail' && selectedHistoryItem && (
             <HistoryDetailView 
                item={selectedHistoryItem} 
                onBack={() => setCurrentView('history')} 
             />
          )}

          {currentView === 'versement' && (
             <VersementPage 
                onBack={() => setCurrentView('home')} 
                aggregatedData={aggregatedTotals}
             />
          )}

          {currentView === 'editor' && (
             <ImageEditor />
          )}
        </div>
      </div>

      <nav className="fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center z-50 max-w-[calc(448px-3rem)] mx-auto rounded-[2rem] shadow-2xl">
        <button onClick={() => setCurrentView('home')} className={`p-2 transition-all ${currentView === 'home' ? 'text-white scale-125' : 'text-slate-500'}`}><Home className="w-5 h-5" /></button>
        <button onClick={() => setCurrentView('editor')} className={`p-2 transition-all ${currentView === 'editor' ? 'text-white scale-125' : 'text-slate-500'}`}><Camera className="w-5 h-5" /></button>
        <button className="p-2 text-slate-500"><Settings className="w-5 h-5" /></button>
        <button className="p-2 text-slate-500"><User className="w-5 h-5" /></button>
      </nav>
    </div>
  );
};

export default App;
