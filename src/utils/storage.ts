// src/utils/storage.ts

export type Organisation = { id: string; name: string };
export type Plant = { id: string; name: string; organisationId: string };
export type Station = { id: string; name: string; plantId: string };
export type Camera = { id: string; name: string; url: string; stationId: string };
export type User = { id: string; name: string; role: string; organisationId: string };
export type Shift = { id: string; name: string; type: string; stationId: string; userId: string };

export function getItem<T>(key: string): T[] {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : [];
}
