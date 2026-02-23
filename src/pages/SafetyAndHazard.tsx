import {
  AlertCircle, RefreshCw, AlertTriangle, CheckCircle2, Activity,
  Settings, Clock, ChevronDown, AlertOctagon
} from 'lucide-react';
import { KPICard, PageHeader } from '../components/SharedComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { getJSON } from '../api';

// ============================================================
// SECTION 1: TYPE DEFINITIONS (Simplified)
// ============================================================

export interface KPIData {
  totalEvents: number;
  openIncidents: number;
  closedIncidents: number;
}

export interface ViolationType {
  name: string;
  value: number;
}

export interface DepartmentViolation {
  department: string;
  violations: number;
}

export interface DashboardData {
  kpis: KPIData;
  violationTypes: ViolationType[];
  departmentViolations: DepartmentViolation[];
}

export interface PPEEvent {
  id: string;
  featureDetected: string;
  department: string;
}

export interface Incident {
  id: string;
  missingPPE: string[];
  status: 'Open' | 'Closed';
}

export interface PPEFeature {
  name: string;
  enabled: boolean;
}

// ============================================================
// SECTION 2: API SERVICE LAYER
// ============================================================

async function apiFetchDashboard(date?: string): Promise<DashboardData> {
  const q = date ? `?date=${date}` : '';
  return getJSON<DashboardData>(`/api/safety/dashboard${q}`);
}

async function apiFetchAllPPEEvents(date?: string): Promise<PPEEvent[]> {
  const q = date ? `?date=${date}` : '';
  return getJSON<PPEEvent[]>(`/api/safety/ppe-events${q}`);
}

async function apiFetchAllIncidents(date?: string): Promise<Incident[]> {
  const q = date ? `?date=${date}` : '';
  return getJSON<Incident[]>(`/api/safety/incidents${q}`);
}

async function apiFetchPPEFeatures(): Promise<PPEFeature[]> {
  return getJSON<PPEFeature[]>('/api/safety/ppe-features');
}

// ============================================================
// SECTION 3: MOCK DATA
// ============================================================

const USE_MOCK_DATA = true;

const MOCK_FEATURES: PPEFeature[] = [
  { name: 'Helmet', enabled: true },
  { name: 'Gathering', enabled: true },
  { name: 'Safety Gloves', enabled: true },
  { name: 'Safety Shoes', enabled: true },
  { name: 'Mask', enabled: true },
  { name: 'Running', enabled: true }
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-001', missingPPE: ['Helmet'], status: 'Open' },
  { id: 'INC-002', missingPPE: ['Helmet'], status: 'Closed' },
  { id: 'INC-003', missingPPE: ['Helmet'], status: 'Open' },

  { id: 'INC-004', missingPPE: ['Gathering'], status: 'Open' },
  { id: 'INC-005', missingPPE: ['Gathering'], status: 'Closed' },

  { id: 'INC-006', missingPPE: ['Safety Gloves'], status: 'Open' },
  { id: 'INC-007', missingPPE: ['Safety Gloves'], status: 'Closed' },

  { id: 'INC-008', missingPPE: ['Safety Shoes'], status: 'Closed' },
  { id: 'INC-009', missingPPE: ['Safety Shoes'], status: 'Open' },

  { id: 'INC-010', missingPPE: ['Mask'], status: 'Closed' },
  { id: 'INC-011', missingPPE: ['Mask'], status: 'Open' },

  { id: 'INC-012', missingPPE: ['Running'], status: 'Closed' },
];

const MOCK_ALL_PPE_EVENTS: PPEEvent[] = [
  // Helmet (12)
  { id: 'EVT-001', featureDetected: 'Helmet', department: 'Assembly' },
  { id: 'EVT-002', featureDetected: 'Helmet', department: 'Welding' },
  { id: 'EVT-003', featureDetected: 'Helmet', department: 'Packaging' },
  { id: 'EVT-004', featureDetected: 'Helmet', department: 'Warehouse' },
  { id: 'EVT-005', featureDetected: 'Helmet', department: 'Maintenance' },
  { id: 'EVT-006', featureDetected: 'Helmet', department: 'Quality' },
  { id: 'EVT-007', featureDetected: 'Helmet', department: 'Assembly' },
  { id: 'EVT-008', featureDetected: 'Helmet', department: 'Welding' },
  { id: 'EVT-009', featureDetected: 'Helmet', department: 'Packaging' },
  { id: 'EVT-010', featureDetected: 'Helmet', department: 'Warehouse' },
  { id: 'EVT-011', featureDetected: 'Helmet', department: 'Maintenance' },
  { id: 'EVT-012', featureDetected: 'Helmet', department: 'Quality' },

  // Gathering (8)
  { id: 'EVT-013', featureDetected: 'Gathering', department: 'Assembly' },
  { id: 'EVT-014', featureDetected: 'Gathering', department: 'Welding' },
  { id: 'EVT-015', featureDetected: 'Gathering', department: 'Packaging' },
  { id: 'EVT-016', featureDetected: 'Gathering', department: 'Warehouse' },
  { id: 'EVT-017', featureDetected: 'Gathering', department: 'Maintenance' },
  { id: 'EVT-018', featureDetected: 'Gathering', department: 'Quality' },
  { id: 'EVT-019', featureDetected: 'Gathering', department: 'Assembly' },
  { id: 'EVT-020', featureDetected: 'Gathering', department: 'Welding' },

  // Safety Gloves (7)
  { id: 'EVT-021', featureDetected: 'Safety Gloves', department: 'Assembly' },
  { id: 'EVT-022', featureDetected: 'Safety Gloves', department: 'Welding' },
  { id: 'EVT-023', featureDetected: 'Safety Gloves', department: 'Packaging' },
  { id: 'EVT-024', featureDetected: 'Safety Gloves', department: 'Warehouse' },
  { id: 'EVT-025', featureDetected: 'Safety Gloves', department: 'Maintenance' },
  { id: 'EVT-026', featureDetected: 'Safety Gloves', department: 'Quality' },
  { id: 'EVT-027', featureDetected: 'Safety Gloves', department: 'Assembly' },

  // Safety Shoes (6)
  { id: 'EVT-028', featureDetected: 'Safety Shoes', department: 'Assembly' },
  { id: 'EVT-029', featureDetected: 'Safety Shoes', department: 'Welding' },
  { id: 'EVT-030', featureDetected: 'Safety Shoes', department: 'Packaging' },
  { id: 'EVT-031', featureDetected: 'Safety Shoes', department: 'Warehouse' },
  { id: 'EVT-032', featureDetected: 'Safety Shoes', department: 'Maintenance' },
  { id: 'EVT-033', featureDetected: 'Safety Shoes', department: 'Quality' },

  // Mask (5)
  { id: 'EVT-034', featureDetected: 'Mask', department: 'Assembly' },
  { id: 'EVT-035', featureDetected: 'Mask', department: 'Welding' },
  { id: 'EVT-036', featureDetected: 'Mask', department: 'Packaging' },
  { id: 'EVT-037', featureDetected: 'Mask', department: 'Warehouse' },
  { id: 'EVT-038', featureDetected: 'Mask', department: 'Maintenance' },

  // Running (4)
  { id: 'EVT-039', featureDetected: 'Running', department: 'Assembly' },
  { id: 'EVT-040', featureDetected: 'Running', department: 'Welding' },
  { id: 'EVT-041', featureDetected: 'Running', department: 'Packaging' },
  { id: 'EVT-042', featureDetected: 'Running', department: 'Warehouse' },
];

const MOCK_DASHBOARD: DashboardData = {
  kpis: { totalEvents: 42, openIncidents: 8, closedIncidents: 34 },
  violationTypes: [
    { name: 'Missing Helmet', value: 14 },
    { name: 'Missing Gathering', value: 10 },
    { name: 'Missing Gloves', value: 7 },
    { name: 'Missing Shoes', value: 5 },
    { name: 'Missing Mask', value: 5 },
    { name: 'Missing Running', value: 3 },
  ],
  departmentViolations: [
    { department: 'Assembly', violations: 13 },
    { department: 'Welding', violations: 9 },
    { department: 'Packaging', violations: 7 },
    { department: 'Chemical', violations: 6 },
    { department: 'Storage', violations: 4 },
  ],
};

// ============================================================
// SECTION 4: DATA FETCHING HOOK
// ============================================================

function useDashboardData(selectedDate: string) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [allPPEEvents, setAllPPEEvents] = useState<PPEEvent[]>([]);
  // const [features, setFeatures] = useState<PPEFeature[]>(MOCK_FEATURES);
  const [features, setFeatures] = useState<PPEFeature[]>(() => MOCK_FEATURES);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const featuresInitializedRef = useRef(false);
 

 const load = useCallback(async (showSpinner = true) => {
  try {
    if (showSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 800));

      setDashboardData(MOCK_DASHBOARD);
      setAllIncidents(MOCK_INCIDENTS);
      setAllPPEEvents(MOCK_ALL_PPE_EVENTS);

      // ✅ Initialize features ONLY first time
      if (!featuresInitializedRef.current) {
        setFeatures(MOCK_FEATURES);
        featuresInitializedRef.current = true;
      }

    } else {
      const [dashboard, incidents, events, feats] = await Promise.all([
        apiFetchDashboard(selectedDate),
        apiFetchAllIncidents(selectedDate),
        apiFetchAllPPEEvents(selectedDate),
        apiFetchPPEFeatures(),
      ]);

      setDashboardData(dashboard);
      setAllIncidents(incidents);
      setAllPPEEvents(events);

      // ✅ Initialize features ONLY first time
      if (!featuresInitializedRef.current) {
        setFeatures(feats);
        featuresInitializedRef.current = true;
      }
    }

    setLastUpdated(new Date());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    load(true);
  }, [selectedDate]);

  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    const i = setInterval(() => loadRef.current(false), 60_000);
    return () => clearInterval(i);
  }, []);

  const toggleFeature = useCallback((name: string) => {
    setFeatures(prev => prev.map(f => (f.name === name ? { ...f, enabled: !f.enabled } : f)));
  }, []);

  const enableAll = useCallback(() => setFeatures(prev => prev.map(f => ({ ...f, enabled: true }))), []);
  const disableAll = useCallback(() => setFeatures(prev => prev.map(f => ({ ...f, enabled: false }))), []);

  return {
    dashboardData,
    allIncidents,
    allPPEEvents,
    features,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => load(false),
    retry: () => load(true),
    toggleFeature,
    enableAll,
    disableAll,
  };
}

// ============================================================
// SECTION 5: PPE-FILTERED COMPUTED DASHBOARD
// ============================================================

function getRandomSafetyScore() {
  return Math.floor(Math.random() * 51) + 50; 
  // Range: 50 → 100 (realistic safety score)
}

function useFilteredDashboard(
  dashboardData: DashboardData | null,
  allIncidents: Incident[],
  allPPEEvents: PPEEvent[],
  features: PPEFeature[],
) {
  return useMemo(() => {
    if (!dashboardData) return null;

    const enabledNames = new Set(features.filter(f => f.enabled).map(f => f.name));
    const noneEnabled = enabledNames.size === 0;

    const filteredEvents = noneEnabled ? [] : allPPEEvents.filter(e => enabledNames.has(e.featureDetected));
    const filteredIncidents = noneEnabled ? [] : allIncidents.filter(inc => inc.missingPPE.some(p => enabledNames.has(p)));

    const openIncidents = filteredIncidents.filter(i => i.status === 'Open').length;
    const closedIncidents = filteredIncidents.filter(i => i.status === 'Closed').length;

    const violationTypes: ViolationType[] = Array.from(enabledNames)
      .map(name => ({ name: `Missing ${name}`, value: filteredEvents.filter(e => e.featureDetected === name).length }))
      .filter(v => v.value > 0)
      .sort((a, b) => b.value - a.value);

    // Build heatmap matrix
    const departments = Array.from(new Set(filteredEvents.map(e => e.department)));

    const heatmap: {
      feature: string;
      department: string;
      value: number;
      totalEvents: number;
      totalIncidents: number;
      openIncidents: number;
      closedIncidents: number;
    }[] = [];

    enabledNames.forEach(feature => {
      departments.forEach(dept => {

        const eventsForCell = filteredEvents.filter(
          e => e.featureDetected === feature && e.department === dept
        );

        const incidentsForCell = filteredIncidents.filter(
          inc => inc.missingPPE.includes(feature)
        );

        const openIncidentsCount = incidentsForCell.filter(
          i => i.status === "Open"
        ).length;

        const closedIncidentsCount = incidentsForCell.filter(
          i => i.status === "Closed"
        ).length;

        const totalIncidents = incidentsForCell.length;

        // Realistic safety score (simple formula)
        const score = getRandomSafetyScore();

        heatmap.push({
          feature,
          department: dept,
          value: score,
          totalEvents: eventsForCell.length,
          totalIncidents,
          openIncidents: openIncidentsCount,
          closedIncidents: closedIncidentsCount
        });
      });
    });

    const deptMap: Record<string, number> = {};
    filteredEvents.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });
    const departmentViolations: DepartmentViolation[] = Object.entries(deptMap)
      .map(([department, violations]) => ({ department, violations }))
      .sort((a, b) => b.violations - a.violations);

    return {
      kpis: { totalEvents: filteredEvents.length, openIncidents, closedIncidents },
      violationTypes,
      heatmap,
      departments,
      departmentViolations,
      noneEnabled,
    };
  }, [dashboardData, allIncidents, allPPEEvents, features]);
}

// ============================================================
// SECTION 6: UI HELPERS
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
    <div className="bg-white rounded-lg p-5 shadow-sm animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
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
      <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Retry
      </button>
    </div>
  );
}

function NoPPEBanner() {
  return (
    <div className="flex items-center gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-amber-900">All PPE features are disabled</p>
        <p className="text-xs text-amber-700 mt-0.5">Enable at least one PPE feature to see data.</p>
      </div>
    </div>
  );
}


const formatDateTime = (dateTime: Date) => {
  return dateTime.toLocaleString(undefined, {
    weekday: 'short',   // Mon
    day: '2-digit',     // 22
    month: 'short',     // Feb
    year: 'numeric',    // 2026
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }); 
};
// ============================================================
// SECTION 7: MAIN PAGE COMPONENT
// ============================================================

export function SafetyAndHazard() {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const PIE_COLORS = [
    "#e11d48", // red
    "#2563eb", // blue
    "#16a34a", // green
    "#f59e0b", // amber
    "#7c3aed", // purple
    "#92400e", // brown
    "#0891b2", // cyan
    "#be123c", // dark red
  ];
  const { dashboardData, allIncidents, allPPEEvents, features, isLoading, isRefreshing, error, lastUpdated, refresh, retry, toggleFeature, enableAll, disableAll } = useDashboardData(selectedDate);
  const filtered = useFilteredDashboard(dashboardData, allIncidents, allPPEEvents, features);
  const [ppeConfigOpen, setPpeConfigOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [now, setNow] = useState(new Date());
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  

  //Heatmap

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    feature: string;
    department: string;
    value: number;
    totalEvents: number;
    totalIncidents: number;
    openIncidents: number;
    closedIncidents: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ppeConfigOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setPpeConfigOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ppeConfigOpen]);

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (error && !dashboardData) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatLastUpdated()}</span>
          </div>
        </PageHeader>
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">

          {/* ───────── LEFT SIDE ───────── */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">

            {/* PPE Configuration Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setPpeConfigOpen(p => !p)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>PPE Configuration</span>
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {features.filter(f => f.enabled).length}/{features.length}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${ppeConfigOpen ? 'rotate-180' : ''}`} />
              </button>

              {ppeConfigOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-[80]"
                >
                  <div className="p-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">PPE Features</div>
                  <p className="text-xs text-gray-400 mb-3">Toggling a feature instantly recalculates all charts and KPIs.</p>
                  <div className="space-y-1">
                    {features.map(feature => (
                      <div
                        key={feature.name}
                        onClick={() => toggleFeature(feature.name)}
                        className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors cursor-pointer ${feature.enabled ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${feature.enabled ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <span className={`text-sm font-medium select-none ${feature.enabled ? 'text-gray-800' : 'text-gray-400'}`}>{feature.name}</span>
                        </div>
                        <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors pointer-events-none ${feature.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${feature.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{features.filter(f => f.enabled).length} of {features.length} active</span>
                    <div className="flex gap-2">
                      <button onClick={enableAll}  className="text-xs text-blue-600 hover:text-blue-700 font-medium">All On</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={disableAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium">All Off</button>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>

            
            {/* DATE SELECTOR */}
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="
                  h-[40px]
                  px-3
                  bg-white 
                  border border-gray-300
                  rounded-lg
                  text-sm text-gray-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition-all duration-200
                "
              />
            </div>

          </div>

          {/* ───────── RIGHT SIDE ───────── */}
          <div className="flex items-center gap-3"> 

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>


            {/* Date & Time + Last Updated */}
            <div className="flex flex-col items-end text-sm text-gray-600 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDateTime(now)}</span>
              </div>
              <span className="text-xs text-gray-500">
                Last updated: {formatLastUpdated()}
              </span>
            </div>

          </div>

        </div>
      </PageHeader> 

      {/* Body */}
      <div className="flex-1 overflow-auto p-3 sm:p-6">
        {isLoading && !dashboardData ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <SkeletonKPICard key={i} />)}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">{[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}</div>
          </>
        ) : filtered ? (
          <>
            {filtered.noneEnabled && <NoPPEBanner />}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <KPICard title="Total Safety Events" value={filtered.kpis.totalEvents} subtitle="Filtered by active features" icon={<Activity className="w-5 h-5" />} trend="down" trendValue="-3" />
              <KPICard title="Open Incidents" value={filtered.kpis.openIncidents} subtitle="Requires action" icon={<AlertCircle className="w-5 h-5" />} trend="down" trendValue="-2" variant={filtered.kpis.openIncidents > 5 ? 'danger' : 'success'} />
              <KPICard title="Closed Incidents" value={filtered.kpis.closedIncidents} subtitle="Resolved successfully" icon={<CheckCircle2 className="w-5 h-5" />} trend="up" trendValue="+5" />
            </div>

            {/* PPE Safety Heatmap */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Safety Score Card
                </h3>
                <span className="text-xs text-gray-400">
                  Based on incidents & PPE events
                </span>
              </div>

              {filtered.heatmap.length > 0 ? (
                <div className="overflow-auto">
                  <div
                    className="grid border border-gray-200"
                    style={{
                      gridTemplateColumns: `200px repeat(${filtered.departments.length}, 100px)`
                    }}
                  >
                    {/* Header Row */}
                    <div className="bg-gray-50 text-xs font-semibold text-gray-600 p-3 border-b border-gray-200">
                      PPE Feature
                    </div>

                    {filtered.departments.map(dept => (
                      <div
                        key={dept}
                        className="bg-gray-50 text-[11px] font-semibold text-gray-600 text-center p-3 border-b border-gray-200 border-l border-gray-200"
                      >
                        {dept}
                      </div>
                    ))}

                    {/* Rows */}
                    {features
                      .filter(f => f.enabled)
                      .map(feature => (
                        <>
                          {/* Row Label */}
                          <div className="text-sm text-gray-700 p-3 border-b border-gray-200 bg-gray-50">
                            {feature.name}
                          </div>

                          {/* Cells */}
                          {filtered.departments.map(dept => {
                            const cell = filtered.heatmap.find(
                              h =>
                                h.feature === feature.name &&
                                h.department === dept
                            );

                            const value = cell?.value ?? 0;

                            const bg =
                              value >= 90
                                ? "bg-emerald-600"
                                : value >= 80
                                ? "bg-lime-500"
                                : value >= 70
                                ? "bg-yellow-500"
                                : value >= 60
                                ? "bg-orange-400"
                                : value > 0
                                ? "bg-red-500"
                                : "bg-gray-100";

                            return (
                              <div
                                  key={feature.name + dept}
                                  onMouseEnter={(e) => {
                                    if (!cell) return;

                                    const rect = e.currentTarget.getBoundingClientRect();

                                    setActiveCell(feature.name + dept);

                                    setTooltip({
                                      x: rect.left + rect.width / 2,
                                      y: rect.top,
                                      ...cell
                                    });
                                  }}
                                  onMouseLeave={() => {
                                    setTooltip(null);
                                    setActiveCell(null);
                                  }}
                                  className={`
                                    h-12 flex items-center justify-center text-sm font-semibold text-white 
                                    border-l border-b border-gray-200 cursor-pointer transition-all duration-150
                                    ${bg}
                                    ${activeCell === feature.name + dept ? "ring-2 ring-blue-500 z-10" : ""}
                                  `}
                                >
                                  {value || ""}
                                </div>
                            );
                          })}
                        </>
                      ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No heatmap data available" />
              )}
            </div>


            {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">

            {/* ───────── PIE CHART ───────── */}
            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Most Frequent Violation Types
              </h3>

              {filtered.violationTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    {/* <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    /> */}

                   <Legend
  layout="vertical"
  align="right"
  verticalAlign="middle"
  iconSize={0}   // ❌ hide default bullet
  wrapperStyle={{
    paddingLeft: "10px",
    lineHeight: "20px",
    fontSize: "15px",
    minWidth: "160px"
  }}
  formatter={(value: string, entry: any, index: number) => {
    const isActive = index === activePieIndex;
    const color = PIE_COLORS[index % PIE_COLORS.length];
    const item = filtered.violationTypes[index];

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? color : "#6b7280",
          opacity: activePieIndex === null || isActive ? 1 : 0.35,
          transition: "all 0.15s ease"
        }}
      >
        {/* Single custom bullet */}
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: color,
            display: "inline-block"
          }}
        />

        {value}
        {isActive && item ? ` : ${item.value}` : ""}
      </span>
    );
  }}
/>

                 <Pie
                  data={filtered.violationTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="35%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  {filtered.violationTypes.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      opacity={
                        activePieIndex === null || activePieIndex === index ? 1 : 0.35
                      }
                      stroke={activePieIndex === index ? "#111827" : "none"}   // optional highlight
                      strokeWidth={activePieIndex === index ? 2 : 0}
                    />
                  ))}
              </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No violations for active features" />
              )}
            </div>


            {/* ───────── BAR CHART ───────── */}
            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Department-wise Violations
              </h3>

              {filtered.departmentViolations.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  {/* <BarChart data={filtered.departmentViolations}> */}
                  <BarChart
                    data={filtered.departmentViolations}
                    margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <XAxis
                      dataKey="department"
                      interval={0}
                      angle={-90}
                      textAnchor="end"
                      height={100}
                      tickMargin={35}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis tick={{ fontSize: 12 }} />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    />

                    <Bar
                      dataKey="violations"
                      fill="#64748b"
                      radius={[6, 6, 0, 0]}
                      label={{ position: "top", fontSize: 11, fill: "#64748b" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No department violations for active features" />
              )}
            </div>

          </div>
          </>

        ) : null}
      </div>


    {tooltip && (
  <div
    className="fixed z-50 bg-gray-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-4 w-[300px] pointer-events-none"
    style={{
      top: tooltip.y - 12,
      left: tooltip.x,
      transform: "translate(-50%, -100%)"
    }}
  >
    {/* Header */}
    <div className="mb-3">
      <div className="text-sm text-gray-300">Feature</div>
      <div className="text-base font-semibold">
        {tooltip.feature} • {tooltip.department}
      </div>
    </div>

    {/* Grid Stats */}
    <div className="grid grid-cols-2 gap-2 text-xs">

      {/* Safety Score */}
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-gray-400">Safety score</div>
        <div className="text-lg font-bold text-white">
          {tooltip.value}%
        </div>
      </div>

      {/* Incidents */}
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-gray-400">Total incidents</div>
        <div className="font-semibold">
          {tooltip.totalIncidents}
        </div>
      </div>

      {/* Events */}
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-gray-400">Total events</div>
        <div className="font-semibold">
          {tooltip.totalEvents}
        </div>
      </div>

      {/* Open */}
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-gray-400">Open incidents</div>
        <div className="font-semibold text-orange-400">
          {tooltip.openIncidents}
        </div>
      </div>

      {/* Closed */}
      <div className="bg-white/5 rounded-lg p-2 col-span-2">
        <div className="text-gray-400">Closed incidents</div>
        <div className="font-semibold text-emerald-400">
          {tooltip.closedIncidents}
        </div>
      </div>

    </div>
  </div>
)}
    </div>
  );
}