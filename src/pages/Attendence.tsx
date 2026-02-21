// ============================================================
// SurveillanceDashboard.tsx - API-Ready Version
// ============================================================
// HOW TO INTEGRATE YOUR API:
// Search for "// 🔌 API INTEGRATION POINT" comments throughout
// this file. Each one tells you exactly what to change.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserX, Clock, AlertTriangle, Camera, Shield,
  Eye, MapPin, TrendingUp, TrendingDown, Search,
  CheckCircle, XCircle, AlertCircle, RefreshCw, AlertOctagon, ArrowLeft
} from 'lucide-react';
import { getJSON } from '../api';

// ============================================================
// SECTION 1: TYPE DEFINITIONS
// ============================================================


export interface AttendanceKPIs {
  usersPresent: number;
  usersPresentTrend: string;     
  usersAbsent: number;
  usersAbsentTrend: string;      
  firstInCount: number;
  firstInTrend: string;
  lateEntry: number;
  lateEntryTrend: string;
  avgPresence: string;             
  avgPresenceTrend: string;
  noOutRecord: number;
}


export interface SecurityKPIs {
  totalIntrusions: number;
  intrusionsTrend: string;          
  unmappedPersons: number;
  unknownDetections: number;
  timeViolations: number;
  zoneViolations: number;
  topAlertCamera: string;          
}

export interface CameraKPIs {
  activeCameras: number;
  camerasWithAlerts: number;
  totalDetections: string;         
  totalDetectionsTrend: string;
  peakTime: string;               
}


export interface VisitorKPIs {
  totalVisitorsToday: number;
  visitorsTrend: string;            
  currentlyInside: number;
  overstayCount: number;
  zoneViolations: number;
  avgDuration: string;            
  topHost: string;                
}


export interface LiveCamera {
  id: string;
  name: string;                    
  location: string;                
  status: 'normal' | 'intrusion' | 'time-violation' | 'zone-violation' | 'offline';
  detections: number;
  alerts: number;
  activityBars: number[];        
}


export interface SecurityEvent {
  id: string;
  personName: string;
  isUnknown: boolean;
  eventType: 'intrusion' | 'unknown-detection' | 'time-violation' | 'normal-entry' | 'visitor-violation';
  location: string;                
  time: string;                     
  confidence: number;            
}


export interface AttendanceRecord {
  id: string;
  userName: string;
  employeeId: string;
  firstSeen: string;                
  lastSeen: string;                
  totalDuration: string;           
  status: 'present' | 'absent' | 'no-out';
  lateEntry: 'on-time' | 'late';
  violations: number;
}


export interface ActiveVisitor {
  id: string;
  visitorName: string;
  hostName: string;
  entryTime: string;               
  duration: string;               
  camerasVisited: string[];         
  violationCount: number;
}


export interface VisitorHistory {
  id: string;
  visitorName: string;
  hostName: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  date: string;
  violationCount: number;
}


export interface VisitorViolation {
  id: string;
  visitorName: string;
  violationType: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}


export interface SurveillanceFilters {
  dateRange: string;      // "today" | "yesterday" | "last7days" | "custom"
  camera: string;         // "all" | "entrance" | "floor1" | "restricted"
  personType: string;     // "all" | "employees" | "visitors"
}

// ============================================================
// SECTION 2: API SERVICE LAYER
// ============================================================


// Helper to build query string from filter params
function buildQuery(filters: Partial<SurveillanceFilters & { q?: string }>): string {
  const q = new URLSearchParams();
  if (filters.dateRange && filters.dateRange !== 'today') q.set('dateRange', filters.dateRange);
  if (filters.camera    && filters.camera    !== 'all')   q.set('camera',    filters.camera);
  if (filters.personType && filters.personType !== 'all') q.set('personType', filters.personType);
  if (filters.q)                                          q.set('q',          filters.q);
  return q.toString() ? `?${q.toString()}` : '';
}

async function apiFetchAttendanceKPIs(f: SurveillanceFilters): Promise<AttendanceKPIs> {
  return getJSON<AttendanceKPIs>(`/api/surveillance/attendance/kpis${buildQuery(f)}`);
}

async function apiFetchSecurityKPIs(f: SurveillanceFilters): Promise<SecurityKPIs> {
  return getJSON<SecurityKPIs>(`/api/surveillance/security/kpis${buildQuery(f)}`);
}

async function apiFetchCameraKPIs(f: SurveillanceFilters): Promise<CameraKPIs> {
  return getJSON<CameraKPIs>(`/api/surveillance/cameras/kpis${buildQuery(f)}`);
}

async function apiFetchVisitorKPIs(f: SurveillanceFilters): Promise<VisitorKPIs> {
  return getJSON<VisitorKPIs>(`/api/surveillance/visitors/kpis${buildQuery(f)}`);
}

async function apiFetchLiveCameras(f: SurveillanceFilters): Promise<LiveCamera[]> {
  return getJSON<LiveCamera[]>(`/api/surveillance/cameras/live${buildQuery(f)}`);
}


async function apiFetchEventsFeed(f: SurveillanceFilters): Promise<SecurityEvent[]> {
  return getJSON<SecurityEvent[]>(`/api/surveillance/events/feed${buildQuery(f)}`);
}


async function apiFetchAttendanceRecords(f: SurveillanceFilters, search: string): Promise<AttendanceRecord[]> {
  return getJSON<AttendanceRecord[]>(`/api/surveillance/attendance/records${buildQuery({ ...f, q: search })}`);
}

async function apiFetchActiveVisitors(f: SurveillanceFilters): Promise<ActiveVisitor[]> {
  return getJSON<ActiveVisitor[]>(`/api/surveillance/visitors/active${buildQuery(f)}`);
}

async function apiFetchVisitorHistory(f: SurveillanceFilters): Promise<VisitorHistory[]> {
  return getJSON<VisitorHistory[]>(`/api/surveillance/visitors/history${buildQuery(f)}`);
}

async function apiFetchVisitorViolations(f: SurveillanceFilters): Promise<VisitorViolation[]> {
  return getJSON<VisitorViolation[]>(`/api/surveillance/visitors/violations${buildQuery(f)}`);
}
// ============================================================
// SECTION 3: FALLBACK / MOCK DATA
// ============================================================

// 🔌 STEP 3: Set this to false when your real API is ready
const USE_MOCK_DATA = true; // ← CHANGE TO false WHEN API IS READY

const MOCK_ATTENDANCE_KPIS: AttendanceKPIs = {
  usersPresent: 142, usersPresentTrend: '+8%',
  usersAbsent: 18,   usersAbsentTrend: '-3%',
  firstInCount: 142, firstInTrend: '-2%',
  lateEntry: 12,     lateEntryTrend: '-2%',
  avgPresence: '7.2h', avgPresenceTrend: '+5%',
  noOutRecord: 5,
};

const MOCK_SECURITY_KPIS: SecurityKPIs = {
  totalIntrusions: 8, intrusionsTrend: '+2',
  unmappedPersons: 3,
  unknownDetections: 5,
  timeViolations: 6,
  zoneViolations: 4,
  topAlertCamera: 'CAM-03',
};

const MOCK_CAMERA_KPIS: CameraKPIs = {
  activeCameras: 24,
  camerasWithAlerts: 6,
  totalDetections: '1.2K', totalDetectionsTrend: '+12%',
  peakTime: '09:00',
};

const MOCK_VISITOR_KPIS: VisitorKPIs = {
  totalVisitorsToday: 34, visitorsTrend: '+5',
  currentlyInside: 12,
  overstayCount: 2,
  zoneViolations: 1,
  avgDuration: '2.5h',
  topHost: 'John Doe',
};

// deterministic bar heights (avoids hydration mismatch from Math.random)
const BAR_PRESETS = [
  [40,65,55,75,45,80,60,70,50,85,55,65,45,75,60,80,50,70,40,75],
  [60,45,70,55,80,40,65,75,50,85,45,70,60,55,80,45,75,60,50,70],
  [80,90,75,85,95,70,85,80,90,75,95,85,70,90,80,85,75,90,80,85],
  [50,65,45,70,55,75,45,65,55,80,50,70,45,75,55,65,50,75,45,70],
  [35,50,45,55,40,60,45,55,35,65,45,55,40,60,35,55,45,60,40,55],
  [65,75,60,80,70,75,65,80,70,85,60,75,70,80,65,75,60,80,65,75],
];

const MOCK_LIVE_CAMERAS: LiveCamera[] = [
  { id: 'cam-01', name: 'Entrance Main',    location: '1 - Main Gate',    status: 'normal',         detections: 247, alerts: 0, activityBars: BAR_PRESETS[0] },
  { id: 'cam-02', name: 'Floor 1 Corridor', location: '1 - East Wing',    status: 'normal',         detections: 189, alerts: 0, activityBars: BAR_PRESETS[1] },
  { id: 'cam-03', name: 'Server Room',      location: '2 - Restricted',   status: 'intrusion',      detections: 45,  alerts: 3, activityBars: BAR_PRESETS[2] },
  { id: 'cam-04', name: 'Parking Area',     location: '3 - Outdoor',      status: 'time-violation', detections: 312, alerts: 2, activityBars: BAR_PRESETS[3] },
  { id: 'cam-05', name: 'Conference Room',  location: '3 - Meeting',      status: 'normal',         detections: 98,  alerts: 0, activityBars: BAR_PRESETS[4] },
  { id: 'cam-06', name: 'Cafeteria',        location: 'Floor 1 - Common', status: 'normal',         detections: 456, alerts: 0, activityBars: BAR_PRESETS[5] },
];

const MOCK_EVENTS: SecurityEvent[] = [
  { id: 'e1', personName: 'John Smith',         isUnknown: false, eventType: 'intrusion',         location: 'Server Room - CAM-03',      time: '10:45 AM', confidence: 98 },
  { id: 'e2', personName: 'Unknown Person',     isUnknown: true,  eventType: 'unknown-detection', location: 'Parking Area - CAM-04',     time: '10:42 AM', confidence: 76 },
  { id: 'e3', personName: 'Sarah Johnson',      isUnknown: false, eventType: 'time-violation',    location: 'Conference Room - CAM-05',  time: '10:38 AM', confidence: 95 },
  { id: 'e4', personName: 'Mike Davis',         isUnknown: false, eventType: 'normal-entry',      location: 'Entrance Main - CAM-01',    time: '10:35 AM', confidence: 99 },
  { id: 'e5', personName: 'Emily Chen',         isUnknown: false, eventType: 'normal-entry',      location: 'Entrance Main - CAM-01',    time: '10:32 AM', confidence: 97 },
  { id: 'e6', personName: 'Visitor - Alex Brown', isUnknown: false, eventType: 'visitor-violation', location: 'Floor 2 - CAM-08',        time: '10:28 AM', confidence: 94 },
  { id: 'e7', personName: 'David Wilson',       isUnknown: false, eventType: 'normal-entry',      location: 'Cafeteria - CAM-06',        time: '10:25 AM', confidence: 96 },
];

const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: '1', userName: 'John Smith',    employeeId: 'EMP-001', firstSeen: '08:45 AM', lastSeen: '05:30 PM', totalDuration: '8h 45m', status: 'present', lateEntry: 'on-time', violations: 0 },
  { id: '2', userName: 'Sarah Johnson', employeeId: 'EMP-002', firstSeen: '09:15 AM', lastSeen: '06:00 PM', totalDuration: '8h 45m', status: 'present', lateEntry: 'late',    violations: 1 },
  { id: '3', userName: 'Mike Davis',    employeeId: 'EMP-003', firstSeen: '08:30 AM', lastSeen: '05:45 PM', totalDuration: '9h 15m', status: 'present', lateEntry: 'on-time', violations: 0 },
  { id: '4', userName: 'Emily Chen',    employeeId: 'EMP-004', firstSeen: '08:50 AM', lastSeen: '—',        totalDuration: '—',      status: 'no-out',  lateEntry: 'on-time', violations: 1 },
  { id: '5', userName: 'David Wilson',  employeeId: 'EMP-005', firstSeen: '—',        lastSeen: '—',        totalDuration: '—',      status: 'absent',  lateEntry: 'on-time', violations: 0 },
  { id: '6', userName: 'Lisa Anderson', employeeId: 'EMP-006', firstSeen: '09:30 AM', lastSeen: '05:15 PM', totalDuration: '7h 45m', status: 'present', lateEntry: 'late',    violations: 2 },
  { id: '7', userName: 'Tom Martinez',  employeeId: 'EMP-007', firstSeen: '08:25 AM', lastSeen: '06:30 PM', totalDuration: '10h 5m', status: 'present', lateEntry: 'on-time', violations: 1 },
  { id: '8', userName: 'Rachel Green',  employeeId: 'EMP-008', firstSeen: '08:55 AM', lastSeen: '05:20 PM', totalDuration: '8h 25m', status: 'present', lateEntry: 'on-time', violations: 0 },
];

const MOCK_ACTIVE_VISITORS: ActiveVisitor[] = [
  { id: 'v1', visitorName: 'Alex Brown',     hostName: 'John Smith',  entryTime: '09:30 AM', duration: '1h 15m', camerasVisited: ['Entrance', 'Floor 1', 'Meeting Room'], violationCount: 1 },
  { id: 'v2', visitorName: 'Jennifer White', hostName: 'Sarah Johnson', entryTime: '10:00 AM', duration: '45m',   camerasVisited: ['Entrance', 'Cafeteria'],               violationCount: 0 },
  { id: 'v3', visitorName: 'Robert Taylor',  hostName: 'Mike Davis',  entryTime: '08:45 AM', duration: '1h 55m', camerasVisited: ['Entrance', 'Floor 2', 'Conference A'],  violationCount: 0 },
];

const MOCK_VISITOR_HISTORY: VisitorHistory[] = [
  { id: 'vh1', visitorName: 'Carol White',   hostName: 'John Smith',    entryTime: '09:00 AM', exitTime: '11:30 AM', duration: '2h 30m', date: 'Today', violationCount: 0 },
  { id: 'vh2', visitorName: 'Mark Hughes',   hostName: 'Lisa Anderson', entryTime: '01:15 PM', exitTime: '03:45 PM', duration: '2h 30m', date: 'Today', violationCount: 1 },
  { id: 'vh3', visitorName: 'Susan Lee',     hostName: 'Tom Martinez',  entryTime: '10:00 AM', exitTime: '12:00 PM', duration: '2h 0m',  date: 'Yesterday', violationCount: 0 },
];

const MOCK_VISITOR_VIOLATIONS: VisitorViolation[] = [
  { id: 'vv1', visitorName: 'Alex Brown',  violationType: 'Zone Violation',  location: 'Floor 2 Restricted', time: '10:28 AM', severity: 'high'   },
  { id: 'vv2', visitorName: 'Mark Hughes', violationType: 'Overstay',        location: 'Conference Room A',  time: '03:30 PM', severity: 'medium' },
  { id: 'vv3', visitorName: 'Mark Hughes', violationType: 'Time Restriction', location: 'Server Corridor',   time: '02:45 PM', severity: 'high'   },
];

// ============================================================
// SECTION 4: DATA FETCHING HOOKS
// ============================================================

// Hook for Overview tab data
function useOverviewData(filters: SurveillanceFilters) {
  const [attendanceKPIs,  setAttendanceKPIs]  = useState<AttendanceKPIs | null>(null);
  const [securityKPIs,    setSecurityKPIs]    = useState<SecurityKPIs | null>(null);
  const [cameraKPIs,      setCameraKPIs]      = useState<CameraKPIs | null>(null);
  const [visitorKPIs,     setVisitorKPIs]     = useState<VisitorKPIs | null>(null);
  const [liveCameras,     setLiveCameras]     = useState<LiveCamera[]>([]);
  const [eventsFeed,      setEventsFeed]      = useState<SecurityEvent[]>([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isRefreshing,    setIsRefreshing]    = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [lastUpdated,     setLastUpdated]     = useState<Date>(new Date());

  const load = useCallback(async (showSpinner = true) => {
    try {
      showSpinner ? setIsLoading(true) : setIsRefreshing(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 700));
        setAttendanceKPIs(MOCK_ATTENDANCE_KPIS);
        setSecurityKPIs(MOCK_SECURITY_KPIS);
        setCameraKPIs(MOCK_CAMERA_KPIS);
        setVisitorKPIs(MOCK_VISITOR_KPIS);
        setLiveCameras(MOCK_LIVE_CAMERAS);
        setEventsFeed(MOCK_EVENTS);
      } else {
        // 🔌 All 6 overview calls in parallel
        const [ak, sk, ck, vk, lc, ef] = await Promise.all([
          apiFetchAttendanceKPIs(filters),
          apiFetchSecurityKPIs(filters),
          apiFetchCameraKPIs(filters),
          apiFetchVisitorKPIs(filters),
          apiFetchLiveCameras(filters),
          apiFetchEventsFeed(filters),
        ]);
        setAttendanceKPIs(ak); setSecurityKPIs(sk); setCameraKPIs(ck);
        setVisitorKPIs(vk); setLiveCameras(lc); setEventsFeed(ef);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters.dateRange, filters.camera, filters.personType]);

  useEffect(() => { load(true); }, [load]);

  return { attendanceKPIs, securityKPIs, cameraKPIs, visitorKPIs,
           liveCameras, eventsFeed, isLoading, isRefreshing, error,
           lastUpdated, refresh: () => load(false), retry: () => load(true) };
}

// Hook for Attendance Details tab
function useAttendanceData(filters: SurveillanceFilters, search: string, isActive: boolean) {
  const [records,     setRecords]     = useState<AttendanceRecord[]>([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isActive) return;
    try {
      setIsLoading(true); setError(null);
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 400));
        const lower = search.toLowerCase();
        setRecords(
          lower
            ? MOCK_ATTENDANCE_RECORDS.filter(
                r => r.userName.toLowerCase().includes(lower) ||
                     r.employeeId.toLowerCase().includes(lower),
              )
            : MOCK_ATTENDANCE_RECORDS,
        );
      } else {
        setRecords(await apiFetchAttendanceRecords(filters, search));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  }, [filters.dateRange, filters.camera, filters.personType, search, isActive]);

  useEffect(() => { load(); }, [load]);
  return { records, isLoading, error };
}

// Hook for Visitor Management tab
function useVisitorData(
  filters: SurveillanceFilters,
  subTab: 'active' | 'history' | 'violations',
  isActive: boolean,
) {
  const [activeVisitors,   setActiveVisitors]   = useState<ActiveVisitor[]>([]);
  const [visitorHistory,   setVisitorHistory]   = useState<VisitorHistory[]>([]);
  const [violations,       setViolations]       = useState<VisitorViolation[]>([]);
  const [isLoading,        setIsLoading]        = useState(false);
  const [error,            setError]            = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isActive) return;
    try {
      setIsLoading(true); setError(null);
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 400));
        setActiveVisitors(MOCK_ACTIVE_VISITORS);
        setVisitorHistory(MOCK_VISITOR_HISTORY);
        setViolations(MOCK_VISITOR_VIOLATIONS);
      } else {
        // Only fetch the current sub-tab to avoid unnecessary calls
        if (subTab === 'active')     setActiveVisitors(await apiFetchActiveVisitors(filters));
        if (subTab === 'history')    setVisitorHistory(await apiFetchVisitorHistory(filters));
        if (subTab === 'violations') setViolations(await apiFetchVisitorViolations(filters));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visitor data');
    } finally {
      setIsLoading(false);
    }
  }, [filters.dateRange, filters.camera, filters.personType, subTab, isActive]);

  useEffect(() => { load(); }, [load]);
  return { activeVisitors, visitorHistory, violations, isLoading, error };
}

// ============================================================
// SECTION 5: UI HELPER COMPONENTS
// ============================================================

function SkeletonKPIRow({ cols = 6 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {[...Array(cols)].map((_, i) => (
        <div key={i} className="bg-white border-l-4 border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      ))}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-100 rounded mb-1" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-50 border-b border-gray-100" />
      ))}
    </div>
  );
}

function SkeletonCameraGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="h-12 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function SkeletonEventFeed() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded border-l-4 border-gray-200" />
      ))}
    </div>
  );
}

function ErrorInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertOctagon className="w-10 h-10 text-red-500 mb-3" />
      <p className="text-sm font-medium text-gray-800 mb-1">Failed to load data</p>
      <p className="text-xs text-gray-500 mb-4 text-center max-w-xs">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Retry
      </button>
    </div>
  );
}

function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

// ============================================================
// SECTION 6: STYLE HELPERS
// ============================================================

const CAMERA_STATUS_STYLES: Record<string, { border: string; icon: string; label: string; bar: string }> = {
  'normal':         { border: 'border-green-500',  icon: 'text-green-600',  label: 'text-green-600',  bar: 'bg-green-400'  },
  'intrusion':      { border: 'border-red-500',    icon: 'text-red-600',    label: 'text-red-600',    bar: 'bg-red-400'    },
  'time-violation': { border: 'border-orange-500', icon: 'text-orange-600', label: 'text-orange-600', bar: 'bg-orange-400' },
  'zone-violation': { border: 'border-yellow-500', icon: 'text-yellow-600', label: 'text-yellow-600', bar: 'bg-yellow-400' },
  'offline':        { border: 'border-gray-400',   icon: 'text-gray-400',   label: 'text-gray-400',   bar: 'bg-gray-300'   },
};

const EVENT_STYLES: Record<string, { border: string; bg: string; hover: string; badge: string; text: string; icon: React.ReactNode; label: string }> = {
  'intrusion':         { border: 'border-red-500',    bg: 'bg-red-50',    hover: 'hover:bg-red-100',    badge: 'bg-red-100 text-red-800',       text: 'text-red-800',   icon: <AlertTriangle className="w-3 h-3" />, label: 'Intrusion'         },
  'unknown-detection': { border: 'border-orange-500', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', badge: 'bg-orange-100 text-orange-800', text: 'text-orange-800', icon: <AlertCircle  className="w-3 h-3" />, label: 'Unknown Detection' },
  'time-violation':    { border: 'border-orange-500', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', badge: 'bg-orange-100 text-orange-800', text: 'text-orange-800', icon: <Clock        className="w-3 h-3" />, label: 'Time Violation'    },
  'normal-entry':      { border: 'border-green-500',  bg: 'bg-green-50',  hover: 'hover:bg-green-100',  badge: 'bg-green-100 text-green-800',   text: 'text-green-800',  icon: <CheckCircle  className="w-3 h-3" />, label: 'Normal Entry'      },
  'visitor-violation': { border: 'border-orange-500', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', badge: 'bg-orange-100 text-orange-800', text: 'text-orange-800', icon: <AlertCircle  className="w-3 h-3" />, label: 'Visitor Violation' },
};

function getConfidenceBarColor(confidence: number) {
  if (confidence >= 90) return 'bg-green-500';
  if (confidence >= 70) return 'bg-orange-500';
  return 'bg-red-500';
}

// ============================================================
// SECTION 7: MAIN PAGE COMPONENT
// ============================================================

export function SurveillanceDashboard() {
  const navigate = useNavigate();
  // ── Filter state (header dropdowns) ──
  const [dateRange,   setDateRange]   = useState('today');
  const [camera,      setCamera]      = useState('all');
  const [personType,  setPersonType]  = useState('all');

  const filters: SurveillanceFilters = { dateRange, camera, personType };

  // ── Tab state ──
  const [activeTab,     setActiveTab]     = useState<'overview' | 'attendance' | 'visitor'>('overview');
  const [visitorSubTab, setVisitorSubTab] = useState<'active' | 'history' | 'violations'>('active');

  // ── Search for attendance tab ──
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (v: string) => {
    setSearchQuery(v);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setDebouncedSearch(v), 400);
  };

  // ── Data hooks ──
  const overview    = useOverviewData(filters);
  const attendance  = useAttendanceData(filters, debouncedSearch, activeTab === 'attendance');
  const visitors    = useVisitorData(filters, visitorSubTab, activeTab === 'visitor');

  // ── Auto-refresh every 30s on Overview (live data changes frequently) ──
  const refreshRef = useRef(overview.refresh);
  refreshRef.current = overview.refresh;
  useEffect(() => {
    if (activeTab !== 'overview') return;
    const interval = setInterval(() => refreshRef.current(), 30_000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const formatLastUpdated = () => {
    const diff = Math.floor((Date.now() - overview.lastUpdated.getTime()) / 1000);
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0 sticky top-0 z-40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">

          {/* ───────── LEFT SIDE ───────── */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="relative z-50 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Person Type */}    
            <select
              value={personType}
              onChange={e => setPersonType(e.target.value)}
              className="relative z-50 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="employees">Employees</option>
              <option value="visitors">Visitors</option>
            </select>

            {/* Camera */}
            <select
              value={camera}
              onChange={e => setCamera(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cameras</option>
              <option value="entrance">Entrance</option>
              <option value="floor1">Floor 1</option>
              <option value="restricted">Restricted</option>
            </select>

          </div>

          {/* ───────── RIGHT SIDE ───────── */}
          <div className="flex items-center gap-3">

            {/* Refresh */}
            <button
              onClick={overview.refresh}
              disabled={overview.isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${overview.isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Updated Text */}
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Updated: {formatLastUpdated()}
            </span>

          </div>

        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-[14px] inline-flex p-1">
          {(['overview', 'attendance', 'visitor'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-[14px] transition-colors capitalize ${
                activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' ? 'Overview Dashboard' : tab === 'attendance' ? 'Attendance Details' : 'Visitor Management'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">

        {/* ══════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Attendance Overview KPIs */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-green-500 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Attendance Overview</h2>
              </div>

              {overview.isLoading && !overview.attendanceKPIs ? (
                <SkeletonKPIRow cols={6} />
              ) : overview.error && !overview.attendanceKPIs ? (
                <ErrorInline message={overview.error} onRetry={overview.retry} />
              ) : overview.attendanceKPIs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard color="green" label="Users Present Today"  value={overview.attendanceKPIs.usersPresent} trend={overview.attendanceKPIs.usersPresentTrend} trendUp icon={<Users className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"   label="Users Absent Today"   value={overview.attendanceKPIs.usersAbsent}  trend={overview.attendanceKPIs.usersAbsentTrend}  trendUp={false} icon={<UserX className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="green" label="First IN Record"      value={overview.attendanceKPIs.firstInCount}  trend={overview.attendanceKPIs.firstInTrend}     trendUp={false} icon={<Clock className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="orange" label="Late Entry"          value={overview.attendanceKPIs.lateEntry}     trend={overview.attendanceKPIs.lateEntryTrend}   trendUp={false} icon={<AlertTriangle className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="green" label="Avg Presence"         value={overview.attendanceKPIs.avgPresence}   trend={overview.attendanceKPIs.avgPresenceTrend}  trendUp icon={<Clock className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="orange" label="No OUT Record"       value={overview.attendanceKPIs.noOutRecord} icon={<Users className="w-8 h-8 text-gray-400" />} />
                </div>
              ) : null}
            </div>

            {/* Security Alert KPIs */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Intrusion & Security Alerts</h2>
              </div>
              {overview.isLoading && !overview.securityKPIs ? (
                <SkeletonKPIRow cols={6} />
              ) : overview.securityKPIs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard color="red"    label="Total Intrusions Today" value={overview.securityKPIs.totalIntrusions}    trend={overview.securityKPIs.intrusionsTrend} trendUp icon={<Shield className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"    label="Unmapped Persons"       value={overview.securityKPIs.unmappedPersons}    icon={<Users className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"    label="Unknown Detect"         value={overview.securityKPIs.unknownDetections}  icon={<AlertTriangle className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="orange" label="Time Violations"        value={overview.securityKPIs.timeViolations}     icon={<Clock className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"    label="Zone Violations"        value={overview.securityKPIs.zoneViolations}     icon={<MapPin className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"    label="Top Alert Camera"       value={overview.securityKPIs.topAlertCamera}     icon={<Camera className="w-8 h-8 text-gray-400" />} />
                </div>
              ) : null}
            </div>

            {/* Camera Monitoring KPIs */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Camera Monitoring</h2>
              </div>
              {overview.isLoading && !overview.cameraKPIs ? (
                <SkeletonKPIRow cols={4} />
              ) : overview.cameraKPIs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard color="blue"   label="Active Cameras"     value={overview.cameraKPIs.activeCameras}        icon={<Camera className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="orange" label="Cameras with Alerts" value={overview.cameraKPIs.camerasWithAlerts}   icon={<AlertTriangle className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="blue"   label="Total Detections"   value={overview.cameraKPIs.totalDetections}      trend={overview.cameraKPIs.totalDetectionsTrend} trendUp icon={<Eye className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="blue"   label="Peak Time"          value={overview.cameraKPIs.peakTime}             icon={<Clock className="w-8 h-8 text-gray-400" />} />
                </div>
              ) : null}
            </div>

            {/* Visitor Management KPIs */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Visitor Management</h2>
              </div>
              {overview.isLoading && !overview.visitorKPIs ? (
                <SkeletonKPIRow cols={6} />
              ) : overview.visitorKPIs ? (
                <div className="grid grid-cols-6 gap-4">
                  <StatCard color="purple" label="Total Visitors Today" value={overview.visitorKPIs.totalVisitorsToday} trend={overview.visitorKPIs.visitorsTrend} trendUp icon={<Users className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="purple" label="Currently Inside"     value={overview.visitorKPIs.currentlyInside}    icon={<Users className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="orange" label="Overstay Count"       value={overview.visitorKPIs.overstayCount}      icon={<Clock className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="red"    label="Zone Violations"      value={overview.visitorKPIs.zoneViolations}     icon={<Shield className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="purple" label="Avg Duration"         value={overview.visitorKPIs.avgDuration}        icon={<Clock className="w-8 h-8 text-gray-400" />} />
                  <StatCard color="purple" label="Top Host"             value={overview.visitorKPIs.topHost} smallValue  icon={<Users className="w-8 h-8 text-gray-400" />} />
                </div>
              ) : null}
            </div>

            {/* Live Camera Grid + Events Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-4 sm:gap-6">

              {/* Live Camera Grid */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Live Camera Monitoring</h3>
                    <p className="text-sm text-gray-600">Real-time detection and alerts</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-700">
                      {overview.cameraKPIs ? `${overview.cameraKPIs.activeCameras} Cameras Active` : 'Live'}
                    </span>
                  </div>
                </div>

                {overview.isLoading && overview.liveCameras.length === 0 ? (
                  <SkeletonCameraGrid />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {overview.liveCameras.map(cam => {
                      const s = CAMERA_STATUS_STYLES[cam.status] ?? CAMERA_STATUS_STYLES['normal'];
                      const hasAlert = cam.alerts > 0;
                      return (
                        <div key={cam.id} className={`bg-white border-2 ${s.border} rounded-lg p-4 shadow-sm relative`}>
                          {hasAlert && (
                            <div className="absolute top-2 right-2">
                              <AlertTriangle className={`w-4 h-4 ${s.icon}`} />
                            </div>
                          )}
                          <div className="flex items-start gap-2 mb-3">
                            <Camera className={`w-5 h-5 ${s.icon} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">{cam.name}</h4>
                              <p className="text-xs text-gray-600 truncate">{cam.location}</p>
                            </div>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Status</span>
                              <span className={`font-semibold capitalize ${s.label}`}>
                                {cam.status.replace('-', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Detections</span>
                              <span className="font-bold text-gray-900">{cam.detections}</span>
                            </div>
                            {cam.alerts > 0 && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Alerts</span>
                                <span className={`font-bold ${s.label}`}>{cam.alerts}</span>
                              </div>
                            )}
                          </div>
                          {/* Mini Activity Bar Chart */}
                          <div className="h-12 bg-gray-50 rounded flex items-end gap-0.5 p-1">
                            {cam.activityBars.map((h, i) => (
                              <div
                                key={i}
                                className={`flex-1 ${s.bar} rounded-sm`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Real-Time Events Feed */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Real-Time Events Feed</h3>
                  <p className="text-sm text-gray-600">Live detection events</p>
                </div>

                {overview.isLoading && overview.eventsFeed.length === 0 ? (
                  <SkeletonEventFeed />
                ) : overview.eventsFeed.length === 0 ? (
                  <EmptyTableState message="No events in feed" />
                ) : (
                  <div className="space-y-1 max-h-[800px] overflow-y-auto">
                    {overview.eventsFeed.map(event => {
                      const s = EVENT_STYLES[event.eventType] ?? EVENT_STYLES['normal-entry'];
                      return (
                        <div
                          key={event.id}
                          className={`flex items-start gap-3 p-3 border-l-4 ${s.border} ${s.bg} rounded ${s.hover} transition-colors`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${event.isUnknown ? 'bg-gray-400' : 'bg-blue-600'}`}>
                            {event.isUnknown
                              ? <AlertTriangle className="w-5 h-5 text-white" />
                              : <Users className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">{event.personName}</h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{event.time}</span>
                            </div>
                            <div className="mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.badge}`}>
                                {s.icon}
                                {s.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{event.location}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Confidence:</span>
                              <div className="flex-1 max-w-[80px] bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${getConfidenceBarColor(event.confidence)}`}
                                  style={{ width: `${event.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-900">{event.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            ATTENDANCE DETAILS TAB
        ══════════════════════════════════════ */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daily Attendance Summary</h2>
                  <p className="text-sm text-gray-600">Complete attendance records for today</p>
                </div>
                <div className="flex items-center gap-2">
                {/* Search Icon OUTSIDE */}
                <Search
                  className={`w-4 h-4 ${
                    attendance.isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                  }`}
                />

                {/* Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              </div>
            </div>

            {attendance.isLoading ? (
              <div className="p-6"><SkeletonTable /></div>
            ) : attendance.error ? (
              <ErrorInline message={attendance.error} onRetry={() => {}} />
            ) : attendance.records.length === 0 ? (
              <EmptyTableState message={searchQuery ? `No records matching "${searchQuery}"` : 'No attendance records found'} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['User Name','Employee ID','First Seen','Last Seen','Total Duration','Status','Late Entry','Violations'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendance.records.map(rec => (
                      <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rec.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{rec.employeeId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{rec.firstSeen}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{rec.lastSeen}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{rec.totalDuration}</td>
                        <td className="px-6 py-4">
                          <AttendanceStatusBadge status={rec.status} />
                        </td>
                        <td className="px-6 py-4">
                          <LateEntryBadge status={rec.lateEntry} />
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-semibold">
                          <span className={rec.violations > 0 ? 'text-red-600' : 'text-gray-400'}>{rec.violations}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            VISITOR MANAGEMENT TAB
        ══════════════════════════════════════ */}
        {activeTab === 'visitor' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Visitor Tracking & Management</h2>
              <p className="text-sm text-gray-600">Monitor and manage all visitor activities</p>
            </div>

            {/* Visitor Sub-tabs */}
            <div className="px-6 pt-4 border-b border-gray-200">
              <div className="flex gap-6">
                {([
                  { key: 'active',     label: `Active Visitors (${visitors.activeVisitors.length})`, icon: <Users className="w-4 h-4" /> },
                  { key: 'history',    label: 'Visitor History',      icon: <Clock className="w-4 h-4" /> },
                  { key: 'violations', label: `Violations (${visitors.violations.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setVisitorSubTab(tab.key)}
                    className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                      visitorSubTab === tab.key ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {visitorSubTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {visitors.isLoading ? (
              <div className="p-6"><SkeletonTable /></div>
            ) : visitors.error ? (
              <ErrorInline message={visitors.error} onRetry={() => {}} />
            ) : (
              <>
                {/* Active Visitors */}
                {visitorSubTab === 'active' && (
                  visitors.activeVisitors.length === 0 ? (
                    <EmptyTableState message="No active visitors at this time" />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {['Visitor Name','Host Name','Entry Time','Duration','Cameras Visited','Status'].map(h => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {visitors.activeVisitors.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.visitorName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.hostName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.entryTime}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.duration}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {v.camerasVisited.map(cam => (
                                    <span key={cam} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">{cam}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {v.violationCount > 0 ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <AlertCircle className="w-3 h-3" />
                                    {v.violationCount} Violation{v.violationCount > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3" />
                                    Normal
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* Visitor History */}
                {visitorSubTab === 'history' && (
                  visitors.visitorHistory.length === 0 ? (
                    <EmptyTableState message="No visitor history for this period" />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {['Visitor Name','Host Name','Date','Entry Time','Exit Time','Duration','Violations'].map(h => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {visitors.visitorHistory.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.visitorName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.hostName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.date}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.entryTime}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.exitTime}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.duration}</td>
                              <td className="px-6 py-4 text-sm text-center font-semibold">
                                <span className={v.violationCount > 0 ? 'text-red-600' : 'text-gray-400'}>{v.violationCount}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* Violations */}
                {visitorSubTab === 'violations' && (
                  visitors.violations.length === 0 ? (
                    <EmptyTableState message="No visitor violations recorded" />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {['Visitor Name','Violation Type','Location','Time','Severity'].map(h => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {visitors.violations.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.visitorName}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{v.violationType}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.location}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{v.time}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  v.severity === 'high'   ? 'bg-red-100    text-red-700    border-red-200'    :
                                  v.severity === 'medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }`}>
                                  {v.severity.charAt(0).toUpperCase() + v.severity.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 8: SMALL DISPLAY-ONLY SUB-COMPONENTS
// ============================================================

const COLOR_MAP: Record<string, string> = {
  green:  'border-green-500',
  red:    'border-red-500',
  orange: 'border-orange-500',
  blue:   'border-blue-500',
  purple: 'border-purple-500',
};

const TREND_COLOR: Record<string, string> = {
  green:  'text-green-600',
  red:    'text-red-600',
  orange: 'text-orange-600',
  blue:   'text-blue-600',
  purple: 'text-purple-600',
};

function StatCard({
  color, label, value, trend, trendUp, icon, smallValue,
}: {
  color: string;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  smallValue?: boolean;
}) {
  return (
    <div className={`bg-white border-l-4 ${COLOR_MAP[color] ?? 'border-gray-300'} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`font-bold text-gray-900 ${smallValue ? 'text-lg' : 'text-3xl'}`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trendUp
                ? <TrendingUp   className={`w-4 h-4 ${TREND_COLOR[color]}`} />
                : <TrendingDown className="w-4 h-4 text-red-600" />}
              <span className={`text-xs font-medium ${trendUp ? TREND_COLOR[color] : 'text-red-600'}`}>{trend}</span>
            </div>
          )}
        </div>
        {icon}
      </div>
    </div>
  );
}

function AttendanceStatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const map = {
    present: { style: 'bg-green-100 text-green-800',  icon: <CheckCircle className="w-3 h-3" />, label: 'Present' },
    absent:  { style: 'bg-red-100 text-red-800',      icon: <XCircle     className="w-3 h-3" />, label: 'Absent'  },
    'no-out':{ style: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-3 h-3" />, label: 'No OUT'  },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.style}`}>
      {s.icon} {s.label}
    </span>
  );
}

function LateEntryBadge({ status }: { status: AttendanceRecord['lateEntry'] }) {
  return status === 'on-time' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <CheckCircle className="w-3 h-3" /> On Time
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
      <AlertCircle className="w-3 h-3" /> Late
    </span>
  );
}