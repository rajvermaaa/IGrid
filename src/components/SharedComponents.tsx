import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus, Filter, Download, RefreshCw, Calendar, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  progress?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function KPICard({ title, value, subtitle, trend, trendValue, icon, progress, variant = 'default' }: KPICardProps) {
  const variantStyles = {
    default: 'border-gray-200',
    primary: 'border-blue-200 bg-blue-50/30',
    success: 'border-green-200 bg-green-50/30',
    warning: 'border-yellow-200 bg-yellow-50/30',
    danger: 'border-red-200 bg-red-50/30',
  };

  return (
    <div className={`bg-white rounded-lg p-5 shadow-sm border hover:shadow-md transition-shadow ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'neutral' && <Minus className="w-4 h-4" />}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                progress >= 90 ? 'bg-green-600' : 
                progress >= 70 ? 'bg-blue-600' : 
                progress >= 50 ? 'bg-yellow-600' : 
                'bg-red-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'Low' | 'Medium' | 'High' | 'Open' | 'Closed' | 'Available' | 'Unavailable' | 'Online' | 'Offline' | 'Normal' | 'Warning' | 'Critical';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'Low':
      case 'Closed':
      case 'Available':
      case 'Online':
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High':
      case 'Open':
      case 'Unavailable':
      case 'Offline':
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${getColors()} ${sizeClasses}`}>
      {status}
    </span>
  );
}

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/30 px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

interface PPEIndicatorProps {
  items: Array<{ name: string; missing: boolean }>;
}

export function PPEIndicator({ items }: PPEIndicatorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item) => (
        <span
          key={item.name}
          className={`px-2 py-1 rounded text-xs font-medium border ${
            item.missing
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}

interface FilterBarProps {
  onRefresh?: () => void;
  onExport?: () => void;
  children?: ReactNode;
}

export function FilterBar({ onRefresh, onExport, children }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          {children}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export function AlertBanner({ type, message, onClose }: AlertBannerProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type]} mb-6`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          ×
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-5 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
      <div className="text-sm text-gray-600">
        {itemsPerPage && totalItems && (
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5) {
            if (currentPage > 3) {
              pageNum = currentPage - 2 + i;
            }
            if (currentPage > totalPages - 2) {
              pageNum = totalPages - 4 + i;
            }
          }
          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}