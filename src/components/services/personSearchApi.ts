// export async function searchPersonsRemote(q: string): Promise<string[]> {
//   if (!q || q.length < 2) return [];

//   const res = await fetch(
//     `https://camconnect.drools.com/igridapi/v1/persons?q=${encodeURIComponent(q)}&limit=20`,
//     { cache: "no-store" }
//   );

//   const data = await res.json();

//   if (!Array.isArray(data)) return [];

//   return data.map((p: any) => p.person_id || p.people_name || p.id).filter(Boolean);
// }
export async function searchPersonsRemote(q: string): Promise<string[]> {
  if (!q || q.length < 2) return [];

  const res = await fetch(
    `https://camconnect.drools.com/igridapi/v1/persons?q=${encodeURIComponent(q)}&limit=20`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data || !Array.isArray(data.persons)) return [];

  return data.persons;
}
