// ============================================================
// CentralCommand.tsx - Production Ready with API Integration
// ============================================================
// Features:
// ✅ Back button navigation
// ✅ Manual refresh button
// ✅ Auto-refresh every 60 seconds
// ✅ Fully responsive design (works on all screen sizes)
// ✅ API-ready with getJSON integration
// ✅ Mock data fallback
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, AlertTriangle, Users, Truck, Shield, HardHat, 
  TrendingUp, BarChart3, Flame, Eye, Clock, UserCheck, Leaf, 
  Wrench, TrendingDown as TrendDown, TrendingUp as TrendUp,
  Factory, ChevronDown, Circle, RefreshCw, ArrowLeft, AlertOctagon, Check
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { getJSON } from '../api';

// ============================================================
// SECTION 1: TYPE DEFINITIONS
// ============================================================

export interface DashboardData {
  // Top KPIs
  overallStatus: 'healthy' | 'warning' | 'critical';
  statusPercentage: number;
  criticalAlerts: number;
  totalPeopleInside: number;
  totalVehiclesInside: number;
  
  // Module Cards
  intrusionAttempts: number;
  ppeCompliance: number;
  productivity: number;
  defectRate: number;
  hazardAlerts: number;
  anomalyEvents: number;
  avgTurnaroundTime: string;
  employeesPresent: number;
  airQualityIndex: number;
  machinesAtRisk: number;
  
  // Charts
  plantStatusData: Array<{ name: string; value: number; color: string }>;
  productivityTrend: Array<{ value: number }>;
  productionTrendData: Array<{ time: string; value: number }>;
  ppeComplianceData: Array<{ name: string; value: number; color: string }>;
  equipmentStatusData: Array<{ name: string; value: number; color: string }>;
  departmentPerformanceData: Array<{ name: string; value: number; color: string }>;
  energyConsumptionData: Array<{ hour: string; value: number }>;
  weeklyAlertsData: Array<{ day: string; critical: number; warning: number; info: number }>;
}

// ============================================================
// SECTION 2: API SERVICE LAYER
// ============================================================

async function apiFetchDashboard(plantId: string): Promise<DashboardData> {
  return getJSON<DashboardData>(`/api/central-command/dashboard?plantId=${plantId}`);
}

// ============================================================
// SECTION 3: MOCK DATA
// ============================================================

const USE_MOCK_DATA = true;

const MOCK_DASHBOARD: DashboardData = {
  overallStatus: 'healthy',
  statusPercentage: 92,
  criticalAlerts: 0,
  totalPeopleInside: 342,
  totalVehiclesInside: 28,
  
  intrusionAttempts: 0,
  ppeCompliance: 98,
  productivity: 94,
  defectRate: 1.2,
  hazardAlerts: 0,
  anomalyEvents: 3,
  avgTurnaroundTime: '24m',
  employeesPresent: 342,
  airQualityIndex: 78,
  machinesAtRisk: 2,
  
  plantStatusData: [
    { name: 'Operational', value: 92, color: '#10b981' },
    { name: 'Warning', value: 6, color: '#f59e0b' },
    { name: 'Critical', value: 2, color: '#ef4444' },
  ],
  
  productivityTrend: [
    { value: 85 }, { value: 87 }, { value: 90 }, { value: 88 }, 
    { value: 92 }, { value: 94 }, { value: 94 }
  ],
  
  productionTrendData: [
    { time: '04:00', value: 78 },
    { time: '06:00', value: 82 },
    { time: '08:00', value: 86 },
    { time: '10:00', value: 92 },
    { time: '12:00', value: 96 },
    { time: '14:00', value: 98 },
    { time: '16:00', value: 95 },
    { time: '18:00', value: 91 },
    { time: '20:00', value: 86 },
    { time: '22:00', value: 80 },
  ],
  
  ppeComplianceData: [
    { name: 'Compliant', value: 99, color: '#10b981' },
    { name: 'Non-Compliant', value: 1, color: '#ef4444' },
  ],
  
  equipmentStatusData: [
    { name: 'Operational', value: 42, color: '#10b981' },
    { name: 'Maintenance', value: 3, color: '#f59e0b' },
    { name: 'Offline', value: 1, color: '#ef4444' },
  ],
  
  departmentPerformanceData: [
    { name: 'Assembly', value: 98, color: '#10b981' },
    { name: 'Quality', value: 89, color: '#3b82f6' },
    { name: 'Maintenance', value: 93, color: '#3b82f6' },
    { name: 'Logistics', value: 91, color: '#3b82f6' },
    { name: 'Production', value: 85, color: '#3b82f6' },
  ],
  
  energyConsumptionData: [
    { hour: '00', value: 280 },
    { hour: '03', value: 250 },
    { hour: '06', value: 320 },
    { hour: '09', value: 480 },
    { hour: '12', value: 680 },
    { hour: '15', value: 720 },
    { hour: '18', value: 580 },
    { hour: '21', value: 380 },
  ],
  
  weeklyAlertsData: [
    { day: 'Mon', critical: 2, warning: 5, info: 12 },
    { day: 'Tue', critical: 1, warning: 7, info: 15 },
    { day: 'Wed', critical: 0, warning: 4, info: 13 },
    { day: 'Thu', critical: 2, warning: 3, info: 14 },
    { day: 'Fri', critical: 1, warning: 6, info: 11 },
    { day: 'Sat', critical: 0, warning: 2, info: 8 },
    { day: 'Sun', critical: 1, warning: 3, info: 5 },
  ],
};

// ============================================================
// SECTION 4: DATA FETCHING HOOK
// ============================================================

function useDashboardData(plantId: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const load = useCallback(async (showSpinner = true) => {
    try {
      showSpinner ? setIsLoading(true) : setIsRefreshing(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 800));
        setData(MOCK_DASHBOARD);
      } else {
        const result = await apiFetchDashboard(plantId);
        setData(result);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [plantId]);

  useEffect(() => { load(true); }, [load]);

  // Auto-refresh every 60 seconds
  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    const interval = setInterval(() => loadRef.current(false), 60_000);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => load(false),
    retry: () => load(true),
  };
}

// ============================================================
// SECTION 5: UI HELPERS
// ============================================================

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-lg font-medium text-gray-800 mb-2">Failed to Load Dashboard</p>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ============================================================
// SECTION 6: PLANT CONFIGURATION
// ============================================================

const PLANTS = [
  { id: 'plant-a-main', name: 'Plant A - Main', shortName: 'Plant A' },
  { id: 'plant-a-secondary', name: 'Plant A - Secondary', shortName: 'Plant A2' },
  { id: 'plant-b-main', name: 'Plant B - Main', shortName: 'Plant B' },
] as const;

function getPlantDisplayName(plantId: string): string {
  return PLANTS.find(p => p.id === plantId)?.name || 'Plant A - Main';
}

function getPlantShortName(plantId: string): string {
  return PLANTS.find(p => p.id === plantId)?.shortName || 'Plant A';
}

// ============================================================
// SECTION 7: MAIN COMPONENT
// ============================================================

export function CentralCommand() {
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState('plant-a-main');
  const [plantSelectorOpen, setPlantSelectorOpen] = useState(false);
  
  const { data, isLoading, isRefreshing, error, lastUpdated, refresh, retry } = useDashboardData(selectedPlant);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  // Equipment uptime calculation
  const totalEquipment = data?.equipmentStatusData.reduce((sum, item) => sum + item.value, 0) || 0;
  const equipmentUptime = totalEquipment > 0 ? Math.round((data!.equipmentStatusData[0].value / totalEquipment) * 100) : 0;

  if (error && !data) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-150"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Plant Monitoring – Central Command</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Back Button + Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-150 flex-shrink-0"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Plant Monitoring – Central Command</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time operational overview</p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Plant Selector */}
            <div className="relative">
              <button
                onClick={() => setPlantSelectorOpen(!plantSelectorOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Factory className="w-4 h-4" />
                <span className="hidden sm:inline">{getPlantDisplayName(selectedPlant)}</span>
                <span className="sm:hidden">{getPlantShortName(selectedPlant)}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {plantSelectorOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setPlantSelectorOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40">
                    {PLANTS.map(plant => (
                      <button
                        key={plant.id}
                        onClick={() => {
                          setSelectedPlant(plant.id);
                          setPlantSelectorOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-blue-50 flex items-center justify-between transition-colors ${
                          selectedPlant === plant.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-700 font-medium'
                        }`}
                      >
                        <span>{plant.name}</span>
                        {selectedPlant === plant.id && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Date & Time - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{getCurrentDateTime()}</span>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-700">{data?.overallStatus || 'Loading'}</span>
            </div>

            {/* Last Updated - Mobile */}
            <div className="text-xs text-gray-500 lg:hidden w-full sm:w-auto text-center sm:text-left">
              Updated: {formatLastUpdated()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {isLoading && !data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : data ? (
          <>
            {/* Top Summary Row - 4 Large KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Overall Plant Status */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Overall Plant Status</h3>
                    <div className="flex items-center gap-2">
                      <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{data.overallStatus}</span>
                    </div>
                  </div>
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-center mt-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.plantStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {data.plantStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base sm:text-lg font-bold text-gray-900">{data.statusPercentage}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center mt-2">All systems operational</p>
              </div>

              {/* Active Critical Alerts */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Critical Alerts</h3>
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">{data.criticalAlerts}</div>
                <p className="text-sm text-gray-600">No critical issues</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendDown className="w-3 h-3" />
                  <span>-100% vs yesterday</span>
                </div>
              </div>

              {/* Total People Inside */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total People Inside</h3>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{data.totalPeopleInside}</div>
                <p className="text-sm text-gray-600">Currently on premises</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendUp className="w-3 h-3" />
                  <span>+8 vs yesterday</span>
                </div>
              </div>

              {/* Total Vehicles Inside */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Vehicles Inside</h3>
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{data.totalVehiclesInside}</div>
                <p className="text-sm text-gray-600">Active vehicles</p>
                <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                  <TrendDown className="w-3 h-3" />
                  <span>-2 vs yesterday</span>
                </div>
              </div>
            </div>

            {/* Module Grid - Responsive 2x5 layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Security & Intrusion */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Security & Intrusion</h3>
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{data.intrusionAttempts}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Intrusion Attempts Today</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600">
                  <TrendDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>0% vs yesterday</span>
                </div>
              </div>

              {/* Worker Safety */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker Safety</h3>
                  <HardHat className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{data.ppeCompliance}%</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">PPE Compliance %</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600">
                  <TrendUp className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>+2% vs yesterday</span>
                </div>
              </div>

              {/* Productivity */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Productivity</h3>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1">{data.productivity}%</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-1">Line Productivity %</p>
                
                <div className="h-6 sm:h-8 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.productivityTrend}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 mt-1">
                  <TrendUp className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>+3% vs yesterday</span>
                </div>
              </div>

              {/* Quality Control */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality Control</h3>
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{data.defectRate}%</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Defect Rate %</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600">
                  <TrendDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>-0.3% vs yesterday</span>
                </div>
              </div>

              {/* Fire & Hazard */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Fire & Hazard</h3>
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{data.hazardAlerts}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Hazard Alerts Today</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600">
                  <TrendDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>0% vs yesterday</span>
                </div>
              </div>

              {/* Behavior Monitoring */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Behavior Monitoring</h3>
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">{data.anomalyEvents}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Anomaly Events Today</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-600">
                  <TrendUp className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>+1 vs yesterday</span>
                </div>
              </div>

              {/* Vehicle Monitoring */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle Monitoring</h3>
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1">{data.avgTurnaroundTime}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-1">Avg Turnaround Time</p>
                
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-[10px] text-gray-500">68%</span>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 mt-2">
                  <TrendDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>-2m vs yesterday</span>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</h3>
                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{data.employeesPresent}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Employees Present Today</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600">
                  <TrendUp className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>+8 vs yesterday</span>
                </div>
              </div>

              {/* Environmental */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Environmental</h3>
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-center my-2 sm:my-3">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                      <circle
                        cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="6" fill="none"
                        strokeDasharray={`${(data.airQualityIndex / 100) * 201} 201`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">{data.airQualityIndex}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] sm:text-xs text-gray-600 text-center mb-1">Air Quality Index</p>
                <p className="text-[10px] sm:text-xs text-green-600 text-center font-medium">(Good)</p>
              </div>

              {/* Predictive Maintenance */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Predictive Maintenance</h3>
                  <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">{data.machinesAtRisk}</div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">Machines at Risk</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-600">
                  <TrendUp className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>+1 vs yesterday</span>
                </div>
              </div>
            </div>

            {/* Bottom Charts Section - Responsive 2 Rows x 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Production Output Trend (24H) */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">Production Output Trend (24H)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.productionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* PPE Compliance Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">PPE Compliance Distribution</h3>
                <div className="flex items-center justify-center h-[200px]">
                  <div className="relative">
                    <ResponsiveContainer width={220} height={200}>
                      <PieChart>
                        <Pie data={data.ppeComplianceData} cx="50%" cy="50%" innerRadius={0} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                          {data.ppeComplianceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-xs text-gray-500">Non-</div>
                      <div className="text-xs text-gray-500">Compliant</div>
                      <div className="text-lg font-bold text-red-600 mt-1">{data.ppeComplianceData[1].value}%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="text-[10px] sm:text-xs text-gray-600">Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <span className="text-[10px] sm:text-xs text-gray-600">Non-Compliant</span>
                  </div>
                </div>
              </div>

              {/* Equipment Status Overview */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">Equipment Status Overview</h3>
                <div className="flex items-center justify-center h-[140px]">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                    <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 144 144">
                      <circle cx="72" cy="72" r="58" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                      <circle
                        cx="72" cy="72" r="58" stroke="#10b981" strokeWidth="16" fill="none"
                        strokeDasharray={`${(data.equipmentStatusData[0].value / totalEquipment) * 364} 364`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="72" cy="72" r="58" stroke="#f59e0b" strokeWidth="16" fill="none"
                        strokeDasharray={`${(data.equipmentStatusData[1].value / totalEquipment) * 364} 364`}
                        strokeDashoffset={`-${(data.equipmentStatusData[0].value / totalEquipment) * 364}`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="72" cy="72" r="58" stroke="#ef4444" strokeWidth="16" fill="none"
                        strokeDasharray={`${(data.equipmentStatusData[2].value / totalEquipment) * 364} 364`}
                        strokeDashoffset={`-${((data.equipmentStatusData[0].value + data.equipmentStatusData[1].value) / totalEquipment) * 364}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">{equipmentUptime}%</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-1">Equipment Uptime</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3 sm:mt-4 px-1 sm:px-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <span className="text-[10px] sm:text-xs text-gray-600">Operational: {data.equipmentStatusData[0].value}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] sm:text-xs text-gray-600">Maintenance: {data.equipmentStatusData[1].value}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <span className="text-[10px] sm:text-xs text-gray-600">Offline: {data.equipmentStatusData[2].value}</span>
                  </div>
                </div>
              </div>

              {/* Department Performance (%) */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">Department Performance (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {data.departmentPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Energy Consumption (kWh) */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">Energy Consumption (kWh)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.energyConsumptionData}>
                    <defs>
                      <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 800]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#energyGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Alerts Trend */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">Weekly Alerts Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.weeklyAlertsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 20]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
                    <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} name="Critical" />
                    <Bar dataKey="warning" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Warning" />
                    <Bar dataKey="info" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Info" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}