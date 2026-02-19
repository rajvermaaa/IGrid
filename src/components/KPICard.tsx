// KPI Summary Card Component
import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function KPICard({ title, value, icon, onClick }: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded p-4 ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
