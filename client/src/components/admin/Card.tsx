import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend: number;
  prefix?: string;
}

export function Card({ title, value, icon, trend, prefix = '' }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500">{title}</div>
        <div className="text-gray-600">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-2">
        {prefix}{value.toLocaleString()}
      </div>
      <div className={`flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1">{Math.abs(trend)}% from last month</span>
      </div>
    </div>
  );
} 