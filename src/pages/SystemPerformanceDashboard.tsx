import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, ChevronDown, RefreshCw, AlertCircle,
  Download, Filter, X, CheckCircle2, Activity, Zap, AlertTriangle,
  Database, Camera, Cpu, AlertOctagon, ArrowLeft
} from 'lucide-react';
import { KPICard, PageHeader } from '../components/SharedComponents';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import { getJSON } from '../api';

// ============================================================
// SECTION 1: TYPE DEFINITIONS
// ============================================================

export interface SystemMetrics {
  latencyP95: number;
  latencyP99: number;
  throughput: number;
  errorRate: number;
  activeHazardCount: number;
}

export interface PerformanceTrend {
  time: string;
  latency: number;
  throughput: number;
}

export interface ErrorBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface LatencyDistribution {
  range: string;
  count: number;
}

export interface SystemHealth {
  id: number;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  latency: number;
}

export interface RequestLog {
  id: number;
  requestId: string;
  cameraCode: string;
  hazardType: string;
  latency: number;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedLogs {
  logs: RequestLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


export interface DashboardFilters {
  timeRange: string;
  plant: string;
  cameraGroup: string;
  hazardType: string;
  statusCodes: number[];
  page: number;
  pageSize: number;
}

// ============================================================
// SECTION 2: API SERVICE LAYER
// ============================================================
// Uses getJSON() from src/api.ts — handles BASE_URL, credentials, timeouts
// 🔌 STEP 1: Update these paths to match your real API endpoints
// 🔌 STEP 2: Set USE_MOCK_DATA = false when your API is ready
// ============================================================

async function apiFetchSystemMetrics(): Promise<SystemMetrics> {
  return getJSON<SystemMetrics>('/api/system/metrics');
}

async function apiFetchPerformanceTrend(timeRange: string): Promise<PerformanceTrend[]> {
  return getJSON<PerformanceTrend[]>(`/api/system/performance-trend?timeRange=${timeRange}`);
}

async function apiFetchErrorBreakdown(): Promise<ErrorBreakdown[]> {
  return getJSON<ErrorBreakdown[]>('/api/system/error-breakdown');
}

async function apiFetchLatencyDistribution(): Promise<LatencyDistribution[]> {
  return getJSON<LatencyDistribution[]>('/api/system/latency-distribution');
}

async function apiFetchSystemHealth(): Promise<SystemHealth[]> {
  return getJSON<SystemHealth[]>('/api/system/health');
}

async function apiFetchRequestLogs(filters: DashboardFilters): Promise<PaginatedLogs> {
  const params = new URLSearchParams({
    timeRange: filters.timeRange,
    plant: filters.plant,
    cameraGroup: filters.cameraGroup,
    hazardType: filters.hazardType,
    statusCodes: filters.statusCodes.join(','),
    page: filters.page.toString(),
    pageSize: filters.pageSize.toString(),
  });
  return getJSON<PaginatedLogs>(`/api/system/request-logs?${params}`);
}

// ============================================================
// SECTION 3: MOCK DATA
// ============================================================

const USE_MOCK_DATA = true;

const MOCK_METRICS: SystemMetrics = {
  latencyP95: 178,
  latencyP99: 245,
  throughput: 1280,
  errorRate: 1.4,
  activeHazardCount: 12,
};

const MOCK_PERFORMANCE_TREND: PerformanceTrend[] = [
  { time: '00:00', latency: 145, throughput: 1250 },
  { time: '00:10', latency: 162, throughput: 1310 },
  { time: '00:20', latency: 178, throughput: 1280 },
  { time: '00:30', latency: 155, throughput: 1340 },
  { time: '00:40', latency: 189, throughput: 1220 },
  { time: '00:50', latency: 205, throughput: 1180 },
  { time: '01:00', latency: 172, throughput: 1290 },
];

const MOCK_ERROR_BREAKDOWN: ErrorBreakdown[] = [
  { name: 'Database',    value: 45, color: '#ef4444' },
  { name: 'AI Model',    value: 30, color: '#f59e0b' },
  { name: 'Camera Feed', value: 25, color: '#3b82f6' },
];

const MOCK_LATENCY_DISTRIBUTION: LatencyDistribution[] = [
  { range: '0-50ms',     count: 1200 },
  { range: '50-100ms',   count: 3500 },
  { range: '100-200ms',  count: 2100 },
  { range: '200-500ms',  count: 450  },
  { range: '500-1000ms', count: 120  },
  { range: '>1000ms',    count: 35   },
];

const MOCK_SYSTEM_HEALTH: SystemHealth[] = [
  { id: 1,  name: 'CAM-01', status: 'healthy',  latency: 145  },
  { id: 2,  name: 'CAM-02', status: 'healthy',  latency: 158  },
  { id: 3,  name: 'CAM-03', status: 'warning',  latency: 487  },
  { id: 4,  name: 'CAM-04', status: 'healthy',  latency: 132  },
  { id: 5,  name: 'CAM-05', status: 'healthy',  latency: 167  },
  { id: 6,  name: 'CAM-06', status: 'critical', latency: 1245 },
  { id: 7,  name: 'CAM-07', status: 'healthy',  latency: 175  },
  { id: 8,  name: 'CAM-08', status: 'healthy',  latency: 142  },
  { id: 9,  name: 'CAM-09', status: 'warning',  latency: 523  },
  { id: 10, name: 'CAM-10', status: 'healthy',  latency: 189  },
  { id: 11, name: 'CAM-11', status: 'healthy',  latency: 155  },
  { id: 12, name: 'CAM-12', status: 'healthy',  latency: 198  },
];

const MOCK_REQUEST_LOGS: RequestLog[] = [
  { id: 1,  requestId: 'REQ-89234', cameraCode: 'CAM-01', hazardType: 'No PPE',            latency: 145,  statusCode: 200, timestamp: '2026-02-15 14:32:15' },
  { id: 2,  requestId: 'REQ-89235', cameraCode: 'CAM-03', hazardType: 'Unauthorized Zone', latency: 487,  statusCode: 200, timestamp: '2026-02-15 14:32:10' },
  { id: 3,  requestId: 'REQ-89236', cameraCode: 'CAM-06', hazardType: 'Equipment Failure', latency: 1245, statusCode: 500, timestamp: '2026-02-15 14:31:58' },
  { id: 4,  requestId: 'REQ-89237', cameraCode: 'CAM-02', hazardType: 'Fire Detection',    latency: 158,  statusCode: 200, timestamp: '2026-02-15 14:31:45' },
  { id: 5,  requestId: 'REQ-89238', cameraCode: 'CAM-09', hazardType: 'No PPE',            latency: 523,  statusCode: 200, timestamp: '2026-02-15 14:31:32' },
  { id: 6,  requestId: 'REQ-89239', cameraCode: 'CAM-04', hazardType: 'Spillage',          latency: 132,  statusCode: 200, timestamp: '2026-02-15 14:31:20' },
  { id: 7,  requestId: 'REQ-89240', cameraCode: 'CAM-05', hazardType: 'No PPE',            latency: 167,  statusCode: 200, timestamp: '2026-02-15 14:31:05' },
  { id: 8,  requestId: 'REQ-89241', cameraCode: 'CAM-07', hazardType: 'Obstruction',       latency: 175,  statusCode: 200, timestamp: '2026-02-15 14:30:52' },
  { id: 9,  requestId: 'REQ-89242', cameraCode: 'CAM-08', hazardType: 'Fire Detection',    latency: 142,  statusCode: 200, timestamp: '2026-02-15 14:30:38' },
  { id: 10, requestId: 'REQ-89243', cameraCode: 'CAM-10', hazardType: 'No PPE',            latency: 189,  statusCode: 200, timestamp: '2026-02-15 14:30:25' },
];

// ============================================================
// SECTION 4: DATA FETCHING HOOK
// ============================================================

function useSystemDashboard(filters: DashboardFilters) {
  const [metrics,             setMetrics]             = useState<SystemMetrics | null>(null);
  const [performanceTrend,    setPerformanceTrend]    = useState<PerformanceTrend[]>([]);
  const [errorBreakdown,      setErrorBreakdown]      = useState<ErrorBreakdown[]>([]);
  const [latencyDistribution, setLatencyDistribution] = useState<LatencyDistribution[]>([]);
  const [systemHealth,        setSystemHealth]        = useState<SystemHealth[]>([]);
  const [paginatedLogs,       setPaginatedLogs]       = useState<PaginatedLogs | null>(null);
  const [isLoading,           setIsLoading]           = useState(true);
  const [isRefreshing,        setIsRefreshing]        = useState(false);
  const [error,               setError]               = useState<string | null>(null);
  const [lastUpdated,         setLastUpdated]         = useState<Date>(new Date());

  const load = useCallback(async (showSpinner = true) => {
    try {
      showSpinner ? setIsLoading(true) : setIsRefreshing(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 800));
        setMetrics(MOCK_METRICS);
        setPerformanceTrend(MOCK_PERFORMANCE_TREND);
        setErrorBreakdown(MOCK_ERROR_BREAKDOWN);
        setLatencyDistribution(MOCK_LATENCY_DISTRIBUTION);
        setSystemHealth(MOCK_SYSTEM_HEALTH);

        // Client-side pagination for mock
        const filtered = MOCK_REQUEST_LOGS.filter(log =>
          filters.statusCodes.length === 0 || filters.statusCodes.includes(log.statusCode)
        );
        const start = (filters.page - 1) * filters.pageSize;
        setPaginatedLogs({
          logs: filtered.slice(start, start + filters.pageSize),
          total: filtered.length,
          page: filters.page,
          pageSize: filters.pageSize,
          totalPages: Math.ceil(filtered.length / filters.pageSize),
        });
      } else {
        const [metricsData, trendData, errorsData, distData, healthData, logsData] = await Promise.all([
          apiFetchSystemMetrics(),
          apiFetchPerformanceTrend(filters.timeRange),
          apiFetchErrorBreakdown(),
          apiFetchLatencyDistribution(),
          apiFetchSystemHealth(),
          apiFetchRequestLogs(filters),
        ]);
        setMetrics(metricsData);
        setPerformanceTrend(trendData);
        setErrorBreakdown(errorsData);
        setLatencyDistribution(distData);
        setSystemHealth(healthData);
        setPaginatedLogs(logsData);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => { load(true); }, [load]);

  return {
    metrics, performanceTrend, errorBreakdown, latencyDistribution,
    systemHealth, paginatedLogs, isLoading, isRefreshing, error, lastUpdated,
    refresh: () => load(false), retry: () => load(true),
  };
}

// ============================================================
// SECTION 5: UI HELPER COMPONENTS
// ============================================================

function SkeletonKPICard() {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-80 bg-gray-100 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-48" />
      </div>
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}
      </div>
    </div>
  );
}

function EmptyState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Try Again
        </button>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertOctagon className="w-8 h-8 text-red-600" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-2">Failed to Load Data</p>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
        Retry
      </button>
    </div>
  );
}

// ============================================================
// SECTION 6: MAIN PAGE COMPONENT
// ============================================================

export function SystemPerformanceDashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: '24h',
    plant: 'all',
    cameraGroup: 'all',
    hazardType: 'all',
    statusCodes: [],
    page: 1,
    pageSize: 25,
  });

  const [filtersOpen,      setFiltersOpen]      = useState(false);
  const [datePickerOpen,   setDatePickerOpen]   = useState(false);
  const [dismissedAlerts,  setDismissedAlerts]  = useState<Set<string>>(new Set());

  const {
    metrics, performanceTrend, errorBreakdown, latencyDistribution,
    systemHealth, paginatedLogs, isLoading, isRefreshing, error, lastUpdated,
    refresh, retry,
  } = useSystemDashboard(filters);

  // ── helpers ──────────────────────────────────────────────

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // reset to page 1 on any filter change except page/pageSize navigation
      page: key !== 'page' && key !== 'pageSize' ? 1 : prev.page,
    }));
  };

  const toggleStatusCodeFilter = (code: number) => {
    setFilters(prev => ({
      ...prev,
      statusCodes: prev.statusCodes.includes(code)
        ? prev.statusCodes.filter(c => c !== code)
        : [...prev.statusCodes, code],
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      timeRange: '24h',
      plant: 'all',
      cameraGroup: 'all',
      hazardType: 'all',
      statusCodes: [],
      page: 1,
      pageSize: 25,
    });
  };

  const handleExportCSV = () => {
    if (!paginatedLogs) return;
    const headers = ['Request ID', 'Camera Code', 'Hazard Type', 'Latency (ms)', 'Status Code', 'Timestamp'];
    const rows = paginatedLogs.logs.map(log => [
      log.requestId, log.cameraCode, log.hazardType, log.latency, log.statusCode, log.timestamp,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `request-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!paginatedLogs) return;
    const data = paginatedLogs.logs.map(log => ({
      'Request ID':   log.requestId,
      'Camera Code':  log.cameraCode,
      'Hazard Type':  log.hazardType,
      'Latency (ms)': log.latency,
      'Status Code':  log.statusCode,
      'Timestamp':    log.timestamp,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Request Logs');
    worksheet['!cols'] = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, ...data.map(r => String(r[key as keyof typeof r] ?? '').length)) + 2,
    }));
    XLSX.writeFile(workbook, `request-logs-${new Date().toISOString()}.xlsx`);
  };

  const getTimeRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      '5m': 'Last 5 minutes', '1h': 'Last 1 hour',
      '24h': 'Last 24 hours', '7d': 'Last 7 days',
      '30d': 'Last 30 days',  'custom': 'Custom Range',
    };
    return labels[range] || 'Last 24 hours';
  };

  const getHealthStatusColor = (status: string) => {
    if (status === 'healthy')  return 'bg-green-500';
    if (status === 'warning')  return 'bg-yellow-500';
    if (status === 'critical') return 'bg-red-500';
    return 'bg-gray-400';
  };

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  // ── full-page error ───────────────────────────────────────

  if (error && !metrics) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title={
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-150"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>
              <span>System Performance & Technical Health</span>
            </div>
          }
        >
          <div className="text-sm text-gray-600">Last updated: {formatLastUpdated()}</div>
        </PageHeader>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <PageHeader>
        <div className="flex flex-wrap items-center justify-between w-full gap-3">

          {/* ───────── LEFT SIDE ───────── */}
          <div className="flex items-center gap-3">

            {/* Time Range Picker */}
            <div className="relative">
              <button
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{getTimeRangeLabel(filters.timeRange)}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {datePickerOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDatePickerOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-40">
                    <div className="p-2">
                      {['5m', '1h', '24h', '7d', '30d'].map(range => (
                        <button
                          key={range}
                          onClick={() => {
                            updateFilter('timeRange', range);
                            setDatePickerOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                            filters.timeRange === range
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {getTimeRangeLabel(range)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* ───────── RIGHT SIDE ───────── */}
          <div className="flex items-center gap-3">

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Filters */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Last Updated */}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              Updated: {formatLastUpdated()}
            </div>

          </div>

        </div>
      </PageHeader>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Main Content ── */}
        <div className="flex-1 overflow-auto p-4 sm:p-6"> 

          {/* Loading skeleton */}
          {isLoading && !metrics ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {[...Array(4)].map((_, i) => <SkeletonKPICard key={i} />)}
              </div>
              <SkeletonChart />
              <div className="grid grid-cols-3 gap-6 my-6">
                {[...Array(3)].map((_, i) => <SkeletonChart key={i} />)}
              </div>
              <SkeletonTable />
            </>
          ) : metrics ? (
            <>

              {/* ── Alert Banners ── */}
              <div className="mb-6 space-y-3">
                {!dismissedAlerts.has('latency') && metrics.latencyP99 > 200 && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-red-900 text-sm">Threshold Alert: High Latency Detected</div>
                      <div className="text-xs text-red-700 mt-1">Latency exceeds 2000ms for more than 3 minutes on CAM-06</div>
                    </div>
                    <button
                      onClick={() => setDismissedAlerts(prev => new Set(prev).add('latency'))}
                      className="text-red-700 hover:text-red-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {!dismissedAlerts.has('error') && metrics.errorRate > 1 && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-900 text-sm">Anomaly Alert: Error Rate Spike</div>
                      <div className="text-xs text-yellow-700 mt-1">Error rate deviates 24% from baseline in the last 15 minutes</div>
                    </div>
                    <button
                      onClick={() => setDismissedAlerts(prev => new Set(prev).add('error'))}
                      className="text-yellow-700 hover:text-yellow-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── KPI Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <KPICard
                  title="Latency (P95/P99)"
                  value={`${metrics.latencyP95}ms / ${metrics.latencyP99}ms`}
                  subtitle="95th & 99th percentile"
                  icon={<Activity className="w-5 h-5" />}
                  variant="primary"
                />
                <KPICard
                  title="Throughput"
                  value={metrics.throughput.toLocaleString()}
                  subtitle="Requests/Frames per minute"
                  icon={<Zap className="w-5 h-5" />}
                  variant="success"
                />
                <KPICard
                  title="Error Rate"
                  value={`${metrics.errorRate}%`}
                  subtitle="Last 1 hour"
                  icon={<AlertCircle className="w-5 h-5" />}
                  variant="warning"
                />
                <KPICard
                  title="Active Hazard Count"
                  value={metrics.activeHazardCount}
                  subtitle="Currently detected"
                  icon={<AlertTriangle className="w-5 h-5" />}
                  variant="danger"
                />
              </div>

              {/* ── Performance Trend Chart ── */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Latency vs Throughput Trend</h3>
                  <p className="text-sm text-gray-500 mt-1">Performance trend over time</p>
                </div>
                <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 240 : 320}>
                  <AreaChart data={performanceTrend}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left"  tick={{ fontSize: 12 }} label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'Throughput', angle: 90, position: 'insideRight' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Area  yAxisId="left"  type="monotone" dataKey="latency"    stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" name="Latency (ms)" />
                    <Line  yAxisId="right" type="monotone" dataKey="throughput" stroke="#10b981" strokeWidth={2} name="Throughput" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* ── Distribution / Health Row ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">

                {/* Latency Distribution */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800">Latency Distribution</h3>
                    <p className="text-xs text-gray-500 mt-1">Response time analysis</p>
                  </div>
                  <div className="space-y-2">
                    {latencyDistribution.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                          <span className="font-medium">{item.range}</span>
                          <span className="text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.count > 3000 ? 'bg-green-500' :
                              item.count > 1000 ? 'bg-blue-500'  :
                              item.count > 400  ? 'bg-yellow-500': 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.count / 3500) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Breakdown */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800">Error Breakdown</h3>
                    <p className="text-xs text-gray-500 mt-1">By component type</p>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={errorBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {errorBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {errorBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health Grid */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800">System Health Status</h3>
                    <p className="text-xs text-gray-500 mt-1">Camera / Sensor status</p>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-4 gap-2">
                    {systemHealth.map(sys => (
                      <div key={sys.id} className="group relative" title={`${sys.name}: ${sys.latency}ms`}>
                        <div className={`aspect-square rounded ${getHealthStatusColor(sys.status)} hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center`}>
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {sys.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"  /><span className="text-gray-600">Healthy</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500" /><span className="text-gray-600">Warning</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"    /><span className="text-gray-600">Critical</span></div>
                  </div>
                </div>
              </div>

              {/* ── Request Logs Table ── */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Request Logs</h3>
                      <p className="text-sm text-gray-500 mt-1">Detailed performance logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleExportCSV} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Download className="w-4 h-4" />CSV
                      </button>
                      <button onClick={handleExportExcel} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />Excel
                      </button>
                    </div>
                  </div>

                  {/* Status Code Filters */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Filter by Status:</span>
                    {[200, 500].map(code => (
                      <button
                        key={code}
                        onClick={() => toggleStatusCodeFilter(code)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          filters.statusCodes.includes(code)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                    {filters.statusCodes.length > 0 && (
                      <button onClick={() => updateFilter('statusCodes', [])} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {paginatedLogs && paginatedLogs.logs.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {['Request ID', 'Camera Code', 'Hazard Type', 'Latency (ms)', 'Status Code', 'Timestamp'].map(h => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedLogs.logs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.requestId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{log.cameraCode}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.hazardType}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-semibold ${
                                  log.latency > 1000 ? 'text-red-600' :
                                  log.latency > 500  ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {log.latency}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.statusCode === 200
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {log.statusCode}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.timestamp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <select
                          value={filters.pageSize}
                          onChange={e => updateFilter('pageSize', Number(e.target.value))}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600 ml-4">
                          Showing {((paginatedLogs.page - 1) * paginatedLogs.pageSize) + 1} to {Math.min(paginatedLogs.page * paginatedLogs.pageSize, paginatedLogs.total)} of {paginatedLogs.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateFilter('page', filters.page - 1)}
                          disabled={filters.page === 1}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {paginatedLogs.page} of {paginatedLogs.totalPages}</span>
                        <button
                          onClick={() => updateFilter('page', filters.page + 1)}
                          disabled={filters.page === paginatedLogs.totalPages}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState message="No logs match the current filters" onRetry={handleResetFilters} />
                )}
              </div>

            </>
          ) : null}
        </div>

        {/* ── Filters Panel ── */}
        {filtersOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setFiltersOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-2xl z-50 flex flex-col">

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <button onClick={handleResetFilters} className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                    Reset All Filters
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plant Location</label>
                    <select value={filters.plant} onChange={e => updateFilter('plant', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">All Plants</option>
                      <option value="plant-a">Plant A</option>
                      <option value="plant-b">Plant B</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Camera Group</label>
                    <select value={filters.cameraGroup} onChange={e => updateFilter('cameraGroup', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">All Groups</option>
                      <option value="zone-a">Zone A</option>
                      <option value="zone-b">Zone B</option>
                      <option value="zone-c">Zone C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Type</label>
                    <select value={filters.hazardType} onChange={e => updateFilter('hazardType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">All Types</option>
                      <option value="no-ppe">No PPE</option>
                      <option value="fire">Fire Detection</option>
                      <option value="unauthorized">Unauthorized Zone</option>
                      <option value="equipment">Equipment Failure</option>
                    </select>
                  </div>

                  {/* System Health Summary */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">System Health Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><Database className="w-4 h-4 text-green-600" /><span className="text-gray-700">Database</span></div>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-green-600" /><span className="text-gray-700">AI Model</span></div>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-yellow-600" /><span className="text-gray-700">Camera Feed</span></div>
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Apply button */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <button onClick={() => setFiltersOpen(false)} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}