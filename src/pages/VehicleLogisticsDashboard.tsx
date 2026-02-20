

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, TrendingUp, AlertCircle, Circle,
  Eye, Clock, Truck, Car, X, ChevronRight, User, RefreshCw, AlertOctagon, ArrowLeft
} from 'lucide-react';
import { KPICard, PageHeader } from '../components/SharedComponents';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';



export interface VehicleKPIs {
  totalEntriesToday: number;
  entriesTrend: string;         
  totalExitsToday: number;
  exitsTrend: string;        
  currentYardCount: number;
  activeAlerts: number;
}


export interface YardVehicle {
  id: string;
  status: 'loading' | 'unloading' | 'in-yard' | 'waiting';
  plate: string;
  type: 'Truck' | 'Van' | 'Sedan' | 'SUV' | 'Trailer';
  driver: string;
  location: string;
  duration: string;           
  isVisitor: boolean;
}


export interface TrafficPoint {
  time: string;               
  entries: number;
  exits: number;
}


export interface GateFeedEntry {
  id: string;
  plate: string;
  time: string;                
  gate: string;              
  direction: 'entry' | 'exit';
}


export interface Station {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance';
  vehicle: string | null;       
  driver: string | null;
  progress: number;            
  estimatedTime: string;    
  startTime: string | null;   
  estimatedCompletion: string | null;
  cargo: string | null;
  lastMaintenance: string;    
  nextMaintenance: string;   
}


export interface VehicleListItem {
  id: string;
  plate: string;
  type: string;
  driver: string;
  time: string;
  gate: string;
  location: string;
  isVisitor: boolean;
  flags: Array<'DELAYED' | 'DEVIATION'>;
}


export interface VehicleAlert {
  id: string;
  plate: string;
  type: string;
  driver: string;
  time: string;
  location: string;
  alertType: string;
  isVisitor: boolean;
}


export interface RegisterVehiclePayload {
  vehicleType: 'employee' | 'visitor';
  plate: string;
  type: string;
  driver: string;
  destination: string;
  initialStatus: string;
}

// ============================================================
// SECTION 2: API SERVICE LAYER
// ============================================================

// 🔌 STEP 1: Change this to your real API server URL
const BASE_URL = 'https://your-api-server.com'; // ← CHANGE THIS

// 🔌 STEP 2: Uncomment the Authorization header if your API needs auth
const getAuthHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // ← UNCOMMENT IF NEEDED
});

async function apiFetchKPIs(): Promise<VehicleKPIs> {
  const r = await fetch(`${BASE_URL}/api/vehicles/kpis`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`KPIs failed: ${r.status}`);
  return r.json();
}

async function apiFetchYardVehicles(status: 'all' | 'loading' | 'unloading'): Promise<YardVehicle[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/yard?status=${status}`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Yard vehicles failed: ${r.status}`);
  return r.json();
}

async function apiFetchTrafficTrends(): Promise<TrafficPoint[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/traffic-trends`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Traffic trends failed: ${r.status}`);
  return r.json();
}

async function apiFetchGateFeed(): Promise<GateFeedEntry[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/gate-feed`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Gate feed failed: ${r.status}`);
  return r.json();
}

async function apiFetchStations(): Promise<Station[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/stations`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Stations failed: ${r.status}`);
  return r.json();
}

async function apiFetchEntries(): Promise<VehicleListItem[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/entries`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Entries failed: ${r.status}`);
  return r.json();
}

async function apiFetchExits(): Promise<VehicleListItem[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/exits`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Exits failed: ${r.status}`);
  return r.json();
}

async function apiFetchYardAll(): Promise<VehicleListItem[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/yard-all`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Yard-all failed: ${r.status}`);
  return r.json();
}

async function apiFetchAlerts(): Promise<VehicleAlert[]> {
  const r = await fetch(`${BASE_URL}/api/vehicles/alerts`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`Alerts failed: ${r.status}`);
  return r.json();
}

async function apiRegisterVehicle(payload: RegisterVehiclePayload): Promise<{ success: boolean }> {
  const r = await fetch(`${BASE_URL}/api/vehicles/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Register failed: ${r.status}`);
  return r.json();
}

// ============================================================
// SECTION 3: MOCK / FALLBACK DATA
// ============================================================

// 🔌 STEP 3: Change to false when your real API is ready
const USE_MOCK_DATA = true; 

const MOCK_KPIS: VehicleKPIs = {
  totalEntriesToday: 247, entriesTrend: '+12%',
  totalExitsToday: 189,   exitsTrend: '+8%',
  currentYardCount: 58,
  activeAlerts: 3,
};

const MOCK_YARD_VEHICLES: YardVehicle[] = [
  { id: '1', status: 'loading',   plate: 'ABC-1234', type: 'Truck', driver: 'John Smith',    location: 'Dock 12',         duration: '45 min',   isVisitor: false },
  { id: '2', status: 'in-yard',   plate: 'VIS-5678', type: 'Sedan', driver: 'Sarah Johnson', location: 'Visitor Parking', duration: '1h 15min', isVisitor: true  },
  { id: '3', status: 'unloading', plate: 'DEF-9012', type: 'Truck', driver: 'Mike Wilson',   location: 'Zone C',          duration: '30 min',   isVisitor: false },
  { id: '4', status: 'waiting',   plate: 'VIS-3456', type: 'SUV',   driver: 'Emily Davis',   location: 'Visitor Parking', duration: '20 min',   isVisitor: true  },
  { id: '5', status: 'loading',   plate: 'JKL-7890', type: 'Truck', driver: 'Robert Brown',  location: 'Dock 3',          duration: '15 min',   isVisitor: false },
  { id: '6', status: 'in-yard',   plate: 'MNO-2345', type: 'Van',   driver: 'Lisa Anderson', location: 'Zone B',          duration: '5 min',    isVisitor: false },
];

const MOCK_TRAFFIC: TrafficPoint[] = [
  { time: '6 AM',  entries: 12, exits: 5  },
  { time: '8 AM',  entries: 45, exits: 8  },
  { time: '10 AM', entries: 38, exits: 22 },
  { time: '12 PM', entries: 28, exits: 35 },
  { time: '2 PM',  entries: 42, exits: 30 },
  { time: '4 PM',  entries: 35, exits: 48 },
  { time: '6 PM',  entries: 18, exits: 52 },
];

const MOCK_GATE_FEED: GateFeedEntry[] = [
  { id: 'g1', plate: 'PQR-8765', time: '11:45 AM', gate: 'Gate 1', direction: 'entry' },
  { id: 'g2', plate: 'STU-4321', time: '11:42 AM', gate: 'Gate 2', direction: 'entry' },
  { id: 'g3', plate: 'VWX-9876', time: '11:38 AM', gate: 'Gate 1', direction: 'exit'  },
  { id: 'g4', plate: 'YZA-5432', time: '11:35 AM', gate: 'Gate 3', direction: 'entry' },
  { id: 'g5', plate: 'BCD-1098', time: '11:30 AM', gate: 'Gate 2', direction: 'exit'  },
];

const MOCK_STATIONS: Station[] = [
  { id: 's1', name: 'Dock 1', status: 'active',      vehicle: 'ABC-1234', driver: 'John Smith',   progress: 75, estimatedTime: '1.5h', startTime: '10:30 AM', estimatedCompletion: '12:00 PM', cargo: 'Electronics & Equipment', lastMaintenance: '2 days ago', nextMaintenance: '5 days' },
  { id: 's2', name: 'Dock 2', status: 'idle',        vehicle: null,       driver: null,           progress: 0,  estimatedTime: '',     startTime: null,       estimatedCompletion: null,       cargo: null,                     lastMaintenance: '5 days ago', nextMaintenance: '2 days' },
  { id: 's3', name: 'Dock 3', status: 'active',      vehicle: 'DEF-9012', driver: 'Mike Wilson',  progress: 45, estimatedTime: '2h',   startTime: '11:00 AM', estimatedCompletion: '01:00 PM', cargo: 'Auto Parts',             lastMaintenance: '1 day ago',  nextMaintenance: '6 days' },
  { id: 's4', name: 'Dock 4', status: 'idle',        vehicle: null,       driver: null,           progress: 0,  estimatedTime: '',     startTime: null,       estimatedCompletion: null,       cargo: null,                     lastMaintenance: '3 days ago', nextMaintenance: '4 days' },
  { id: 's5', name: 'Dock 5', status: 'maintenance', vehicle: null,       driver: null,           progress: 0,  estimatedTime: '',     startTime: null,       estimatedCompletion: null,       cargo: null,                     lastMaintenance: 'Today',      nextMaintenance: '7 days' },
  { id: 's6', name: 'Dock 6', status: 'active',      vehicle: 'JKL-7890', driver: 'Robert Brown', progress: 20, estimatedTime: '3h',   startTime: '11:30 AM', estimatedCompletion: '02:30 PM', cargo: 'Industrial Machinery',   lastMaintenance: '4 days ago', nextMaintenance: '3 days' },
];

const MOCK_ENTRIES: VehicleListItem[] = [
  { id: 'e1', plate: 'ABC-1234', type: 'Truck',   driver: 'John Smith',    time: '08:30 AM', gate: 'Gate 1', location: 'Dock 12',         isVisitor: false, flags: ['DELAYED'] },
  { id: 'e2', plate: 'VIS-5678', type: 'Sedan',   driver: 'Sarah Johnson', time: '09:15 AM', gate: 'Gate 2', location: 'Visitor Parking', isVisitor: true,  flags: [] },
  { id: 'e3', plate: 'DEF-9012', type: 'Truck',   driver: 'Mike Wilson',   time: '10:00 AM', gate: 'Gate 1', location: 'Zone C',          isVisitor: false, flags: ['DEVIATION', 'DELAYED'] },
  { id: 'e4', plate: 'GHI-3456', type: 'Trailer', driver: 'Emily Davis',   time: '10:30 AM', gate: 'Gate 3', location: 'Dock 4',          isVisitor: false, flags: [] },
  { id: 'e5', plate: 'JKL-7890', type: 'Truck',   driver: 'Robert Brown',  time: '11:00 AM', gate: 'Gate 2', location: 'Dock 3',          isVisitor: false, flags: [] },
];

const MOCK_EXITS: VehicleListItem[] = [
  { id: 'x1', plate: 'MNO-2345', type: 'Van',     driver: 'Lisa Anderson', time: '08:00 AM', gate: 'Gate 1', location: 'Zone B',          isVisitor: false, flags: ['DELAYED'] },
  { id: 'x2', plate: 'PQR-8765', type: 'Sedan',   driver: 'Tom Harris',    time: '09:00 AM', gate: 'Gate 2', location: 'Visitor Parking', isVisitor: true,  flags: [] },
  { id: 'x3', plate: 'STU-4321', type: 'Truck',   driver: 'James Carter',  time: '09:45 AM', gate: 'Gate 1', location: 'Dock 2',          isVisitor: false, flags: ['DEVIATION', 'DELAYED'] },
  { id: 'x4', plate: 'VWX-9876', type: 'Trailer', driver: 'Nina Patel',    time: '10:15 AM', gate: 'Gate 3', location: 'Dock 5',          isVisitor: false, flags: [] },
  { id: 'x5', plate: 'YZA-5432', type: 'SUV',     driver: 'Omar Reyes',    time: '11:30 AM', gate: 'Gate 2', location: 'Visitor Parking', isVisitor: true,  flags: [] },
];

const MOCK_YARD_ALL: VehicleListItem[] = MOCK_YARD_VEHICLES.map(v => ({
  id: v.id, plate: v.plate, type: v.type, driver: v.driver,
  time: '10:00 AM', gate: 'Gate 1', location: v.location,
  isVisitor: v.isVisitor, flags: [] as Array<'DELAYED' | 'DEVIATION'>,
}));

const MOCK_ALERTS: VehicleAlert[] = [
  { id: 'a1', plate: 'ABC-1234', type: 'Truck', driver: 'John Smith',    time: '08:30 AM', location: 'Dock 12',         alertType: 'Overstay',       isVisitor: false },
  { id: 'a2', plate: 'VIS-5678', type: 'Sedan', driver: 'Sarah Johnson', time: '09:15 AM', location: 'Visitor Parking', alertType: 'Zone Violation', isVisitor: true  },
  { id: 'a3', plate: 'DEF-9012', type: 'Truck', driver: 'Mike Wilson',   time: '10:00 AM', location: 'Zone C',          alertType: 'Deviation',      isVisitor: false },
];

// ============================================================
// SECTION 4: DATA FETCHING HOOKS
// Three focused hooks — do not edit these for the API hookup.
// ============================================================

// Main hook — loads KPIs, traffic, gate feed, stations in parallel
function useDashboardData() {
  const [kpis,         setKpis]         = useState<VehicleKPIs | null>(null);
  const [trafficData,  setTrafficData]  = useState<TrafficPoint[]>([]);
  const [gateFeed,     setGateFeed]     = useState<GateFeedEntry[]>([]);
  const [stations,     setStations]     = useState<Station[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [lastUpdated,  setLastUpdated]  = useState<Date>(new Date());

  const load = useCallback(async (showSpinner = true) => {
    try {
      showSpinner ? setIsLoading(true) : setIsRefreshing(true);
      setError(null);
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 700));
        setKpis(MOCK_KPIS);
        setTrafficData(MOCK_TRAFFIC);
        setGateFeed(MOCK_GATE_FEED);
        setStations(MOCK_STATIONS);
      } else {
        // 🔌 All 4 run in parallel for performance
        const [k, t, g, s] = await Promise.all([
          apiFetchKPIs(), apiFetchTrafficTrends(),
          apiFetchGateFeed(), apiFetchStations(),
        ]);
        setKpis(k); setTrafficData(t); setGateFeed(g); setStations(s);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally { setIsLoading(false); setIsRefreshing(false); }
  }, []);

  useEffect(() => { load(true); }, [load]);

  // Auto-refresh KPIs + gate feed every 30 seconds
  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    const i = setInterval(() => loadRef.current(false), 60_000);
    return () => clearInterval(i);
  }, []);

  return {
    kpis, trafficData, gateFeed, stations,
    isLoading, isRefreshing, error, lastUpdated,
    refresh: () => load(false),
    retry:   () => load(true),
  };
}

// Yard table hook — re-fetches when tab or debounced search changes
function useYardVehicles(activeTab: 'all' | 'loading' | 'unloading', search: string) {
  const [vehicles,  setVehicles]  = useState<YardVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true); setError(null);
      let result: YardVehicle[];
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 300));
        result = activeTab === 'all'
          ? MOCK_YARD_VEHICLES
          : MOCK_YARD_VEHICLES.filter(v => v.status === activeTab);
      } else {
        result = await apiFetchYardVehicles(activeTab);
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(v =>
          v.plate.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q),
        );
      }
      setVehicles(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    } finally { setIsLoading(false); }
  }, [activeTab, search]);

  useEffect(() => { load(); }, [load]);
  return { vehicles, isLoading, error };
}

// Modal data hook — lazy fetch, only runs when a list-modal opens
type ModalType = 'entries' | 'exits' | 'yard' | 'alerts' | null;

function useModalData(type: ModalType) {
  const [entries,   setEntries]   = useState<VehicleListItem[]>([]);
  const [exits,     setExits]     = useState<VehicleListItem[]>([]);
  const [yardAll,   setYardAll]   = useState<VehicleListItem[]>([]);
  const [alerts,    setAlerts]    = useState<VehicleAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!type) return;
    setIsLoading(true);
    const run = async () => {
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 300));
        if (type === 'entries') setEntries(MOCK_ENTRIES);
        if (type === 'exits')   setExits(MOCK_EXITS);
        if (type === 'yard')    setYardAll(MOCK_YARD_ALL);
        if (type === 'alerts')  setAlerts(MOCK_ALERTS);
      } else {
        if (type === 'entries') setEntries(await apiFetchEntries());
        if (type === 'exits')   setExits(await apiFetchExits());
        if (type === 'yard')    setYardAll(await apiFetchYardAll());
        if (type === 'alerts')  setAlerts(await apiFetchAlerts());
      }
      setIsLoading(false);
    };
    run().catch(console.error);
  }, [type]);

  return { entries, exits, yardAll, alerts, isLoading };
}

// ============================================================
// SECTION 5: STYLE HELPERS
// ============================================================

const getStatusColor = (status: string) => {
  switch (status) {
    case 'loading':   return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'unloading': return 'bg-green-100 text-green-700 border-green-200';
    case 'in-yard':   return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'waiting':   return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:          return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getDockStatusColor = (status: string) => {
  switch (status) {
    case 'active':      return 'bg-green-100 text-green-700 border-green-200';
    case 'maintenance': return 'bg-red-100 text-red-700 border-red-200';
    default:            return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const FLAG_STYLES: Record<string, string> = {
  DELAYED:   'bg-red-100 text-red-800',
  DEVIATION: 'bg-orange-100 text-orange-800',
};

// ============================================================
// SECTION 6: UI HELPER COMPONENTS
// ============================================================

function SkeletonKPI() {
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

function SkeletonTableRows() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
          <div className="h-6 bg-gray-100 rounded-full w-20" />
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-28" />
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function SkeletonStations() {
  return (
    <div className="grid grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border-2 border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-14" />
            </div>
          </div>
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function ModalListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Truck className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function ErrorInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertOctagon className="w-10 h-10 text-red-500 mb-3" />
      <p className="text-sm font-medium text-gray-800 mb-1">Failed to load</p>
      <p className="text-xs text-gray-500 mb-4 text-center max-w-xs">{message}</p>
      <button onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Retry
      </button>
    </div>
  );
}

// ============================================================
// SECTION 7: SMALL REUSABLE SUB-COMPONENTS
// ============================================================

function VehicleListRow({ item }: { item: VehicleListItem }) {
  const isTruck = ['Truck', 'Van', 'Trailer'].includes(item.type);
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.isVisitor ? 'bg-gray-100' : 'bg-blue-100'}`}>
          {item.isVisitor
            ? <User  className="w-6 h-6 text-gray-600" />
            : <Truck className="w-6 h-6 text-blue-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{item.plate}</h3>
            {item.flags.map(flag => (
              <span key={flag}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${FLAG_STYLES[flag]}`}>
                {flag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{item.type} • {item.driver}</p>
        </div>
      </div>
      <div className="text-right mr-4">
        <div className="font-semibold text-gray-900">{item.time}</div>
        <div className="text-xs text-gray-600">{item.gate}</div>
      </div>
      {/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
    </div>
  );
}

function AlertListRow({ item }: { item: VehicleAlert }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.isVisitor ? 'bg-gray-100' : 'bg-red-100'}`}>
          {item.isVisitor
            ? <User        className="w-6 h-6 text-gray-600" />
            : <AlertCircle className="w-6 h-6 text-red-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{item.plate}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              {item.alertType}
            </span>
          </div>
          <p className="text-sm text-gray-600">{item.type} • {item.driver}</p>
        </div>
      </div>
      <div className="text-right mr-4">
        <div className="font-semibold text-gray-900">{item.time}</div>
        <div className="text-xs text-gray-600">{item.location}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}

// Generic modal shell — identical visual wrapper used for every modal
function Modal({
  children, onClose, icon, iconBg, title, maxW = 'max-w-2xl', headerBg = 'bg-white',
}: {
  children: React.ReactNode;
  onClose: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  maxW?: string;
  headerBg?: string;
}) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${maxW} w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-0`}
        onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 8: MAIN PAGE COMPONENT
// Pure display — no API logic here.
// ============================================================

export function VehicleLogisticsDashboard() {
  const navigate = useNavigate();
  // ── Yard table controls ──
  const [activeTab,       setActiveTab]       = useState<'all' | 'loading' | 'unloading'>('all');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (v: string) => {
    setSearchQuery(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(v), 350);
  };

  // ── Modal open state — one string controls everything ──
  const [openModal, setOpenModal] =
    useState<'register' | 'entries' | 'exits' | 'yard' | 'alerts' | 'dock' | 'gate' | 'vehicle' | null>(null);

  // ── Items selected for detail modals ──
  const [selectedStation,   setSelectedStation]   = useState<Station | null>(null);
  const [selectedGateEntry, setSelectedGateEntry] = useState<GateFeedEntry | null>(null);
  const [selectedVehicle,   setSelectedVehicle]   = useState<YardVehicle | null>(null);

  // ── Register form ──
  const [registerType,   setRegisterType]   = useState<'employee' | 'visitor'>('employee');
  const [regPlate,       setRegPlate]       = useState('');
  const [regVehicleType, setRegVehicleType] = useState('');
  const [regDriver,      setRegDriver]      = useState('');
  const [regDestination, setRegDestination] = useState('');
  const [regStatus,      setRegStatus]      = useState('In Yard');
  const [regSubmitting,  setRegSubmitting]  = useState(false);
  const [regError,       setRegError]       = useState<string | null>(null);

  // ── Data hooks ──
  const dashboard = useDashboardData();
  const yard      = useYardVehicles(activeTab, debouncedSearch);

  const modalType: ModalType =
    openModal === 'entries' ? 'entries' :
    openModal === 'exits'   ? 'exits'   :
    openModal === 'yard'    ? 'yard'    :
    openModal === 'alerts'  ? 'alerts'  : null;
  const modalData = useModalData(modalType);

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - dashboard.lastUpdated.getTime()) / 1000);
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const closeModal = () => setOpenModal(null);

  const handleRegisterSubmit = async () => {
    if (!regPlate || !regVehicleType || !regDriver || !regDestination) {
      setRegError('Please fill in all required fields.'); return;
    }
    setRegSubmitting(true); setRegError(null);
    try {
      if (!USE_MOCK_DATA) {
        await apiRegisterVehicle({
          vehicleType: registerType, plate: regPlate, type: regVehicleType,
          driver: regDriver, destination: regDestination, initialStatus: regStatus,
        });
      } else {
        await new Promise(r => setTimeout(r, 600));
      }
      closeModal();
      setRegPlate(''); setRegVehicleType(''); setRegDriver('');
      setRegDestination(''); setRegStatus('In Yard');
      dashboard.refresh();
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Registration failed. Try again.');
    } finally { setRegSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <PageHeader title={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-150"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
          <span>Vehicle & Logistics Dashboard</span>
        </div>
      }>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">Real-time monitoring and tracking system</p>
          <button onClick={dashboard.refresh} disabled={dashboard.isRefreshing}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 text-gray-600 ${dashboard.isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Updated: {formatLastUpdated()}
          </span>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-auto p-4 sm:p-6">

        {/* ── Search Bar ── */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 max-w-2xl">
            
            {/* Search Icon OUTSIDE */}
            <Search
              className={`w-5 h-5 ${
                yard.isLoading && debouncedSearch
                  ? 'text-blue-400 animate-pulse'
                  : 'text-gray-400'
              }`}
            />

            {/* Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search vehicles, stations, or alerts..."
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>


        {/* ── KPI Cards ── */}
        {dashboard.isLoading && !dashboard.kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {[...Array(4)].map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        ) : dashboard.error && !dashboard.kpis ? (
          <ErrorInline message={dashboard.error} onRetry={dashboard.retry} />
        ) : dashboard.kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div onClick={() => setOpenModal('entries')} className="cursor-pointer">
              <KPICard title="Total Entries Today" value={dashboard.kpis.totalEntriesToday}
                subtitle="Incoming vehicles" icon={<TrendingUp className="w-5 h-5" />}
                trend="up" trendValue={dashboard.kpis.entriesTrend} variant="primary" />
            </div>
            <div onClick={() => setOpenModal('exits')} className="cursor-pointer">
              <KPICard title="Total Exits Today" value={dashboard.kpis.totalExitsToday}
                subtitle="Outgoing vehicles" icon={<TrendingUp className="w-5 h-5" />}
                trend="up" trendValue={dashboard.kpis.exitsTrend} variant="success" />
            </div>
            <div onClick={() => setOpenModal('yard')} className="cursor-pointer">
              <KPICard title="Current Yard Count" value={dashboard.kpis.currentYardCount}
                subtitle="Active in yard" icon={<Truck className="w-5 h-5" />} variant="default" />
            </div>
            <div onClick={() => setOpenModal('alerts')} className="cursor-pointer">
              <KPICard title="Active Alerts" value={dashboard.kpis.activeAlerts}
                subtitle="Requires attention" icon={<AlertCircle className="w-5 h-5" />} variant="warning" />
            </div>
          </div>
        ) : null}

        {/* ── Live Yard ── */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Live Yard</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {yard.isLoading
                    ? 'Loading…'
                    : `${yard.vehicles.length} vehicle${yard.vehicles.length !== 1 ? 's' : ''} currently tracked`}
                </p>
              </div>
              <button onClick={() => setOpenModal('register')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />Register New Vehicle
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4">
              {(['all', 'loading', 'unloading'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}>
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {yard.isLoading ? (
            <SkeletonTableRows />
          ) : yard.error ? (
            <ErrorInline message={yard.error} onRetry={() => {}} />
          ) : yard.vehicles.length === 0 ? (
            <EmptyState message={debouncedSearch ? `No vehicles matching "${debouncedSearch}"` : 'No vehicles in this category'} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Status','License Plate','Type','Driver','Location','Duration','Action'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yard.vehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{vehicle.plate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          {['Truck','Van','Trailer'].includes(vehicle.type)
                            ? <Truck className="w-4 h-4 text-gray-500" />
                            : <Car   className="w-4 h-4 text-gray-500" />}
                          {vehicle.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{vehicle.driver}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />{vehicle.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => { setSelectedVehicle(vehicle); setOpenModal('vehicle'); }}
                          className="text-blue-600 hover:text-blue-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Traffic Trends + Gate Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Traffic Trends</h3>
              <p className="text-sm text-gray-500 mt-1">Entry and exit patterns throughout the day</p>
            </div>
            {dashboard.isLoading && dashboard.trafficData.length === 0 ? (
              <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
                <LineChart data={dashboard.trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="entries" stroke="#3b82f6" strokeWidth={2} name="Entries" />
                  <Line type="monotone" dataKey="exits"   stroke="#10b981" strokeWidth={2} name="Exits"   />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gate Feed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Gate Feed</h3>
              <div className="flex items-center gap-2">
                <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
            </div>
            {dashboard.isLoading && dashboard.gateFeed.length === 0 ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}
              </div>
            ) : dashboard.gateFeed.length === 0 ? (
              <EmptyState message="No recent gate activity" />
            ) : (
              <div className="space-y-1">
                {dashboard.gateFeed.map(entry => (
                  <div key={entry.id}
                    onClick={() => { setSelectedGateEntry(entry); setOpenModal('gate'); }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{entry.plate}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${entry.direction === 'entry' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {entry.direction === 'entry' ? '▲ IN' : '▼ OUT'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{entry.gate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{entry.time}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Station Monitor ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Station Monitor</h3>
          {dashboard.isLoading && dashboard.stations.length === 0 ? (
            <SkeletonStations />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dashboard.stations.map(station => (
                <div key={station.id}
                  onClick={() => { setSelectedStation(station); setOpenModal('dock'); }}
                  className={`relative rounded-xl p-5 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:scale-105 ${
                    station.status === 'active'
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                      : station.status === 'maintenance'
                      ? 'border-red-200 bg-gradient-to-br from-red-50 to-white'
                      : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                  }`}>

                  {/* Status pulse dot */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${
                      station.status === 'active'      ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' :
                      station.status === 'maintenance' ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' :
                                                         'bg-gray-400'
                    }`} />
                  </div>

                  {/* Dock header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      station.status === 'active'      ? 'bg-green-100' :
                      station.status === 'maintenance' ? 'bg-red-100'   : 'bg-gray-100'
                    }`}>
                      <Truck className={`w-6 h-6 ${
                        station.status === 'active'      ? 'text-green-600' :
                        station.status === 'maintenance' ? 'text-red-600'   : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{station.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        station.status === 'active'      ? 'bg-green-100 text-green-700' :
                        station.status === 'maintenance' ? 'bg-red-100 text-red-700'     : 'bg-gray-100 text-gray-700'
                      }`}>
                        {station.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {station.vehicle ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">VEHICLE</span>
                          <Car className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="font-bold text-gray-900 text-lg">{station.vehicle}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-gray-600">Loading Progress</span>
                          <span className="font-bold text-gray-900">{station.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                          <div className={`h-full rounded-full transition-all duration-500 ${
                            station.progress >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            station.progress >= 40 ? 'bg-gradient-to-r from-blue-500 to-blue-600'  :
                                                     'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          }`} style={{ width: `${station.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Est. Time: {station.estimatedTime}</span>
                          <Clock className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${station.status === 'maintenance' ? 'bg-red-100' : 'bg-gray-100'}`}>
                        {station.status === 'maintenance'
                          ? <AlertCircle className="w-8 h-8 text-red-500" />
                          : <Truck       className="w-8 h-8 text-gray-400" />}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {station.status === 'maintenance' ? 'Under Maintenance' : 'Available'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {station.status === 'maintenance' ? 'Scheduled maintenance in progress' : 'Ready for assignment'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════ */}

      {/* ── Register New Vehicle ── */}
      {openModal === 'register' && (
        <Modal onClose={closeModal} icon={<Plus className="w-5 h-5 text-white" />}
          iconBg="bg-blue-600" title="Register New Vehicle">
          <div className="p-6 space-y-6">
            {/* Type selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['employee', 'visitor'] as const).map(type => (
                <button key={type} onClick={() => setRegisterType(type)}
                  className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                    registerType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${registerType === type ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {type === 'employee'
                      ? <Truck className={`w-5 h-5 ${registerType === type ? 'text-blue-600' : 'text-gray-500'}`} />
                      : <User  className={`w-5 h-5 ${registerType === type ? 'text-blue-600' : 'text-gray-500'}`} />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-sm capitalize">{type}</h3>
                    <p className="text-xs text-gray-600">{type === 'employee' ? 'Company vehicle' : 'External visitor'}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">License Plate <span className="text-red-500">*</span></label>
                  <input value={regPlate} onChange={e => setRegPlate(e.target.value)}
                    type="text" placeholder="ABC-1234"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Vehicle Type <span className="text-red-500">*</span></label>
                  <select value={regVehicleType} onChange={e => setRegVehicleType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select type</option>
                    {['Truck','Van','Sedan','SUV','Trailer'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Driver Information</h3>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Driver Name <span className="text-red-500">*</span></label>
                <input value={regDriver} onChange={e => setRegDriver(e.target.value)}
                  type="text" placeholder="John Smith"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            {/* Entry Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Entry Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Destination <span className="text-red-500">*</span></label>
                  <select value={regDestination} onChange={e => setRegDestination(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select location</option>
                    {['Dock 1','Dock 2','Dock 3','Visitor Parking','Zone B','Zone C'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Initial Status <span className="text-red-500">*</span></label>
                  <select value={regStatus} onChange={e => setRegStatus(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {['In Yard','Loading','Unloading','Waiting'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {regError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{regError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button onClick={closeModal}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
              Cancel
            </button>
            <button onClick={handleRegisterSubmit} disabled={regSubmitting}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-60">
              {regSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {regSubmitting ? 'Registering…' : 'Register Vehicle'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Today's Entries ── */}
      {openModal === 'entries' && (
        <Modal onClose={closeModal} icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600" title={`Today's Entries (${dashboard.kpis?.totalEntriesToday ?? '…'})`}>
          <div className="p-6">
            {modalData.isLoading ? <ModalListSkeleton /> :
             modalData.entries.length === 0 ? <EmptyState message="No entries today" /> : (
              <div className="space-y-3">
                {modalData.entries.map(e => <VehicleListRow key={e.id} item={e} />)}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Today's Exits ── */}
      {openModal === 'exits' && (
        <Modal onClose={closeModal} icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600" title={`Today's Exits (${dashboard.kpis?.totalExitsToday ?? '…'})`}>
          <div className="p-6">
            {modalData.isLoading ? <ModalListSkeleton /> :
             modalData.exits.length === 0 ? <EmptyState message="No exits today" /> : (
              <div className="space-y-3">
                {modalData.exits.map(e => <VehicleListRow key={e.id} item={e} />)}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Current Yard Count ── */}
      {openModal === 'yard' && (
        <Modal onClose={closeModal} icon={<Truck className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600" title={`Current Yard Count (${dashboard.kpis?.currentYardCount ?? '…'})`}>
          <div className="p-6">
            {modalData.isLoading ? <ModalListSkeleton /> :
             modalData.yardAll.length === 0 ? <EmptyState message="No vehicles in yard" /> : (
              <div className="space-y-3">
                {modalData.yardAll.map(v => <VehicleListRow key={v.id} item={v} />)}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Active Alerts ── */}
      {openModal === 'alerts' && (
        <Modal onClose={closeModal} icon={<AlertCircle className="w-6 h-6 text-white" />}
          iconBg="bg-blue-600" title={`Active Alerts (${dashboard.kpis?.activeAlerts ?? '…'})`}>
          <div className="p-6">
            {modalData.isLoading ? <ModalListSkeleton /> :
             modalData.alerts.length === 0 ? <EmptyState message="No active alerts" /> : (
              <div className="space-y-3">
                {modalData.alerts.map(a => <AlertListRow key={a.id} item={a} />)}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Dock / Station Details ── */}
      {openModal === 'dock' && selectedStation && (
        <Modal onClose={closeModal} icon={<Truck className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100" title={`${selectedStation.name} Details`} maxW="max-w-2xl">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getDockStatusColor(selectedStation.status)}`}>
                {selectedStation.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">Capacity: 85%</span>
            </div>

            {selectedStation.vehicle ? (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Current Operation</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      ['Vehicle',          selectedStation.vehicle],
                      ['Driver',           selectedStation.driver           ?? '—'],
                      ['Start Time',       selectedStation.startTime        ?? '—'],
                      ['Est. Completion',  selectedStation.estimatedCompletion ?? '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">{label}</p>
                        <p className="text-sm font-bold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-bold text-gray-900">{selectedStation.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all ${
                      selectedStation.progress >= 70 ? 'bg-green-600' :
                      selectedStation.progress >= 40 ? 'bg-blue-600'  : 'bg-yellow-600'
                    }`} style={{ width: `${selectedStation.progress}%` }} />
                  </div>
                </div>

                {selectedStation.cargo && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Cargo Information</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-700">{selectedStation.cargo}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Maintenance Schedule</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Last Maintenance</p>
                      <p className="text-sm font-bold text-gray-900">{selectedStation.lastMaintenance}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Next Maintenance</p>
                      <p className="text-sm font-bold text-gray-900">{selectedStation.nextMaintenance}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-300 mb-3">
                  <Truck className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">
                  {selectedStation.status === 'maintenance'
                    ? 'This dock is under maintenance'
                    : 'No vehicle currently assigned'}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Gate Feed Detail ── */}
      {openModal === 'gate' && selectedGateEntry && (
        <Modal onClose={closeModal} icon={<Truck className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100" title="Gate Feed Details">
          <div className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Gate Entry Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['License Plate', selectedGateEntry.plate],
                ['Gate',          selectedGateEntry.gate],
                ['Time',          selectedGateEntry.time],
                ['Direction',     selectedGateEntry.direction === 'entry' ? '▲ Entry' : '▼ Exit'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-gray-600 mb-1">{label}</p>
                  <p className="font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Vehicle Details ── */}
      {openModal === 'vehicle' && selectedVehicle && (
        <Modal onClose={closeModal}
          icon={['Truck','Van','Trailer'].includes(selectedVehicle.type)
            ? <Truck className="w-7 h-7 text-white" />
            : <Car   className="w-7 h-7 text-white" />}
          iconBg="bg-blue-600 shadow-lg"
          title={selectedVehicle.plate}
          maxW="max-w-3xl"
          headerBg="bg-gradient-to-r from-blue-50 to-white">
          <div className="p-6">
            {/* Status / Location / Duration cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedVehicle.status === 'loading'   ? 'bg-blue-500 animate-pulse'  :
                    selectedVehicle.status === 'unloading' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`} />
                  <span className="text-xs font-medium text-gray-600">Current Status</span>
                </div>
                <p className="text-lg font-bold text-gray-900 capitalize">{selectedVehicle.status}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-600">Location</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedVehicle.location}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-gray-600">Duration</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedVehicle.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-600" />Vehicle Information
                  </h3>
                  <div className="space-y-3">
                    {[['License Plate', selectedVehicle.plate], ['Vehicle Type', selectedVehicle.type]].map(([l, v]) => (
                      <div key={l} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{l}</label>
                        <p className="text-sm font-bold text-gray-900">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />Driver Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Driver Name</label>
                    <p className="text-sm font-bold text-gray-900">{selectedVehicle.driver}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Entry Details</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Destination</label>
                      <p className="text-sm font-bold text-gray-900">{selectedVehicle.location}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Current Status</label>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedVehicle.status)}`}>
                        {selectedVehicle.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-600" />Activity Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-gray-600">Entry recorded</span>
                        <span className="ml-auto font-medium text-gray-900">10:30 AM</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-600">Status: {selectedVehicle.status}</span>
                        <span className="ml-auto font-medium text-gray-900">{selectedVehicle.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">Update Status</button>
              <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">View History</button>
              <button className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">Check Out</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}