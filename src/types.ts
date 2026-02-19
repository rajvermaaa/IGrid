// Data types for IGRID dashboard

export interface Person {
  id: string;
  name: string;
  shift: string;
  shiftDuration: number; // in minutes
  presentTime: number; // in minutes
  availabilityPercent: number;
  sessionsCount: number;
  status: 'Good' | 'Warning' | 'Low';
  firstSeen?: string;
  lastSeen?: string;
}

export interface Session {
  id: number;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  startCamera: string;
  endCamera: string;
}

export interface TimelineSlot {
  time: string;
  state: 'Present' | 'Absent' | 'Unknown';
}

export interface ZonePresence {
  zone: string;
  duration: number; // in minutes
}

export interface PersonDetail extends Person {
  sessions: Session[];
  timeline: TimelineSlot[];
  zonePresence: ZonePresence[];
}

export type ShiftType = 'Shift A' | 'Shift B' | 'Shift C' | 'Full Day';
