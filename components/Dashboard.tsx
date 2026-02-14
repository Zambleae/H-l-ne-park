
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  icon: string;
  title: string;
  gradient: string;
  textColor: string;
  description: string;
  onClick?: () => void;
  delay?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, gradient, textColor, onClick, delay }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden ${gradient} rounded-[2.5rem] p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer flex flex-col items-start justify-between min-h-[160px] border border-white/50 group active:scale-[0.98] animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards ${delay}`}
    >
      <div className="flex justify-between w-full items-start">
        <div className="text-4xl bg-white/40 backdrop-blur-md rounded-2xl w-14 h-14 flex items-center justify-center shadow-sm transition-transform duration-700 group-hover:rotate-6">
          {icon}
        </div>
        <div className={`p-1.5 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ${textColor}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
      
      <div>
        <h3 className={`${textColor} font-bold text-lg leading-tight transition-transform duration-500 group-hover:translate-x-1`}>{title}</h3>
        <p className={`${textColor} text-xs opacity-70 mt-1 font-medium`}>{description}</p>
      </div>
    </div>
  );
};

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const cards = [
    {
      title: 'Piscine',
      description: 'Accès & Rapports',
      icon: '🌊',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      textColor: 'text-indigo-900',
      action: () => onNavigate('pool'),
    },
    {
      title: 'Popcorn',
      description: 'Vente & Stock',
      icon: '🍿',
      gradient: 'bg-gradient-to-br from-yellow-50 to-amber-100',
      textColor: 'text-amber-900',
      action: () => onNavigate('popcorn'),
    },
    {
      title: 'Versement',
      description: 'Caisse & Banque',
      icon: '💰',
      gradient: 'bg-gradient-to-br from-emerald-50 to-teal-100',
      textColor: 'text-teal-900',
      action: () => onNavigate('versement'),
    },
    {
      title: 'Historique',
      description: 'Archives & Stats',
      icon: '📅',
      gradient: 'bg-gradient-to-br from-slate-100 to-gray-200',
      textColor: 'text-slate-800',
      action: () => onNavigate('history'),
    },
    {
      title: 'Restaurant',
      description: 'Menu & Commandes',
      icon: '🥗',
      gradient: 'bg-gradient-to-br from-orange-50 to-amber-100',
      textColor: 'text-amber-900',
      action: () => console.log('Restaurant clicked'),
    },
    {
      title: 'Maillot',
      description: 'Vente & Location',
      icon: '🩱',
      gradient: 'bg-gradient-to-br from-fuchsia-50 to-pink-100',
      textColor: 'text-fuchsia-900',
      action: () => onNavigate('maillot'),
    },
    {
      title: 'Boissons',
      description: 'Bar & Lounge',
      icon: '🍹',
      gradient: 'bg-gradient-to-br from-emerald-50 to-teal-100',
      textColor: 'text-teal-900',
      action: () => console.log('Boissons clicked'),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Bienvenue à</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Hélène Park</h2>
        </div>
        <div className="h-14 w-14 bg-white rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-3 animate-float hover:rotate-6 transition-transform duration-500">
           <img 
             src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=200&h=200" 
             alt="Piscine Hélène Park" 
             className="h-full w-full object-cover" 
           />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pb-20">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            gradient={card.gradient}
            textColor={card.textColor}
            onClick={card.action}
            delay={`delay-${(index + 1) * 100}`}
          />
        ))}
      </div>
    </div>
  );
};
