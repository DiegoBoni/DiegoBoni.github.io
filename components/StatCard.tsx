import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  iconColorClass?: string;
  bgColorClass?: string; // This might be overridden by dark mode styles
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: IconComponent, iconColorClass = "text-indigo-500 dark:text-indigo-400" }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 shadow-xl rounded-xl p-5 md:p-6 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 transition-all hover:shadow-2xl hover:scale-105`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        {IconComponent && <IconComponent size={24} className={`${iconColorClass} opacity-70`} />}
      </div>
      <p className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
};

export default StatCard;