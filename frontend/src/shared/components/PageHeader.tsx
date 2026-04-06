import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="relative h-32 w-full bg-vedata-white border border-vedata-accent rounded-xl mb-8 overflow-hidden shadow-sm">
      {/* Elementos Decorativos Suaves */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-vedata-accent opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-48 h-48 bg-vedata-primary opacity-10 rounded-full blur-2xl"></div>
      
      {/* Conteúdo Principal */}
      <div className="absolute inset-0 flex items-center justify-between px-6 md:px-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-vedata-text tracking-tight">
            {title}
          </h1>
          <p className="text-vedata-text text-sm mt-1 opacity-80 font-medium">
            {description}
          </p>
        </div>

        <button 
          onClick={onButtonClick}
          className="bg-vedata-primary text-white hover:bg-vedata-hover px-4 md:px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-md flex items-center gap-2 group flex-shrink-0 uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
          <span className="hidden sm:inline">{buttonText}</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
