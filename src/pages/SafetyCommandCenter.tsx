// import { Link } from 'react-router';
// import { useNavigate } from 'react-router-dom';
// import {
//   Eye, X, AlertCircle, RefreshCw, Shield, AlertTriangle,
//   CheckCircle2, Activity, TrendingUp, Settings, Filter,
//   Check, X as XIcon, Clock, MapPin, Zap, ChevronDown,
//   AlertOctagon, ArrowLeft, Factory
// } from 'lucide-react';
// import { KPICard, StatusBadge, PageHeader, PPEIndicator } from '../components/SharedComponents';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
// import { getJSON } from '../api';

// // ============================================================
// // SECTION 1: TYPE DEFINITIONS
// // ============================================================

// export interface KPIData {
//   totalEvents: number;
//   openIncidents: number;
//   closedIncidents: number;
//   ppeComplianceRate: number;
//   totalViolations: number;
//   avgConfidence: number;
// }

// export interface SeverityBreakdown { low: number; medium: number; high: number; }
// export interface ViolationType     { name: string; value: number; }
// export interface ShiftData         { shift: string; incidents: number; }
// export interface DepartmentViolation { department: string; violations: number; }
// export interface CameraStatus      { online: number; offline: number; active: number; }

// export interface DashboardData {
//   kpis: KPIData;
//   severityBreakdown: SeverityBreakdown;
//   violationTypes: ViolationType[];
//   shiftData: ShiftData[];
//   departmentViolations: DepartmentViolation[];
//   cameraStatus: CameraStatus;
//   riskLevel: 'Low' | 'Medium' | 'High';
//   totalEmployeesMonitored: number;  // used for compliance rate recalculation
// }

// export interface PPEEvent {
//   id: string;
//   plantName: string;
//   sectionName: string;
//   featureDetected: string;          // must match a PPEFeature name exactly
//   confidenceScore: number;
//   severity: 'Low' | 'Medium' | 'High';
//   eventCategory: string;
//   eventTime: string;
//   shift: 'Morning (6AM-2PM)' | 'Afternoon (2PM-10PM)' | 'Night (10PM-6AM)';
//   department: string;              
//   imageUrl: string;
// }

// export interface Incident {
//   id: string;
//   plant: string;
//   unit: string;
//   station: string;
//   camera: string;
//   violationType: string;
//   missingPPE: string[];             // each item must match a PPEFeature name exactly
//   severity: 'Low' | 'Medium' | 'High';
//   aiConfidence: number;
//   status: 'Open' | 'Closed';
//   timestamp: string;
// }

// export interface PPEFeature { name: string; enabled: boolean; }

// // ============================================================
// // SECTION 2: API SERVICE LAYER
// // ============================================================
// // Uses getJSON() from src/api.ts — which already handles:
// //   ✅ BASE_URL resolution (dev proxy / vite preview / production)
// //   ✅ credentials: "include" for cookies/sessions
// //   ✅ 30s request timeout with AbortController
// //   ✅ JSON + plain-text response parsing
// //   ✅ Throws on non-2xx with the server's error message
// //
// // 🔌 STEP 1: Change the path strings below to match your real API routes.
// // 🔌 STEP 2: Set USE_MOCK_DATA = false (in Section 3) when your API is ready.
// // That's it — no other changes needed.
// // ============================================================

// // Fetch dashboard summary (KPIs, charts, camera status, risk level)
// async function apiFetchDashboard(): Promise<DashboardData> {
//   return getJSON<DashboardData>('/api/safety/dashboard');
// }

// // Fetch ALL PPE events (unfiltered) — PPE toggle filtering is done client-side
// // so every toggle is instant without a network round-trip.
// async function apiFetchAllPPEEvents(): Promise<PPEEvent[]> {
//   return getJSON<PPEEvent[]>('/api/safety/ppe-events');
// }

// // Fetch ALL incidents (unfiltered)
// async function apiFetchAllIncidents(): Promise<Incident[]> {
//   return getJSON<Incident[]>('/api/safety/incidents');
// }

// // Fetch PPE feature configuration (which features exist and their default enabled state)
// // If your features are hardcoded in the frontend, you can skip this call and
// // keep USE_MOCK_DATA = true just for features, or just remove this call entirely.
// async function apiFetchPPEFeatures(): Promise<PPEFeature[]> {
//   return getJSON<PPEFeature[]>('/api/safety/ppe-features');
// }

// // ============================================================
// // SECTION 3: MOCK DATA
// // ============================================================

// const USE_MOCK_DATA = true;

// const MOCK_FEATURES: PPEFeature[] = [
//   { name: 'Helmet',        enabled: true  },
//   { name: 'Safety Vest',   enabled: true  },
//   { name: 'Safety Gloves', enabled: false },
//   { name: 'Safety Shoes',  enabled: true  },
// ];

// const MOCK_INCIDENTS: Incident[] = [
//   { id: 'INC-001', plant: 'Plant A', unit: 'Unit 1', station: 'Station 3', camera: 'CAM-07',
//     violationType: 'Missing Helmet',       missingPPE: ['Helmet'],                severity: 'High',   aiConfidence: 94, status: 'Open',   timestamp: '2024-01-15 08:23:00' },
//   { id: 'INC-002', plant: 'Plant B', unit: 'Unit 2', station: 'Station 1', camera: 'CAM-02',
//     violationType: 'Missing Vest',         missingPPE: ['Safety Vest'],           severity: 'Medium', aiConfidence: 88, status: 'Open',   timestamp: '2024-01-15 09:10:00' },
//   { id: 'INC-003', plant: 'Plant A', unit: 'Unit 3', station: 'Station 2', camera: 'CAM-04',
//     violationType: 'Missing Gloves',       missingPPE: ['Safety Gloves'],         severity: 'Low',    aiConfidence: 91, status: 'Closed', timestamp: '2024-01-15 10:05:00' },
//   { id: 'INC-004', plant: 'Plant C', unit: 'Unit 1', station: 'Station 4', camera: 'CAM-09',
//     violationType: 'Missing Helmet+Vest',  missingPPE: ['Helmet', 'Safety Vest'], severity: 'High',   aiConfidence: 97, status: 'Open',   timestamp: '2024-01-15 11:30:00' },
//   { id: 'INC-005', plant: 'Plant B', unit: 'Unit 4', station: 'Station 2', camera: 'CAM-05',
//     violationType: 'Missing Shoes',        missingPPE: ['Safety Shoes'],          severity: 'Medium', aiConfidence: 85, status: 'Closed', timestamp: '2024-01-15 12:00:00' },
//   { id: 'INC-006', plant: 'Plant A', unit: 'Unit 2', station: 'Station 1', camera: 'CAM-03',
//     violationType: 'Missing Gloves',       missingPPE: ['Safety Gloves'],         severity: 'Low',    aiConfidence: 89, status: 'Open',   timestamp: '2024-01-15 13:15:00' },
//   { id: 'INC-007', plant: 'Plant C', unit: 'Unit 3', station: 'Station 3', camera: 'CAM-11',
//     violationType: 'Missing Helmet',       missingPPE: ['Helmet'],                severity: 'High',   aiConfidence: 96, status: 'Open',   timestamp: '2024-01-15 14:05:00' },
//   { id: 'INC-008', plant: 'Plant B', unit: 'Unit 1', station: 'Station 2', camera: 'CAM-06',
//     violationType: 'Missing Shoes',        missingPPE: ['Safety Shoes'],          severity: 'Low',    aiConfidence: 82, status: 'Closed', timestamp: '2024-01-15 15:20:00' },
// ];

// const MOCK_ALL_PPE_EVENTS: PPEEvent[] = [
//   { id: 'EVT-001', plantName: 'Plant Alpha', sectionName: 'Assembly Line 1',
//     featureDetected: 'Helmet',        confidenceScore: 94, severity: 'High',   eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 08:23:11', shift: 'Morning (6AM-2PM)',     department: 'Assembly',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-002', plantName: 'Plant Beta',  sectionName: 'Welding Zone',
//     featureDetected: 'Safety Vest',   confidenceScore: 88, severity: 'Medium', eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 09:15:44', shift: 'Morning (6AM-2PM)',     department: 'Welding',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-003', plantName: 'Plant Alpha', sectionName: 'Storage Area',
//     featureDetected: 'Safety Shoes',  confidenceScore: 91, severity: 'Low',    eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 10:02:33', shift: 'Morning (6AM-2PM)',     department: 'Storage',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-004', plantName: 'Plant Gamma', sectionName: 'Chemical Zone',
//     featureDetected: 'Helmet',        confidenceScore: 97, severity: 'High',   eventCategory: 'Critical Violation',
//     eventTime: '2024-01-15 11:30:21', shift: 'Morning (6AM-2PM)',     department: 'Chemical',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-005', plantName: 'Plant Beta',  sectionName: 'Packaging Floor',
//     featureDetected: 'Safety Gloves', confidenceScore: 79, severity: 'Low',    eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 14:05:10', shift: 'Afternoon (2PM-10PM)', department: 'Packaging',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-006', plantName: 'Plant Alpha', sectionName: 'Assembly Line 2',
//     featureDetected: 'Helmet',        confidenceScore: 93, severity: 'High',   eventCategory: 'Critical Violation',
//     eventTime: '2024-01-15 15:22:44', shift: 'Afternoon (2PM-10PM)', department: 'Assembly',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-007', plantName: 'Plant Gamma', sectionName: 'Welding Zone',
//     featureDetected: 'Safety Vest',   confidenceScore: 86, severity: 'Medium', eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 16:44:00', shift: 'Afternoon (2PM-10PM)', department: 'Welding',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-008', plantName: 'Plant Beta',  sectionName: 'Chemical Zone',
//     featureDetected: 'Safety Shoes',  confidenceScore: 88, severity: 'Medium', eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 22:10:05', shift: 'Night (10PM-6AM)',     department: 'Chemical',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
//   { id: 'EVT-009', plantName: 'Plant Alpha', sectionName: 'Storage Area',
//     featureDetected: 'Safety Gloves', confidenceScore: 82, severity: 'Low',    eventCategory: 'PPE Violation',
//     eventTime: '2024-01-15 23:30:19', shift: 'Night (10PM-6AM)',     department: 'Storage',
//     imageUrl: 'https://placehold.co/300x200/1e293b/white?text=PPE+Event' },
// ];

// const MOCK_DASHBOARD: DashboardData = {
//   kpis: { totalEvents: 42, openIncidents: 8, closedIncidents: 34, ppeComplianceRate: 96, totalViolations: 12, avgConfidence: 91.4 },
//   severityBreakdown: { low: 15, medium: 18, high: 9 },
//   violationTypes: [
//     { name: 'Missing Helmet', value: 14 }, { name: 'Missing Vest',   value: 10 },
//     { name: 'Missing Gloves', value: 7  }, { name: 'Missing Shoes',  value: 5  },
//   ],
//   shiftData: [
//     { shift: 'Morning (6AM-2PM)',    incidents: 18 },
//     { shift: 'Afternoon (2PM-10PM)', incidents: 14 },
//     { shift: 'Night (10PM-6AM)',     incidents: 10 },
//   ],
//   departmentViolations: [
//     { department: 'Assembly',  violations: 12 }, { department: 'Welding',   violations: 9 },
//     { department: 'Packaging', violations: 7  }, { department: 'Chemical',  violations: 6 },
//     { department: 'Storage',   violations: 4  },
//   ],
//   cameraStatus: { online: 7, offline: 1, active: 7 },
//   riskLevel: 'Medium',
//   totalEmployeesMonitored: 160,
// };

// // ============================================================
// // SECTION 4: DATA FETCHING HOOK
// // ============================================================

// function useDashboardData() {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [allIncidents,  setAllIncidents]  = useState<Incident[]>([]);
//   const [allPPEEvents,  setAllPPEEvents]  = useState<PPEEvent[]>([]);
//   const [features,      setFeatures]      = useState<PPEFeature[]>(MOCK_FEATURES);
//   const [isLoading,    setIsLoading]    = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error,        setError]        = useState<string | null>(null);
//   const [lastUpdated,  setLastUpdated]  = useState<Date>(new Date());

//   const load = useCallback(async (showSpinner = true) => {
//     try {
//       showSpinner ? setIsLoading(true) : setIsRefreshing(true);
//       setError(null);
//       if (USE_MOCK_DATA) {
//         await new Promise(r => setTimeout(r, 800));
//         setDashboardData(MOCK_DASHBOARD);
//         setAllIncidents(MOCK_INCIDENTS);
//         setAllPPEEvents(MOCK_ALL_PPE_EVENTS);
//         setFeatures(MOCK_FEATURES);
//       } else {
//         const [dashboard, incidents, events, feats] = await Promise.all([
//           apiFetchDashboard(), apiFetchAllIncidents(),
//           apiFetchAllPPEEvents(), apiFetchPPEFeatures(),
//         ]);
//         setDashboardData(dashboard); setAllIncidents(incidents);
//         setAllPPEEvents(events);     setFeatures(feats);
//       }
//       setLastUpdated(new Date());
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
//     } finally { setIsLoading(false); setIsRefreshing(false); }
//   }, []);

//   useEffect(() => { load(true); }, [load]);

//   const loadRef = useRef(load);
//   loadRef.current = load;
//   useEffect(() => {
//     const i = setInterval(() => loadRef.current(false), 60_000);
//     return () => clearInterval(i);
//   }, []);

//   const toggleFeature = useCallback((name: string) => {
//     setFeatures(prev => prev.map(f => f.name === name ? { ...f, enabled: !f.enabled } : f));
//   }, []);

//   const enableAll  = useCallback(() => setFeatures(prev => prev.map(f => ({ ...f, enabled: true  }))), []);
//   const disableAll = useCallback(() => setFeatures(prev => prev.map(f => ({ ...f, enabled: false }))), []);

//   return {
//     dashboardData, allIncidents, allPPEEvents, features,
//     isLoading, isRefreshing, error, lastUpdated,
//     refresh: () => load(false), retry: () => load(true),
//     toggleFeature, enableAll, disableAll,
//   };
// }

// // ============================================================
// // SECTION 5: PPE-FILTERED COMPUTED DASHBOARD
// // This hook re-derives every single metric whenever PPE toggles change.
// // Toggling a feature is instant — no network call needed.
// // ============================================================

// function useFilteredDashboard(
//   dashboardData: DashboardData | null,
//   allIncidents: Incident[],
//   allPPEEvents: PPEEvent[],
//   features: PPEFeature[],
// ) {
//   return useMemo(() => {
//     if (!dashboardData) return null;

//     const enabledNames  = new Set(features.filter(f => f.enabled).map(f => f.name));
//     const noneEnabled   = enabledNames.size === 0;

//     // ── Filter events: only those whose featureDetected is enabled ──
//     const filteredEvents = noneEnabled
//       ? []
//       : allPPEEvents.filter(e => enabledNames.has(e.featureDetected));

//     // ── Filter incidents: show if ANY missingPPE item is enabled ──
//     const filteredIncidents = noneEnabled
//       ? []
//       : allIncidents.filter(inc => inc.missingPPE.some(p => enabledNames.has(p)));

//     // ── KPIs ──
//     const openIncidents   = filteredIncidents.filter(i => i.status === 'Open').length;
//     const closedIncidents = filteredIncidents.filter(i => i.status === 'Closed').length;
//     const avgConfidence   = filteredEvents.length > 0
//       ? Math.round(filteredEvents.reduce((s, e) => s + e.confidenceScore, 0) / filteredEvents.length * 10) / 10
//       : 0;
//     const complianceRate  = noneEnabled
//       ? 100
//       : Math.max(0, Math.round(
//           ((dashboardData.totalEmployeesMonitored - filteredEvents.length) /
//            dashboardData.totalEmployeesMonitored) * 100,
//         ));

//     // ── Severity breakdown ──
//     const severityBreakdown: SeverityBreakdown = {
//       low:    filteredIncidents.filter(i => i.severity === 'Low').length,
//       medium: filteredIncidents.filter(i => i.severity === 'Medium').length,
//       high:   filteredIncidents.filter(i => i.severity === 'High').length,
//     };

//     // ── Violation types — only enabled PPE names ──
//     const violationTypes: ViolationType[] = Array.from(enabledNames)
//       .map(name => ({ name: `Missing ${name}`, value: filteredEvents.filter(e => e.featureDetected === name).length }))
//       .filter(v => v.value > 0)
//       .sort((a, b) => b.value - a.value);

//     // ── Shift-wise incidents — derived from filteredIncidents ──
//     const shiftMap: Record<string, number> = {};
//     filteredIncidents.forEach(inc => {
//       const hour  = parseInt(inc.timestamp.split(' ')[1]?.split(':')[0] ?? '0', 10);
//       const shift = hour >= 6 && hour < 14 ? 'Morning (6AM-2PM)'
//                   : hour >= 14 && hour < 22 ? 'Afternoon (2PM-10PM)'
//                   : 'Night (10PM-6AM)';
//       shiftMap[shift] = (shiftMap[shift] || 0) + 1;
//     });
//     const shiftData: ShiftData[] = dashboardData.shiftData.map(s => ({
//       shift: s.shift, incidents: shiftMap[s.shift] ?? 0,
//     }));

//     // ── Department violations — derived from filteredEvents ──
//     const deptMap: Record<string, number> = {};
//     filteredEvents.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
//     const departmentViolations: DepartmentViolation[] = Object.entries(deptMap)
//       .map(([department, violations]) => ({ department, violations }))
//       .sort((a, b) => b.violations - a.violations);

//     // ── Risk level — recalculated from filtered severity ──
//     const riskLevel: 'Low' | 'Medium' | 'High' =
//       filteredIncidents.length === 0   ? 'Low'
//       : severityBreakdown.high > 2     ? 'High'
//       : severityBreakdown.medium > 3   ? 'Medium'
//       : 'Low';

//     // ── Analytics charts ──
//     const featureViolations = Array.from(enabledNames).map(name => ({
//       feature: name,
//       count: filteredEvents.filter(e => e.featureDetected === name).length,
//     }));

//     const sectionMap: Record<string, number> = {};
//     filteredEvents.forEach(e => { sectionMap[e.sectionName] = (sectionMap[e.sectionName] || 0) + 1; });
//     const sectionViolations = Object.entries(sectionMap)
//       .map(([section, count]) => ({ section, count }))
//       .sort((a, b) => b.count - a.count);

//     return {
//       kpis: { totalEvents: filteredEvents.length, openIncidents, closedIncidents, ppeComplianceRate: complianceRate, totalViolations: filteredEvents.length, avgConfidence },
//       severityBreakdown, violationTypes, shiftData, departmentViolations, riskLevel,
//       cameraStatus: dashboardData.cameraStatus,
//       filteredIncidents, filteredEvents,
//       featureViolations, sectionViolations,
//       noneEnabled,
//     };
//   }, [dashboardData, allIncidents, allPPEEvents, features]);
// }

// // ============================================================
// // SECTION 6: UI HELPERS
// // ============================================================

// function SkeletonKPICard() {
//   return (
//     <div className="bg-white rounded-lg p-5 shadow-sm animate-pulse">
//       <div className="flex items-center justify-between mb-3">
//         <div className="h-4 bg-gray-200 rounded w-32" /><div className="h-8 w-8 bg-gray-200 rounded-lg" />
//       </div>
//       <div className="h-8 bg-gray-200 rounded w-20 mb-2" /><div className="h-3 bg-gray-200 rounded w-24" />
//     </div>
//   );
// }
// function SkeletonChart() {
//   return (
//     <div className="bg-white rounded-lg p-5 shadow-sm animate-pulse">
//       <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
//       <div className="h-64 bg-gray-100 rounded flex items-end justify-around gap-2 p-4">
//         {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-200 rounded-t w-full" style={{ height: `${40 + i * 10}%` }} />)}
//       </div>
//     </div>
//   );
// }
// function SkeletonTable() {
//   return (
//     <div className="bg-white rounded-lg shadow-sm animate-pulse">
//       <div className="px-5 py-4 border-b border-gray-200"><div className="h-5 bg-gray-200 rounded w-48" /></div>
//       <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>
//     </div>
//   );
// }
// function EmptyState({ message, icon: Icon = AlertCircle }: { message: string; icon?: any }) {
//   return (
//     <div className="text-center py-12">
//       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//         <Icon className="w-8 h-8 text-gray-400" />
//       </div>
//       <p className="text-sm text-gray-500">{message}</p>
//     </div>
//   );
// }
// function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
//   return (
//     <div className="text-center py-12">
//       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//         <AlertOctagon className="w-8 h-8 text-red-600" />
//       </div>
//       <p className="text-sm font-medium text-gray-900 mb-2">Failed to Load Data</p>
//       <p className="text-sm text-gray-500 mb-4">{message}</p>
//       <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">Retry</button>
//     </div>
//   );
// }
// function NoPPEBanner() {
//   return (
//     <div className="flex items-center gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
//       <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
//       <div>
//         <p className="text-sm font-semibold text-amber-900">All PPE features are disabled</p>
//         <p className="text-xs text-amber-700 mt-0.5">Enable at least one PPE feature in PPE Configuration to see violation data.</p>
//       </div>
//     </div>
//   );
// }

// // ============================================================
// // SECTION 6: PLANT CONFIGURATION
// // ============================================================

// const PLANTS = [
//   { id: 'plant-a-main', name: 'Plant A - Main', shortName: 'Plant A' },
//   { id: 'plant-a-secondary', name: 'Plant A - Secondary', shortName: 'Plant A2' },
//   { id: 'plant-b-main', name: 'Plant B - Main', shortName: 'Plant B' },
// ] as const;

// function getPlantDisplayName(plantId: string): string {
//   return PLANTS.find(p => p.id === plantId)?.name || 'Plant A - Main';
// }

// function getPlantShortName(plantId: string): string {
//   return PLANTS.find(p => p.id === plantId)?.shortName || 'Plant A';
// }

// // ============================================================
// // SECTION 7: MAIN PAGE COMPONENT
// // ============================================================

// export function SafetyCommandCenter() {
//   const navigate = useNavigate();
//   const {
//     dashboardData, allIncidents, allPPEEvents, features,
//     isLoading, isRefreshing, error, lastUpdated,
//     refresh, retry, toggleFeature, enableAll, disableAll,
//   } = useDashboardData();

//   const filtered = useFilteredDashboard(dashboardData, allIncidents, allPPEEvents, features);

//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<PPEEvent | null>(null);
//   const [ppeConfigOpen, setPpeConfigOpen] = useState(false);
//   const [plantSelectorOpen, setPlantSelectorOpen] = useState(false);
//   const [selectedPlant, setSelectedPlant] = useState('plant-a-main');

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const buttonRef   = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ppeConfigOpen &&
//           dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
//           buttonRef.current  && !buttonRef.current.contains(e.target as Node)) {
//         setPpeConfigOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [ppeConfigOpen]);

//   const formatLastUpdated = () => {
//     const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
//     if (diff < 60)   return 'just now';
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     return `${Math.floor(diff / 3600)}h ago`;
//   };

//   if (error && !dashboardData) {
//     return (
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <PageHeader title={
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="group flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-150"
//               title="Go back"
//             >
//               <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
//             </button>
//             <span>Safety Command Center</span>
//           </div>
//         }>
//           <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4" /><span>Last updated: {formatLastUpdated()}</span></div>
//         </PageHeader>
//         <div className="flex-1 overflow-auto p-4 sm:p-6"><ErrorState message={error} onRetry={retry} /></div>
//       </div>
//     );
//   }

//   return (   
//     <div className="flex-1 flex flex-col overflow-hidden">

//       {/* ── Header ── */}
//       <PageHeader>
//         <div className="flex flex-wrap items-center justify-between gap-3 w-full">

//           {/* ───────── LEFT SIDE ───────── */}
//           <div className="flex flex-wrap items-center gap-3">

//             {/* Status Badge */}
//             {filtered && (
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">Risk Level:</span>
//                 <StatusBadge status={filtered.riskLevel as any} />
//               </div>
//             )}
     
//             {/* PPE Configuration Dropdown */}
//             <div className="relative">
//               <button
//                 ref={buttonRef}
//                 onClick={() => setPpeConfigOpen(p => !p)}
//                 className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 <Settings className="w-4 h-4" />
//                 <span>PPE Configuration</span>
//                 <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
//                   {features.filter(f => f.enabled).length}/{features.length}
//                 </span>
//                 <ChevronDown className={`w-4 h-4 transition-transform ${ppeConfigOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {ppeConfigOpen && (
//               <div ref={dropdownRef} className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-[80]"  >
//                 <div className="p-4">
//                   <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">PPE Features</div>
//                   <p className="text-xs text-gray-400 mb-3">Toggling a feature instantly recalculates all charts and KPIs.</p>
//                   <div className="space-y-1">
//                     {features.map(feature => (
//                       <div
//                         key={feature.name}
//                         onClick={() => toggleFeature(feature.name)}
//                         className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors cursor-pointer ${feature.enabled ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}`}
//                       >
//                         <div className="flex items-center gap-2">
//                           <div className={`w-2 h-2 rounded-full flex-shrink-0 ${feature.enabled ? 'bg-blue-500' : 'bg-gray-300'}`} />
//                           <span className={`text-sm font-medium select-none ${feature.enabled ? 'text-gray-800' : 'text-gray-400'}`}>{feature.name}</span>
//                         </div>
//                         <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors pointer-events-none ${feature.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
//                           <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${feature.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
//                     <span className="text-xs text-gray-500">{features.filter(f => f.enabled).length} of {features.length} active</span>
//                     <div className="flex gap-2">
//                       <button onClick={enableAll}  className="text-xs text-blue-600 hover:text-blue-700 font-medium">All On</button>
//                       <span className="text-gray-300">|</span>
//                       <button onClick={disableAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium">All Off</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             </div>

//             {/* Plant Selector */}
//             <div className="relative">
//               <button
//                 onClick={() => setPlantSelectorOpen(!plantSelectorOpen)}
//                 className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//               >
//                 <Factory className="w-4 h-4" />
//                 <span className="hidden sm:inline">{getPlantDisplayName(selectedPlant)}</span>
//                 <span className="sm:hidden">{getPlantShortName(selectedPlant)}</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {plantSelectorOpen && (
//                 <>
//                   <div className="fixed inset-0 z-30" onClick={() => setPlantSelectorOpen(false)} />
//                   <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40">
//                     {PLANTS.map(plant => (
//                       <button
//                         key={plant.id}
//                         onClick={() => {
//                           setSelectedPlant(plant.id);
//                           setPlantSelectorOpen(false);
//                         }}
//                         className={`w-full px-4 py-2 text-sm text-left hover:bg-blue-50 flex items-center justify-between transition-colors ${
//                           selectedPlant === plant.id
//                             ? 'bg-blue-50 text-blue-700 font-semibold'
//                             : 'text-gray-700 font-medium'
//                         }`}
//                       >
//                         <span>{plant.name}</span>
//                         {selectedPlant === plant.id && (
//                           <Check className="w-4 h-4 text-blue-600" />
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//           </div>

//           {/* ───────── RIGHT SIDE ───────── */}
//           <div className="flex items-center gap-3">

//             {/* Refresh */}
//             <button
//               onClick={refresh}
//               disabled={isRefreshing}
//               className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             {/* Last Updated */}
//             <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
//               <Clock className="w-4 h-4" />
//               <span>Last updated: {formatLastUpdated()}</span>
//             </div>

//           </div>

//         </div>
//       </PageHeader>

//       {/* ── Body ── */}
//       <div className="flex-1 overflow-auto p-4 sm:p-6">
//         {isLoading && !dashboardData ? (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">{[...Array(6)].map((_, i) => <SkeletonKPICard key={i} />)}</div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">{[...Array(3)].map((_, i) => <SkeletonChart key={i} />)}</div>
//             <SkeletonChart /><div className="mt-6"><SkeletonTable /></div>
//           </>
//         ) : filtered ? (
//           <>
//             {filtered.noneEnabled && <NoPPEBanner />}

//             {/* ── KPI Cards ── */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//               <KPICard title="Total Safety Events"    value={filtered.kpis.totalEvents}
//                 subtitle="Filtered by active features" icon={<Activity className="w-5 h-5" />} trend="down" trendValue="-3" />
//               <KPICard title="Open Incidents"          value={filtered.kpis.openIncidents}
//                 subtitle="Requires action"             icon={<AlertCircle className="w-5 h-5" />} trend="down" trendValue="-2"
//                 variant={filtered.kpis.openIncidents > 5 ? 'danger' : 'success'} />
//               <KPICard title="Closed Incidents"        value={filtered.kpis.closedIncidents}
//                 subtitle="Resolved successfully"       icon={<CheckCircle2 className="w-5 h-5" />} trend="up" trendValue="+5" />
//               <KPICard title="PPE Compliance Rate"     value={`${filtered.kpis.ppeComplianceRate}%`}
//                 subtitle="Based on active features"    icon={<Shield className="w-5 h-5" />}
//                 trend={filtered.kpis.ppeComplianceRate > 90 ? 'up' : 'down'}
//                 trendValue={`${filtered.kpis.ppeComplianceRate > 90 ? '+' : '-'}2%`}
//                 progress={filtered.kpis.ppeComplianceRate} variant="success" />
//               <KPICard title="Total Violations"        value={filtered.kpis.totalViolations}
//                 subtitle="Filtered by active features" icon={<AlertTriangle className="w-5 h-5" />} trend="down" trendValue="-3"
//                 variant={filtered.kpis.totalViolations > 8 ? 'danger' : 'warning'} />
//               <KPICard title="Avg AI Confidence Score" value={filtered.kpis.avgConfidence > 0 ? `${filtered.kpis.avgConfidence}%` : 'N/A'}
//                 subtitle="Detection accuracy"          icon={<TrendingUp className="w-5 h-5" />} trend="neutral"
//                 progress={filtered.kpis.avgConfidence} />
//             </div>

//             {/* ── Risk Metrics Row ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
//               {/* Severity Breakdown */}
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-medium text-gray-700">Events by Severity</h3>
//                   <span className="flex items-center gap-1 text-xs text-blue-600"><Filter className="w-3 h-3" />Filtered</span>
//                 </div>
//                 {filtered.noneEnabled ? <EmptyState message="No features active" /> : (
//                   <div className="space-y-3">
//                     {(['low','medium','high'] as const).map(level => (
//                       <div key={level} className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 capitalize">{level}</span>
//                         <span className={`font-semibold ${level === 'low' ? 'text-green-600' : level === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
//                           {filtered.severityBreakdown[level]}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Violation Types */}
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-medium text-gray-700">Most Frequent Violation Type</h3>
//                   <span className="flex items-center gap-1 text-xs text-blue-600"><Filter className="w-3 h-3" />Filtered</span>
//                 </div>
//                 {filtered.violationTypes.length > 0 ? (
//                   <div className="space-y-3">
//                     {filtered.violationTypes.map((type, i) => (
//                       <div key={type.name} className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">{type.name}</span>
//                         <span className={`font-semibold ${i === 0 ? 'text-red-600' : i === 1 ? 'text-yellow-600' : 'text-gray-800'}`}>{type.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : <EmptyState message="No violations for active features" />}
//               </div>

//               {/* Shift Data */}
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-medium text-gray-700">Shift-wise Incidents</h3>
//                   <span className="flex items-center gap-1 text-xs text-blue-600"><Filter className="w-3 h-3" />Filtered</span>
//                 </div>
//                 {filtered.shiftData.some(s => s.incidents > 0) ? (
//                   <div className="space-y-3">
//                     {filtered.shiftData.map(s => (
//                       <div key={s.shift} className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">{s.shift}</span>
//                         <span className={`font-semibold ${s.incidents === 0 ? 'text-gray-400' : 'text-gray-800'}`}>{s.incidents}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : <EmptyState message="No incidents for active features" />}
//               </div>
//             </div>

//             {/* ── Department Violations Chart ── */}
//             <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-base font-semibold text-gray-800">Department-wise Violations</h3>
//                 <span className="flex items-center gap-1.5 text-xs text-blue-600"><Filter className="w-3.5 h-3.5" />Filtered by active PPE features</span>
//               </div>
//               {filtered.departmentViolations.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 280}>
//                   <BarChart data={filtered.departmentViolations}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
//                     <Bar dataKey="violations" fill="#64748b" radius={[6,6,0,0]} label={{ position: 'top', fontSize: 11, fill: '#64748b' }} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : <EmptyState message="No department violations for active features" />}
//             </div>

//             {/* ── System Indicators ── */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="text-sm text-gray-500 mb-2">Risk Level</div>
//                 <StatusBadge status={filtered.riskLevel as any} />
//               </div>
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="text-sm text-gray-500 mb-2">Cameras Online</div>
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {filtered.cameraStatus.online} / {filtered.cameraStatus.online + filtered.cameraStatus.offline}
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="text-sm text-gray-500 mb-2">Cameras Offline</div>
//                 <div className="text-2xl font-semibold text-red-600">{filtered.cameraStatus.offline}</div>
//               </div>
//               <div className="bg-white rounded-lg p-5 shadow-sm">
//                 <div className="text-sm text-gray-500 mb-2">Active Monitoring Cameras</div>
//                 <div className="text-2xl font-semibold text-gray-900">{filtered.cameraStatus.active}</div>
//               </div>
//             </div>

//             {/* ── Live Incident Feed ── */}
//             <div className="bg-white rounded-lg shadow-sm mb-6">
//               <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-base font-semibold text-gray-800">Live Incident Feed</h2>
//                   <span className="flex items-center gap-1 text-xs text-blue-600">
//                     <Filter className="w-3 h-3" />{filtered.filteredIncidents.length} incidents for active features
//                   </span>
//                 </div>
//                 <Link to="/live-monitor" className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
//               </div>
//               {filtered.filteredIncidents.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[900px]">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         {['Plant','Unit','Station','Camera','Violation Type','Missing PPE','Severity','AI Confidence','Status','Time','Action'].map(h => (
//                           <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-600">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {filtered.filteredIncidents.slice(0, 5).map(inc => (
//                         <tr key={inc.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm text-gray-800">{inc.plant}</td>
//                           <td className="px-4 py-3 text-sm text-gray-800">{inc.unit}</td>
//                           <td className="px-4 py-3 text-sm text-gray-800">{inc.station}</td>
//                           <td className="px-4 py-3 text-sm text-gray-600">{inc.camera}</td>
//                           <td className="px-4 py-3 text-sm text-gray-800">{inc.violationType}</td>
//                           {/* Only show PPE tags for currently-enabled features */}
//                           <td className="px-4 py-3">
//                             <PPEIndicator items={inc.missingPPE.filter(p => features.find(f => f.name === p)?.enabled)} />
//                           </td>
//                           <td className="px-4 py-3"><StatusBadge status={inc.severity} size="sm" /></td>
//                           <td className="px-4 py-3 text-sm text-gray-800">{inc.aiConfidence}%</td>
//                           <td className="px-4 py-3"><StatusBadge status={inc.status} size="sm" /></td>
//                           <td className="px-4 py-3 text-sm text-gray-600">{inc.timestamp.split(' ')[1]}</td>
//                           <td className="px-4 py-3">
//                             <Link to={`/incident/${inc.id}`} className="text-blue-600 hover:text-blue-700"><Eye className="w-4 h-4" /></Link>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : <EmptyState message="No incidents match the active PPE features" />}
//             </div>

//             {/* ── PPE Analytics Charts ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
//               {[
//                 { title: 'Feature-wise Violations', data: filtered.featureViolations, key: 'feature', color: '#3b82f6' },
//                 { title: 'Section-wise Violations', data: filtered.sectionViolations, key: 'section', color: '#8b5cf6' },
//               ].map(chart => (
//                 <div key={chart.title} className="bg-white rounded-lg p-5 shadow-sm">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base font-semibold text-gray-800">{chart.title}</h3>
//                     <span className="flex items-center gap-1.5 text-xs text-gray-500"><Filter className="w-3.5 h-3.5" />Filtered</span>
//                   </div>
//                   <div className="mb-4 pb-3 border-b border-gray-100">
//                     <div className="text-xs text-gray-600 mb-2">Active PPE Filters:</div>
//                     <div className="flex flex-wrap gap-2">
//                       {features.map(f => (
//                         <span key={f.name} onClick={() => toggleFeature(f.name)}
//                           className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${f.enabled ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-60'}`}>
//                           {f.name}{f.enabled ? <Check className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   {chart.data.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={250}>
//                       <BarChart data={chart.data}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey={chart.key} tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
//                         <YAxis tick={{ fontSize: 12 }} />
//                         <Tooltip />
//                         <Bar dataKey="count" fill={chart.color} radius={[4,4,0,0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : <EmptyState message="No violations to display" />}
//                 </div>
//               ))}
//             </div>

//             {/* ── Recent PPE Events Grid ── */}
//             <div className="bg-white rounded-lg shadow-sm mb-6">
//               <div className="px-5 py-4 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-base font-semibold text-gray-800">Recent PPE Events</h2>
//                     <p className="text-sm text-gray-500 mt-1">Latest detected PPE violations and safety events</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="text-sm text-gray-600">
//                       <span className="font-semibold text-blue-600">{filtered.filteredEvents.length}</span>
//                       <span className="text-gray-500"> events showing</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
//                       <Filter className="w-3.5 h-3.5 text-blue-600" />
//                       <span className="text-xs font-medium text-blue-700">Filtered by Active PPE Features</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4 sm:p-6">
//                 {filtered.filteredEvents.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {filtered.filteredEvents.slice(0, 8).map(event => (
//                       <div key={event.id}
//                         className="group relative bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden cursor-pointer"
//                         onClick={() => { setSelectedImage(event.imageUrl); setSelectedEvent(event); }}>
//                         <div className="flex gap-4">
//                           <div className="relative w-32 h-35 flex-shrink-0">
//                             <img src={event.imageUrl} alt={`Event ${event.id}`} className="w-full h-full object-cover" />
//                             <div className="absolute top-2 left-2">
//                               <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold shadow-sm ${event.severity === 'High' ? 'bg-red-600 text-white' : event.severity === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>
//                                 {event.eventCategory}
//                               </span>
//                             </div>
//                             <div className="absolute bottom-2 right-2">
//                               <button onClick={e => { e.stopPropagation(); setSelectedImage(event.imageUrl); setSelectedEvent(event); }}
//                                 className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all">
//                                 <Eye className="w-4 h-4 text-gray-700" />
//                               </button>
//                             </div>
//                           </div>
//                           <div className="flex-1 py-3 pr-3">
//                             <div className="flex items-start justify-between mb-2">
//                               <div>
//                                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Event #{event.id}</div>
//                                 <h4 className="font-semibold text-gray-900">{event.plantName}</h4>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-xs text-gray-500 mb-1">AI Confidence</div>
//                                 <div className="text-sm font-bold text-gray-900">{event.confidenceScore}%</div>
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2 mb-3">
//                               <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                                 <MapPin className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{event.sectionName}</span>
//                               </div>
//                               <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                                 <Clock className="w-3.5 h-3.5 text-gray-400" /><span>{event.eventTime.split(' ')[1]}</span>
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <Zap className="w-3.5 h-3.5 text-blue-600" />
//                                 <span className="text-xs font-medium text-blue-700">{event.featureDetected}</span>
//                               </div>
//                               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
//                                   View Details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : <EmptyState message="No PPE events match the active filters. Try enabling more PPE features." icon={Filter} />}
//               </div>
//             </div>

//           </>
//         ) : null}

//         {/* ── Event Detail Modal ── */}
//         {selectedImage && selectedEvent && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
//             onClick={() => { setSelectedImage(null); setSelectedEvent(null); }}>
//             <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
//               onClick={e => e.stopPropagation()}>
//               <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">PPE Event Details</h3>
//                   <p className="text-sm text-gray-600 mt-1">Event ID: {selectedEvent.id}</p>
//                 </div>
//                 <button onClick={() => { setSelectedImage(null); setSelectedEvent(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-gray-200">
//                 <div className="p-4 sm:p-6 bg-gray-50">
//                   <img src={selectedImage} alt={`PPE Event ${selectedEvent.id}`} className="w-full rounded-lg shadow-lg border border-gray-200" />
//                   <div className="mt-4 flex items-center justify-between">
//                     <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${selectedEvent.severity === 'High' ? 'bg-red-100 text-red-700 border border-red-300' : selectedEvent.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
//                       {selectedEvent.eventCategory}
//                     </span>
//                     <div className="text-right">
//                       <div className="text-xs text-gray-500">AI Confidence</div>
//                       <div className="text-lg font-bold text-gray-900">{selectedEvent.confidenceScore}%</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
//                   <div className="space-y-5">
//                     <div>
//                       <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Location Information</h4>
//                       <div className="space-y-3">
//                         {[['Plant Name', selectedEvent.plantName], ['Section', selectedEvent.sectionName]].map(([l, v]) => (
//                           <div key={l} className="flex items-center justify-between py-2 border-b border-gray-100">
//                             <span className="text-sm text-gray-600">{l}</span>
//                             <span className="text-sm font-semibold text-gray-900">{v}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Violation Details</h4>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                           <span className="text-sm text-gray-600">Feature Detected</span>
//                           <span className="text-sm font-semibold text-blue-700">{selectedEvent.featureDetected}</span>
//                         </div>
//                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                           <span className="text-sm text-gray-600">Severity</span>
//                           <span className={`text-sm font-semibold ${selectedEvent.severity === 'High' ? 'text-red-600' : selectedEvent.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{selectedEvent.severity}</span>
//                         </div>
//                         <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                           <span className="text-sm text-gray-600">Event Time</span>
//                           <span className="text-sm font-semibold text-gray-900">{selectedEvent.eventTime}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="pt-4">
//                       <button onClick={() => { setSelectedImage(null); setSelectedEvent(null); }}
//                         className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
//                         Close Preview
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import {
  AlertCircle, RefreshCw, AlertTriangle, CheckCircle2, Activity,
  Settings, Clock, ChevronDown, AlertOctagon
} from 'lucide-react';
import { KPICard, PageHeader } from '../components/SharedComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

async function apiFetchDashboard(): Promise<DashboardData> {
  return getJSON<DashboardData>('/api/safety/dashboard');
}

async function apiFetchAllPPEEvents(): Promise<PPEEvent[]> {
  return getJSON<PPEEvent[]>('/api/safety/ppe-events');
}

async function apiFetchAllIncidents(): Promise<Incident[]> {
  return getJSON<Incident[]>('/api/safety/incidents');
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
  { name: 'Safety Gloves', enabled: false },
  { name: 'Safety Shoes', enabled: true },
  { name: 'Mask', enabled: true },
  { name: 'Running', enabled: true }
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-001', missingPPE: ['Helmet'], status: 'Open' },
  { id: 'INC-002', missingPPE: ['Gathering'], status: 'Open' },
  { id: 'INC-003', missingPPE: ['Safety Gloves'], status: 'Closed' },
  { id: 'INC-004', missingPPE: ['Helmet', 'Gathering'], status: 'Open' },
  { id: 'INC-005', missingPPE: ['Safety Shoes'], status: 'Closed' },
  { id: 'INC-006', missingPPE: ['Safety Gloves'], status: 'Open' },
  { id: 'INC-007', missingPPE: ['Helmet'], status: 'Open' },
  { id: 'INC-008', missingPPE: ['Running'], status: 'Closed' },
  { id: 'INC-009', missingPPE: ['Mask'], status: 'Closed' },
  { id: 'INC-010', missingPPE: ['Running'], status: 'Open' },
];

const MOCK_ALL_PPE_EVENTS: PPEEvent[] = [
  { id: 'EVT-001', featureDetected: 'Helmet', department: 'Assembly' },
  { id: 'EVT-002', featureDetected: 'Gathering', department: 'Welding' },
  { id: 'EVT-003', featureDetected: 'Safety Shoes', department: 'Storage' },
  { id: 'EVT-004', featureDetected: 'Helmet', department: 'Chemical' },
  { id: 'EVT-005', featureDetected: 'Safety Gloves', department: 'Packaging' },
  { id: 'EVT-006', featureDetected: 'Helmet', department: 'Assembly' },
  { id: 'EVT-007', featureDetected: 'Gathering', department: 'Welding' },
  { id: 'EVT-008', featureDetected: 'Safety Shoes', department: 'Chemical' },
  { id: 'EVT-009', featureDetected: 'Safety Gloves', department: 'Storage' },
  { id: 'EVT-0010', featureDetected: 'Running', department: 'Storage' },
  { id: 'EVT-0011', featureDetected: 'Mask', department: 'Assembly' },
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
    { department: 'Assembly', violations: 12 },
    { department: 'Welding', violations: 9 },
    { department: 'Packaging', violations: 7 },
    { department: 'Chemical', violations: 6 },
    { department: 'Storage', violations: 4 },
  ],
};

// ============================================================
// SECTION 4: DATA FETCHING HOOK
// ============================================================

function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [allPPEEvents, setAllPPEEvents] = useState<PPEEvent[]>([]);
  const [features, setFeatures] = useState<PPEFeature[]>(MOCK_FEATURES);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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
        setFeatures(MOCK_FEATURES);
      } else {
        const [dashboard, incidents, events, feats] = await Promise.all([
          apiFetchDashboard(),
          apiFetchAllIncidents(),
          apiFetchAllPPEEvents(),
          apiFetchPPEFeatures(),
        ]);
        setDashboardData(dashboard);
        setAllIncidents(incidents);
        setAllPPEEvents(events);
        setFeatures(feats);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

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

function useFilteredDashboard(
  dashboardData: DashboardData | null,
  allIncidents: Incident[],
  allPPEEvents: PPEEvent[],
  features: PPEFeature[]
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

export function SafetyCommandCenter() {
  const { dashboardData, allIncidents, allPPEEvents, features, isLoading, isRefreshing, error, lastUpdated, refresh, retry, toggleFeature, enableAll, disableAll } = useDashboardData();
  const filtered = useFilteredDashboard(dashboardData, allIncidents, allPPEEvents, features);
  const [ppeConfigOpen, setPpeConfigOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [now, setNow] = useState(new Date());

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
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader>
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">

          {/* ───────── LEFT SIDE ───────── */}
          <div className="flex flex-wrap items-center gap-3">
     
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
              <div ref={dropdownRef} className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-[80]"  >
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

            {/* Last Updated */}
            {/* <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <Clock className="w-4 h-4" />
              <span>Last updated: {formatLastUpdated()}</span>
            </div> */}

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
      <div className="flex-1 overflow-auto p-4 sm:p-6">
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

            {/* Violation Types */}
            {/* <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Most Frequent Violation Types</h3>
              {filtered.violationTypes.length > 0 ? (
                <div className="space-y-3">
                  {filtered.violationTypes.map((type, i) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type.name}</span>
                      <span className={`font-semibold ${i === 0 ? 'text-red-600' : i === 1 ? 'text-yellow-600' : 'text-gray-800'}`}>{type.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No violations for active features" />
              )}
            </div> */}

            {/* Violation Types Chart */}
            <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Most Frequent Violation Types</h3>

              {filtered.violationTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 240 : 300}>
                  <BarChart data={filtered.violationTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />

                    <YAxis tick={{ fontSize: 12 }} />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />

                    <Bar
                      dataKey="value"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                      label={{ position: 'top', fontSize: 11, fill: '#ef4444' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No violations for active features" />
              )}
            </div>

            {/* Department Violations Chart */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Department-wise Violations</h3>
              {filtered.departmentViolations.length > 0 ? (
                <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 280}>
                  <BarChart data={filtered.departmentViolations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="violations" fill="#64748b" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 11, fill: '#64748b' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No department violations for active features" />
              )}
            </div>  
          </>
        ) : null}
      </div>
    </div>
  );
}