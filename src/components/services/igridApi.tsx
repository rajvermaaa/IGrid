import type { FaceMatchResult } from "../types/igrid";

const BASE = "https://camconnect.drools.com/igridapi/v1";

export const getHealth = async () =>
  fetch(`${BASE}/health`).then(r => r.json());

export const getPersonLastSeen = async (personId: string) =>
  fetch(`${BASE}/person/${personId}/last-seen`).then(r => r.json());

// export const getPersonDayTrace = async (personId: string, date: string, to: string) =>
//   fetch(`${BASE}/person/${personId}/day/${date}`).then(r => r.json());




export const SNAPSHOT_BASE = "https://camconnect.drools.com/";


export async function getPersonRangeTrace(id: string, from: string, to: string) {
  const res = await fetch(
    `https://camconnect.drools.com/igridapi/v1/person/${id}/range?from=${from}&to=${to}`,
    { cache: "no-store" }
  );
  return await res.json();
}
export const getPersonDayTrace = async (personId: string, date: string) =>
  fetch(`${BASE}/person/${personId}/day/${date}`).then(r => r.json());


export async function searchFaceMatch(
  imageFile: File
): Promise<FaceMatchResult[]> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${"API_BASE"}/face/search`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.matches || [];
  } catch {
    return [];
  }
}

export async function searchPersons(query: string, limit = 20) {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `https://camconnect.drools.com/igridapi/v1/persons?q=${encodeURIComponent(query)}&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return await res.json();
}
