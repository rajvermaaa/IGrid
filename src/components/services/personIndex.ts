const KEY = "igrid_person_index";

export function savePersonId(id: string) {
  const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
  if (!existing.includes(id)) {
    existing.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 50)));
  }
}

export function getPersonSuggestions(prefix: string): string[] {
  if (!prefix) return [];
  const all = JSON.parse(localStorage.getItem(KEY) || "[]");
  return all.filter((p: string) =>
    p.toLowerCase().startsWith(prefix.toLowerCase())
  );
}
