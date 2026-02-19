// Mock data for IGRID dashboard
// Mock data for IGRID dashboard
import type { Person, PersonDetail, Session, TimelineSlot, ZonePresence } from '../../types';

// Helper function to format time in HH:MM format
const formatTime = (hour: number, minute: number = 0): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Generate mock people data
export const mockPeople: Person[] = [
  {
    id: 'P001',
    name: 'John Smith',
    shift: 'Shift A',
    shiftDuration: 480, // 8 hours
    presentTime: 450,
    availabilityPercent: 93.75,
    sessionsCount: 3,
    status: 'Good',
    firstSeen: '08:05',
    lastSeen: '16:02',
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    shift: 'Shift A',
    shiftDuration: 480,
    presentTime: 310,
    availabilityPercent: 64.58,
    sessionsCount: 5,
    status: 'Warning',
    firstSeen: '08:15',
    lastSeen: '15:45',
  },
  {
    id: 'P003',
    name: 'Michael Chen',
    shift: 'Shift B',
    shiftDuration: 480,
    presentTime: 200,
    availabilityPercent: 41.67,
    sessionsCount: 7,
    status: 'Low',
    firstSeen: '16:10',
    lastSeen: '23:30',
  },
  {
    id: 'P004',
    name: 'Emily Davis',
    shift: 'Shift A',
    shiftDuration: 480,
    presentTime: 465,
    availabilityPercent: 96.88,
    sessionsCount: 2,
    status: 'Good',
    firstSeen: '08:02',
    lastSeen: '16:10',
  },
  {
    id: 'P005',
    name: 'Robert Wilson',
    shift: 'Shift B',
    shiftDuration: 480,
    presentTime: 420,
    availabilityPercent: 87.5,
    sessionsCount: 4,
    status: 'Good',
    firstSeen: '16:05',
    lastSeen: '23:55',
  },
  {
    id: 'P006',
    name: 'Lisa Anderson',
    shift: 'Shift C',
    shiftDuration: 480,
    presentTime: 280,
    availabilityPercent: 58.33,
    sessionsCount: 6,
    status: 'Warning',
    firstSeen: '00:10',
    lastSeen: '07:40',
  },
  {
    id: 'P007',
    name: 'David Martinez',
    shift: 'Shift A',
    shiftDuration: 480,
    presentTime: 455,
    availabilityPercent: 94.79,
    sessionsCount: 3,
    status: 'Good',
    firstSeen: '08:00',
    lastSeen: '16:05',
  },
  {
    id: 'P008',
    name: 'Jennifer Taylor',
    shift: 'Shift B',
    shiftDuration: 480,
    presentTime: 180,
    availabilityPercent: 37.5,
    sessionsCount: 8,
    status: 'Low',
    firstSeen: '16:20',
    lastSeen: '23:20',
  },
];

// Generate detailed person data
export const getPersonDetail = (personId: string): PersonDetail | null => {
  const person = mockPeople.find((p) => p.id === personId);
  if (!person) return null;

  // Generate sessions based on status
  const sessions: Session[] = [];
  if (person.id === 'P001') {
    sessions.push(
      { id: 1, startTime: '08:05', endTime: '10:15', duration: 130, startCamera: 'CAM-A01', endCamera: 'CAM-A01' },
      { id: 2, startTime: '10:45', endTime: '14:30', duration: 225, startCamera: 'CAM-A02', endCamera: 'CAM-A03' },
      { id: 3, startTime: '14:50', endTime: '16:02', duration: 72, startCamera: 'CAM-A03', endCamera: 'CAM-A01' }
    );
  } else {
    // Generate sample sessions for others
    for (let i = 0; i < person.sessionsCount; i++) {
      sessions.push({
        id: i + 1,
        startTime: `${8 + i}:${(i * 10) % 60}`,
        endTime: `${8 + i + 1}:${(i * 15) % 60}`,
        duration: 60 + Math.floor(Math.random() * 60),
        startCamera: `CAM-${String.fromCharCode(65 + (i % 3))}0${(i % 3) + 1}`,
        endCamera: `CAM-${String.fromCharCode(65 + ((i + 1) % 3))}0${((i + 1) % 3) + 1}`,
      });
    }
  }

  // Generate 24-hour timeline (in 5-minute slots = 288 slots)
  const timeline: TimelineSlot[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const time = formatTime(hour, minute);
      let state: 'Present' | 'Absent' | 'Unknown' = 'Unknown';
      
      // Simplified logic: mark as present during shift with some gaps
      if (person.shift === 'Shift A' && hour >= 8 && hour < 16) {
        state = Math.random() > 0.15 ? 'Present' : 'Absent';
      } else if (person.shift === 'Shift B' && hour >= 16) {
        state = Math.random() > 0.15 ? 'Present' : 'Absent';
      } else if (person.shift === 'Shift C' && hour < 8) {
        state = Math.random() > 0.15 ? 'Present' : 'Absent';
      } else {
        state = 'Unknown';
      }
      
      timeline.push({ time, state });
    }
  }

  // Generate zone presence
  const zonePresence: ZonePresence[] = [
    { zone: 'Production Floor', duration: Math.floor(person.presentTime * 0.6) },
    { zone: 'Assembly Line 1', duration: Math.floor(person.presentTime * 0.25) },
    { zone: 'Quality Control', duration: Math.floor(person.presentTime * 0.15) },
  ];

  return {
    ...person,
    sessions,
    timeline,
    zonePresence,
  };
};



//Raj

export interface Incident {
  id: string;
  plant: string;
  unit: string;
  station: string;
  camera: string;
  violationType: string;
  missingPPE: Array<{ name: string; missing: boolean }>;
  severity: 'Low' | 'Medium' | 'High';
  aiConfidence: number;
  status: 'Open' | 'Closed';
  timestamp: string;
  shift: 'Morning' | 'Evening' | 'Night';
  imageUrl?: string;
  notes?: string;
}

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    plant: 'Tolaspon',
    unit: 'Unit-1',
    station: 'Coating',
    camera: 'CAM-C1-01',
    violationType: 'PPE Violation',
    missingPPE: [
      { name: 'Helmet', missing: true },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: false },
    ],
    severity: 'High',
    aiConfidence: 94.5,
    status: 'Open',
    timestamp: '2026-02-14 14:23:15',
    shift: 'Evening',
  },
  {
    id: 'INC-002',
    plant: 'Tolaspon',
    unit: 'Unit-4',
    station: 'Extruder',
    camera: 'CAM-E4-03',
    violationType: 'PPE Violation',
    missingPPE: [
      { name: 'Helmet', missing: false },
      { name: 'Gloves', missing: true },
      { name: 'Jacket', missing: true },
      { name: 'Boot', missing: false },
    ],
    severity: 'Medium',
    aiConfidence: 87.2,
    status: 'Open',
    timestamp: '2026-02-14 13:45:32',
    shift: 'Evening',
  },
  {
    id: 'INC-003',
    plant: 'Tolaspon',
    unit: 'Unit-2',
    station: 'Assembly',
    camera: 'CAM-A2-05',
    violationType: 'Unsafe Action',
    missingPPE: [
      { name: 'Helmet', missing: false },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: false },
    ],
    severity: 'Low',
    aiConfidence: 78.9,
    status: 'Closed',
    timestamp: '2026-02-14 12:10:45',
    shift: 'Morning',
  },
  {
    id: 'INC-004',
    plant: 'Greenfield',
    unit: 'Unit-3',
    station: 'Welding',
    camera: 'CAM-W3-02',
    violationType: 'PPE Violation',
    missingPPE: [
      { name: 'Helmet', missing: true },
      { name: 'Gloves', missing: true },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: false },
    ],
    severity: 'High',
    aiConfidence: 92.1,
    status: 'Open',
    timestamp: '2026-02-14 11:30:20',
    shift: 'Morning',
  },
  {
    id: 'INC-005',
    plant: 'Greenfield',
    unit: 'Unit-1',
    station: 'Packaging',
    camera: 'CAM-P1-01',
    violationType: 'Fall Risk',
    missingPPE: [
      { name: 'Helmet', missing: false },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: true },
    ],
    severity: 'Medium',
    aiConfidence: 81.4,
    status: 'Closed',
    timestamp: '2026-02-14 10:15:10',
    shift: 'Morning',
  },
  {
    id: 'INC-006',
    plant: 'Tolaspon',
    unit: 'Unit-4',
    station: 'Coating',
    camera: 'CAM-C4-02',
    violationType: 'PPE Violation',
    missingPPE: [
      { name: 'Helmet', missing: false },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: true },
      { name: 'Boot', missing: false },
    ],
    severity: 'Low',
    aiConfidence: 75.8,
    status: 'Open',
    timestamp: '2026-02-14 09:45:33',
    shift: 'Morning',
  },
  {
    id: 'INC-007',
    plant: 'Greenfield',
    unit: 'Unit-2',
    station: 'Inspection',
    camera: 'CAM-I2-04',
    violationType: 'Unsafe Action',
    missingPPE: [
      { name: 'Helmet', missing: false },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: false },
    ],
    severity: 'Medium',
    aiConfidence: 85.6,
    status: 'Closed',
    timestamp: '2026-02-14 08:20:14',
    shift: 'Morning',
  },
  {
    id: 'INC-008',
    plant: 'Tolaspon',
    unit: 'Unit-1',
    station: 'Extruder',
    camera: 'CAM-E1-01',
    violationType: 'PPE Violation',
    missingPPE: [
      { name: 'Helmet', missing: true },
      { name: 'Gloves', missing: false },
      { name: 'Jacket', missing: false },
      { name: 'Boot', missing: true },
    ],
    severity: 'High',
    aiConfidence: 96.3,
    status: 'Open',
    timestamp: '2026-02-14 06:55:42',
    shift: 'Night',
  },
];

export interface Camera {
  id: string;
  location: string;
  status: 'Online' | 'Offline';
  uptime: number;
  detectionsToday: number;
}

export const mockCameras: Camera[] = [
  { id: 'CAM-C1-01', location: 'Tolaspon - Unit-1 - Coating', status: 'Online', uptime: 99.8, detectionsToday: 145 },
  { id: 'CAM-E4-03', location: 'Tolaspon - Unit-4 - Extruder', status: 'Online', uptime: 98.5, detectionsToday: 132 },
  { id: 'CAM-A2-05', location: 'Tolaspon - Unit-2 - Assembly', status: 'Offline', uptime: 87.2, detectionsToday: 0 },
  { id: 'CAM-W3-02', location: 'Greenfield - Unit-3 - Welding', status: 'Online', uptime: 99.2, detectionsToday: 178 },
  { id: 'CAM-P1-01', location: 'Greenfield - Unit-1 - Packaging', status: 'Online', uptime: 96.8, detectionsToday: 89 },
  { id: 'CAM-C4-02', location: 'Tolaspon - Unit-4 - Coating', status: 'Online', uptime: 99.5, detectionsToday: 156 },
  { id: 'CAM-I2-04', location: 'Greenfield - Unit-2 - Inspection', status: 'Online', uptime: 97.1, detectionsToday: 102 },
  { id: 'CAM-E1-01', location: 'Tolaspon - Unit-1 - Extruder', status: 'Online', uptime: 99.9, detectionsToday: 164 },
];

export const analyticsData = {
  monthlyTrend: [
    { month: 'Aug', events: 45 },
    { month: 'Sep', events: 52 },
    { month: 'Oct', events: 38 },
    { month: 'Nov', events: 48 },
    { month: 'Dec', events: 41 },
    { month: 'Jan', events: 35 },
    { month: 'Feb', events: 28 },
  ],
  complianceTrend: [
    { month: 'Aug', compliance: 87 },
    { month: 'Sep', compliance: 84 },
    { month: 'Oct', compliance: 89 },
    { month: 'Nov', compliance: 91 },
    { month: 'Dec', compliance: 93 },
    { month: 'Jan', compliance: 94 },
    { month: 'Feb', compliance: 96 },
  ],
  departmentViolations: [
    { department: 'Coating', violations: 45 },
    { department: 'Extruder', violations: 38 },
    { department: 'Welding', violations: 32 },
    { department: 'Assembly', violations: 28 },
    { department: 'Packaging', violations: 22 },
    { department: 'Inspection', violations: 18 },
  ],
  shiftData: [
    { shift: 'Morning', incidents: 42 },
    { shift: 'Evening', incidents: 38 },
    { shift: 'Night', incidents: 23 },
  ],
  violationTypes: [
    { name: 'PPE Violation', value: 65 },
    { name: 'Unsafe Action', value: 20 },
    { name: 'Fall Risk', value: 15 },
  ],
};

export interface Worker {
  id: string;
  name: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night';
  entryTime: string;
  exitTime: string | null;
  status: 'Present' | 'Absent' | 'Late';
  date: string;
}

export const mockWorkers: Worker[] = [
  {
    id: 'W001',
    name: 'Rajesh Kumar',
    department: 'Coating',
    shift: 'Morning',
    entryTime: '06:45',
    exitTime: null,
    status: 'Present',
    date: '2026-02-14',
  },
  {
    id: 'W002',
    name: 'Priya Sharma',
    department: 'Extruder',
    shift: 'Morning',
    entryTime: '07:15',
    exitTime: null,
    status: 'Late',
    date: '2026-02-14',
  },
  {
    id: 'W003',
    name: 'Amit Patel',
    department: 'Welding',
    shift: 'Morning',
    entryTime: '06:30',
    exitTime: null,
    status: 'Present',
    date: '2026-02-14',
  },
  {
    id: 'W004',
    name: 'Sunita Verma',
    department: 'Assembly',
    shift: 'Morning',
    entryTime: '06:55',
    exitTime: null,
    status: 'Present',
    date: '2026-02-14',
  },
  {
    id: 'W005',
    name: 'Vikram Singh',
    department: 'Packaging',
    shift: 'Morning',
    entryTime: '-',
    exitTime: null,
    status: 'Absent',
    date: '2026-02-14',
  },
  {
    id: 'W006',
    name: 'Anjali Desai',
    department: 'Coating',
    shift: 'Evening',
    entryTime: '14:30',
    exitTime: null,
    status: 'Present',
    date: '2026-02-14',
  },
  {
    id: 'W007',
    name: 'Rahul Mehta',
    department: 'Inspection',
    shift: 'Evening',
    entryTime: '14:45',
    exitTime: null,
    status: 'Present',
    date: '2026-02-14',
  },
  {
    id: 'W008',
    name: 'Deepa Joshi',
    department: 'Extruder',
    shift: 'Night',
    entryTime: '-',
    exitTime: null,
    status: 'Absent',
    date: '2026-02-14',
  },
];

export interface TemperatureSensor {
  id: string;
  location: string;
  department: string;
  temperature: number;
  humidity: number;
  gasLevel: number;
  status: 'Normal' | 'Warning' | 'Critical';
  timestamp: string;
}

export const mockTemperatureSensors: TemperatureSensor[] = [
  {
    id: 'TEMP-001',
    location: 'Coating Station A',
    department: 'Coating',
    temperature: 85,
    humidity: 45,
    gasLevel: 12,
    status: 'Critical',
    timestamp: '2026-02-14 14:23:00',
  },
  {
    id: 'TEMP-002',
    location: 'Extruder Unit-1',
    department: 'Extruder',
    temperature: 72,
    humidity: 38,
    gasLevel: 8,
    status: 'Warning',
    timestamp: '2026-02-14 14:22:45',
  },
  {
    id: 'TEMP-003',
    location: 'Welding Bay',
    department: 'Welding',
    temperature: 65,
    humidity: 42,
    gasLevel: 15,
    status: 'Normal',
    timestamp: '2026-02-14 14:22:30',
  },
  {
    id: 'TEMP-004',
    location: 'Assembly Line 2',
    department: 'Assembly',
    temperature: 58,
    humidity: 50,
    gasLevel: 5,
    status: 'Normal',
    timestamp: '2026-02-14 14:22:15',
  },
  {
    id: 'TEMP-005',
    location: 'Packaging Area',
    department: 'Packaging',
    temperature: 55,
    humidity: 48,
    gasLevel: 6,
    status: 'Normal',
    timestamp: '2026-02-14 14:22:00',
  },
  {
    id: 'TEMP-006',
    location: 'Extruder Unit-4',
    department: 'Extruder',
    temperature: 78,
    humidity: 35,
    gasLevel: 10,
    status: 'Warning',
    timestamp: '2026-02-14 14:21:45',
  },
  {
    id: 'TEMP-007',
    location: 'Inspection Zone',
    department: 'Inspection',
    temperature: 52,
    humidity: 52,
    gasLevel: 4,
    status: 'Normal',
    timestamp: '2026-02-14 14:21:30',
  },
];

export const attendanceAnalytics = {
  weeklyTrend: [
    { day: 'Mon', present: 145, absent: 8, late: 5 },
    { day: 'Tue', present: 148, absent: 5, late: 7 },
    { day: 'Wed', present: 142, absent: 10, late: 6 },
    { day: 'Thu', present: 150, absent: 4, late: 4 },
    { day: 'Fri', present: 147, absent: 6, late: 5 },
    { day: 'Sat', present: 138, absent: 12, late: 8 },
  ],
  shiftAttendance: [
    { shift: 'Morning', count: 62 },
    { shift: 'Evening', count: 48 },
    { shift: 'Night', count: 35 },
  ],
  departmentAttendance: [
    { department: 'Coating', attendance: 95 },
    { department: 'Extruder', attendance: 92 },
    { department: 'Welding', attendance: 96 },
    { department: 'Assembly', attendance: 94 },
    { department: 'Packaging', attendance: 89 },
    { department: 'Inspection', attendance: 97 },
  ],
};

export const temperatureAnalytics = {
  hourlyTrend: [
    { time: '06:00', temp: 52 },
    { time: '08:00', temp: 58 },
    { time: '10:00', temp: 65 },
    { time: '12:00', temp: 72 },
    { time: '14:00', temp: 75 },
    { time: '16:00', temp: 70 },
  ],
  heatZones: [
    { zone: 'Coating Station A', temp: 85, alerts: 5 },
    { zone: 'Extruder Unit-4', temp: 78, alerts: 3 },
    { zone: 'Extruder Unit-1', temp: 72, alerts: 2 },
    { zone: 'Welding Bay', temp: 65, alerts: 0 },
  ],
};

// PPE Feature Configuration
export interface PPEFeature {
  name: string;
  enabled: boolean;
}

export const ppeFeatures: PPEFeature[] = [
  { name: 'Helmet', enabled: true },
  { name: 'Gloves', enabled: true },
  { name: 'Shoes', enabled: true },
  { name: 'Running', enabled: true },
  { name: 'Gathering', enabled: false },
];

// PPE Event Data
export interface PPEEvent {
  id: string;
  plantName: string;
  sectionName: string;
  eventCategory: string;
  featureDetected: string;
  confidenceScore: number;
  eventTime: string;
  imageUrl: string;
  severity: 'Low' | 'Medium' | 'High';
}

export const ppeEvents: PPEEvent[] = [
  {
    id: 'PPE-001',
    plantName: 'Tolaspon',
    sectionName: 'Coating Station A',
    eventCategory: 'Helmet Missing',
    featureDetected: 'Helmet',
    confidenceScore: 94.5,
    eventTime: '2026-02-14 14:23:15',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop',
    severity: 'High',
  },
  {
    id: 'PPE-002',
    plantName: 'Tolaspon',
    sectionName: 'Extruder Unit-4',
    eventCategory: 'Gloves Missing',
    featureDetected: 'Gloves',
    confidenceScore: 87.2,
    eventTime: '2026-02-14 13:45:32',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop',
    severity: 'Medium',
  },
  {
    id: 'PPE-003',
    plantName: 'Greenfield',
    sectionName: 'Welding Bay',
    eventCategory: 'Running Detected',
    featureDetected: 'Running',
    confidenceScore: 92.1,
    eventTime: '2026-02-14 13:30:20',
    imageUrl: 'https://images.unsplash.com/photo-1581092918484-8313e1f85a34?w=100&h=100&fit=crop',
    severity: 'High',
  },
  {
    id: 'PPE-004',
    plantName: 'Tolaspon',
    sectionName: 'Assembly Line 2',
    eventCategory: 'Shoes Missing',
    featureDetected: 'Shoes',
    confidenceScore: 81.4,
    eventTime: '2026-02-14 12:15:10',
    imageUrl: 'https://images.unsplash.com/photo-1578663899664-27b62cd65da3?w=100&h=100&fit=crop',
    severity: 'Medium',
  },
  {
    id: 'PPE-005',
    plantName: 'Greenfield',
    sectionName: 'Packaging Area',
    eventCategory: 'Helmet Missing',
    featureDetected: 'Helmet',
    confidenceScore: 96.3,
    eventTime: '2026-02-14 11:55:42',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop',
    severity: 'High',
  },
  {
    id: 'PPE-006',
    plantName: 'Tolaspon',
    sectionName: 'Coating Station B',
    eventCategory: 'Gloves Missing',
    featureDetected: 'Gloves',
    confidenceScore: 75.8,
    eventTime: '2026-02-14 11:45:33',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop',
    severity: 'Low',
  },
  {
    id: 'PPE-007',
    plantName: 'Greenfield',
    sectionName: 'Inspection Zone',
    eventCategory: 'Running Detected',
    featureDetected: 'Running',
    confidenceScore: 85.6,
    eventTime: '2026-02-14 10:20:14',
    imageUrl: 'https://images.unsplash.com/photo-1581092918484-8313e1f85a34?w=100&h=100&fit=crop',
    severity: 'Medium',
  },
  {
    id: 'PPE-008',
    plantName: 'Tolaspon',
    sectionName: 'Extruder Unit-1',
    eventCategory: 'Shoes Missing',
    featureDetected: 'Shoes',
    confidenceScore: 88.9,
    eventTime: '2026-02-14 09:55:28',
    imageUrl: 'https://images.unsplash.com/photo-1578663899664-27b62cd65da3?w=100&h=100&fit=crop',
    severity: 'Medium',
  },
  {
    id: 'PPE-009',
    plantName: 'Greenfield',
    sectionName: 'Welding Bay',
    eventCategory: 'Helmet Missing',
    featureDetected: 'Helmet',
    confidenceScore: 93.7,
    eventTime: '2026-02-14 09:10:45',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop',
    severity: 'High',
  },
  {
    id: 'PPE-010',
    plantName: 'Tolaspon',
    sectionName: 'Coating Station A',
    eventCategory: 'Gloves Missing',
    featureDetected: 'Gloves',
    confidenceScore: 79.3,
    eventTime: '2026-02-14 08:35:18',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop',
    severity: 'Low',
  },
];

// PPE Analytics
export const ppeAnalytics = {
  featureViolations: [
    { feature: 'Helmet', count: 4 },
    { feature: 'Gloves', count: 3 },
    { feature: 'Shoes', count: 2 },
    { feature: 'Running', count: 2 },
    { feature: 'Gathering', count: 0 },
  ],
  sectionViolations: [
    { section: 'Coating Station A', count: 3 },
    { section: 'Welding Bay', count: 2 },
    { section: 'Extruder Unit-4', count: 2 },
    { section: 'Assembly Line 2', count: 1 },
    { section: 'Packaging Area', count: 1 },
    { section: 'Inspection Zone', count: 1 },
  ],
};