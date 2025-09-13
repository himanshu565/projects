import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof LucideIcon;
  iconColor?: string;
  trend?: number;
  trendColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-gray-400',
  trend,
  trendColor = 'text-green-500'
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
        </div>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className={`text-sm font-medium ${trendColor}`}>{subtitle}</p>
        )}
        {trend !== undefined && (
          <p className={`text-sm font-medium ${trendColor}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </p>
        )}
      </div>
    </div>
  );
};

export default KPICard;