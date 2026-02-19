// // src/pages/ShiftsPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import dayjs from "dayjs";
// import { callFunction, callProcedure } from "../../api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Shift {
//   id: string;
//   type: ShiftName;
//   dayStart: string;
//   startTime: string;
//   dayEnd: string;
//   endTime: string;
//   orgId?: string;
//   orgName?: string;
// }

// interface Plant {
//   id: number | string;
//   name: string;
// }
// interface Station {
//   id: number | string;
//   name: string;
//   plantId: number | string;

//   }

//   interface StationRow {
//   sname?: string;
//   id?: string;
//   name?: string;
// }

// // Extended employee to keep username / u_code if available
// interface Employee {
//   id: string;
//   name: string;
//   plantId: number | string;
//   username?: string;
//   u_code?: string;
// }

// interface Org {
//   id: string;
//   name: string;
//   code?: string;
// }

// interface MappedShift {
//   id: string;
//   date: string;
//   day: string;
//   shiftType: ShiftName;
//   employeeId: string;
//   employeeName: string;
//   plantId: string;
//   plantName: string;
//   stationId: string;
//   stationName: string;
//   orgId?: string; // <-- added
//   orgName?: string;
//   unitName?: string;
//   dbRid?: number | string;
// }

// type ShiftName = "A" | "B" | "C";

// type Row = {
//   date: string;
//   day: string;
//   shifts: Record<ShiftName, string>;
// };

// const shiftOptions: ShiftName[] = ["A", "B", "C"];
// const dayOptions = ["Day 1", "Day 2"];

// // Local fallback data (unchanged)
// const plants: Plant[] = [
//   { id: "p1", name: "Alpha Plant" },
//   { id: "p2", name: "Beta Plant" },
// ];
// const stations: Station[] = [
//   { id: "s1", name: "Station A1", plantId: "p1" },
//   { id: "s2", name: "Station A2", plantId: "p1" },
//   { id: "s3", name: "Station B1", plantId: "p2" },
//   { id: "s4", name: "Station B2", plantId: "p2" },
// ];
// const employees: Employee[] = [
//   { id: "e1", name: "Alice", plantId: "p1" },
//   { id: "e2", name: "Bob", plantId: "p1" },
//   { id: "e3", name: "Charlie", plantId: "p1" },
//   { id: "e4", name: "David", plantId: "p2" },
//   { id: "e5", name: "Eve", plantId: "p2" },
//   { id: "e6", name: "Frank", plantId: "p2" },
// ];

// const getItem = <T,>(key: string): T[] => {
//   const val = localStorage.getItem(key);
//   try {
//     return val ? (JSON.parse(val) as T[]) : [];
//   } catch {
//     return [];
//   }
// };
// const setItem = <T,>(key: string, data: T[]) => {
//   localStorage.setItem(key, JSON.stringify(data));
// };

// const todayISO = dayjs().format("YYYY-MM-DD");

// type ConfirmMode = "delete" | "update" | null;
// interface ConfirmState {
//   visible: boolean;
//   mode: ConfirmMode;
//   message?: string;
//   payload?: any;
// }

// const ShiftsPage: React.FC = () => {
//   // persisted lists
//   const [mappedShifts, setMappedShifts] = useState<MappedShift[]>(
//     getItem<MappedShift>("mappedPlantShifts")
//   );
//   const [shifts, setShifts] = useState<Shift[]>(getItem<Shift>("shifts"));
//   // trigger to re-fetch planned shifts from server after insert/delete
//   const [plannedRefresh, setPlannedRefresh] = useState<number>(0);
//   const [, setLoadingPlanned] = useState<boolean>(false);
//   const [editRid, setEditRid] = useState<number | null>(null);

//   // modals
//   const [showAddShiftModal, setShowAddShiftModal] = useState(false);
//   const [showMapModal, setShowMapModal] = useState(false);

//   // Add-shift form state
//   const [formShifts, setFormShifts] = useState<Shift[]>([]);
//   const [addOrgId, setAddOrgId] = useState<string>("");
//   const [orgsForAdd, setOrgsForAdd] = useState<Org[]>([]);
//   const [loadingOrgsForAdd, setLoadingOrgsForAdd] = useState(false);

//   // Plan-shift top-level org (selected in Plan modal or set from Add modal when opening)
//   const [orgId, setOrgId] = useState<string>(""); // used by Plan modal
//   const [orgs, setOrgs] = useState<Org[]>([]);

//   // Separate plant lists so Add and Plan do not overwrite each other
//   const [plantOptionsPlan, setPlantOptionsPlan] = useState<Plant[]>([]);
//   const [plantOptionsAdd, setPlantOptionsAdd] = useState<Plant[]>([]);

//   const [unitOptions, setUnitOptions] = useState<string[]>([]);
//   const [unitName, setUnitName] = useState<string>(""); // selected unit in modal


//   // selected plant/station for plan modal (strings)
//   const [plantId, setPlantId] = useState<string>("");
//   const [stationId, setStationId] = useState<string>("");
//   const [plDate, setPlDate] = useState<string>(todayISO);

//   // Add-shift selected plant (UI only) — ensures Add modal shows plants for the addOrgId
//   const [addPlantId, setAddPlantId] = useState<string>("");

//   // station options for plan (populated by backend call when plantId changes)
//   const [stationOptions, setStationOptions] = useState<Station[]>([]);

//   // employees for selected plant (plan modal)
//   const [employeesForPlant, setEmployeesForPlant] = useState<Employee[]>([]);
//   const [loadingEmployeesForPlant, setLoadingEmployeesForPlant] =
//     useState(false);

//   // loading flags
//   const [loadingPlantOptionsPlan, setLoadingPlantOptionsPlan] = useState(false);
//   const [loadingPlantOptionsAdd, setLoadingPlantOptionsAdd] = useState(false);
//   const [loadingStationOptions, setLoadingStationOptions] = useState(false);

//   // rows and edit state for map UI (unchanged)
//   const [, setRows] = useState<Row[]>([]);
//   const [editShiftGroup, setEditShiftGroup] = useState<MappedShift[] | null>(
//     null
//   );

//   // State for shift options in Plan modal
// const [planShiftOptions, setPlanShiftOptions] = useState<string[]>([]);
// const [loadingPlanShiftOptions, setLoadingPlanShiftOptions] = useState(false);


//   // confirm modal
//   const [confirmState, setConfirmState] = useState<ConfirmState>({
//     visible: false,
//     mode: null,
//     message: "",
//     payload: null,
//   });

//   // Normalize backend shapes
//   const normalizeRows = (res: any) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (res.rows) return res.rows;
//     if (res.data) return res.data;
//     if (res.result) return res.result;
//     return [];
//   };

//   // Filtered helpers
//   const filteredStations = useMemo(
//     () =>
//       (stationOptions.length ? stationOptions : stations).filter(
//         (s) => String(s.plantId) === String(plantId)
//       ),
//     [plantId, stationOptions, stations]
//   );

//   const filteredEmployees = useMemo(() => {
//     const pool = employeesForPlant.length ? employeesForPlant : employees;
//     return pool.filter((e) => String(e.plantId) === String(plantId));
//   }, [plantId, employeesForPlant]);

//   // persist drafts
//   useEffect(() => setItem("shifts", shifts), [shifts]);
//   useEffect(() => setItem("mappedPlantShifts", mappedShifts), [mappedShifts]);

//   // Manage rows for mapping UI (unchanged)
//   useEffect(() => {
//     if (!plantId || !stationId || !plDate) {
//       setRows([]);
//       return;
//     }
//     const start = dayjs(plDate);
//     const end = dayjs(plDate);
//     const days = end.diff(start, "day");
//     const temp: Row[] = [];
//     for (let i = 0; i <= days; i++) {
//       const d = start.add(i, "day");
//       const formattedDate = d.format("DD-MM-YYYY");
//       const dayName = d.format("dddd");
//       const defaultShifts: Record<ShiftName, string> = { A: "", B: "", C: "" };
//       if (editShiftGroup) {
//         const dayShifts: Record<ShiftName, string> = { ...defaultShifts };
//         shiftOptions.forEach((shift) => {
//           const match = editShiftGroup.find(
//             (m) => m.date === formattedDate && m.shiftType === shift
//           );
//           if (match) dayShifts[shift] = match.employeeId;
//         });
//         temp.push({ date: formattedDate, day: dayName, shifts: dayShifts });
//       } else {
//         temp.push({ date: formattedDate, day: dayName, shifts: defaultShifts });
//       }
//     }
//     setRows(temp);
//   }, [plantId, stationId, plDate, editShiftGroup]);

//   // Load Add Shift orgs when Add modal opens
//   useEffect(() => {
//     if (!showAddShiftModal) return;
//     (async () => {
//       try {
//         setLoadingOrgsForAdd(true);
//         const raw: any = await callFunction("public.list_organisations", []);
//         const rows = Array.isArray(raw)
//           ? raw
//           : raw?.rows ?? raw?.data ?? raw?.result ?? [];
//         const mapped = (rows || [])
//           .map((row: any) => {
//             const rid = row.rid ?? row.id ?? null;
//             const code = row.org_code ?? row.code ?? "";
//             const name = row.org_name ?? row.name ?? "";
//             return {
//               id: String(rid ?? code ?? ""),
//               code: String(code ?? ""),
//               name: String(name ?? ""),
//             };
//           })
//           .filter((o: any) => o.id && o.name);
//         setOrgsForAdd(mapped);
//         if (!addOrgId && mapped.length) setAddOrgId(mapped[0].id);
//       } catch (err) {
//         console.error(
//           "Failed to fetch organisations for Add Shift modal:",
//           err
//         );
//         setOrgsForAdd([]);
//         toast.error("Failed to fetch organisations for Add Shift modal.");
//       } finally {
//         setLoadingOrgsForAdd(false);
//       }
//     })();
//   }, [showAddShiftModal]);

//   // Load orgs once for Plan modal (so Plan modal can show org selector)
//   useEffect(() => {
//     (async () => {
//       try {
//         const res: any = await callFunction("public.list_organisations", []);
//         const rows = Array.isArray(res) ? res : res?.rows ?? [];
//         const mapped = (rows || []).map((r: any) => ({
//   id: String(r.rid ?? r.org_code ?? ""),      // <-- use rid or org_code
//   code: String(r.org_code ?? ""),
//   name: String(r.org_name ?? r.name ?? ""),
// }));

//         setOrgs(mapped);
//       } catch (err) {
//         console.error("Failed to load organisations on mount:", err);
//       }
//     })();
//   }, []);

//   // Load plants for Plan modal org selection (plantOptionsPlan)
//   useEffect(() => {
//     setPlantOptionsPlan([]);
//     setStationOptions([]);
//     setPlantId("");
//     setStationId("");
//     if (!orgId) {
//       return;
//     }
//     let cancelled = false;
//     (async () => {
//       setLoadingPlantOptionsPlan(true);
//       try {
//         const arg = Number.isFinite(Number(orgId)) ? Number(orgId) : orgId;
//         console.debug("[Plan] loading plants for org:", orgId, "arg:", arg);
//         const res: any = await callFunction("public.fn_list_plants_by_org", [
//           arg,
//         ]);
//         const rows = normalizeRows(res);
//         const mapped = (rows || [])
//           .map((r: any) => {
//             const pid = r.pid ?? r.p_id ?? r.id ?? "";
//             const pcode = r.p_code ?? r.plant_code ?? "";
//             const name = r.p_name ?? r.pname ?? r.plant_name ?? r.name ?? "";
//             const id = pcode
//               ? String(pcode)
//               : pid !== undefined
//               ? String(pid)
//               : "";
//             return { id, name };
//           })
//           .filter((p: any) => p.id && p.name);
//         console.debug("[Plan] plants returned:", mapped);
//         if (!cancelled) setPlantOptionsPlan(mapped);
//       } catch (err: any) {
//         console.error("Failed to load plants for plan orgId", orgId, err);
//         if (!cancelled) setPlantOptionsPlan([]);
//         toast.error("Failed to load plants for selected organisation (Plan).");
//       } finally {
//         if (!cancelled) setLoadingPlantOptionsPlan(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [orgId]);

//   // Load plants for Add modal org selection (plantOptionsAdd)
//   useEffect(() => {
//     setPlantOptionsAdd([]);
//     setAddPlantId("");
//     if (!addOrgId) return;
//     let cancelled = false;
//     (async () => {
//       setLoadingPlantOptionsAdd(true);
//       try {
//         const arg = Number.isFinite(Number(addOrgId))
//           ? Number(addOrgId)
//           : addOrgId;
//         console.debug(
//           "[Add] loading plants for addOrgId:",
//           addOrgId,
//           "arg:",
//           arg
//         );
//         const res: any = await callFunction("public.fn_list_plants_by_org", [
//           arg,
//         ]);
//         const rows = normalizeRows(res);
//         const mapped = (rows || [])
//           .map((r: any) => {
//             const pid = r.pid ?? r.p_id ?? r.id ?? "";
//             const pcode = r.p_code ?? r.plant_code ?? "";
//             const name = r.p_name ?? r.pname ?? r.plant_name ?? r.name ?? "";
//             const id = pcode
//               ? String(pcode)
//               : pid !== undefined
//               ? String(pid)
//               : "";
//             return { id, name };
//           })
//           .filter((p: any) => p.id && p.name);
//         console.debug("[Add] plants returned:", mapped);
//         if (!cancelled) {
//           setPlantOptionsAdd(mapped);
//           if (!addPlantId && mapped.length) setAddPlantId(mapped[0].id);
//         }
//       } catch (err: any) {
//         console.error("Failed to load plants for addOrgId", addOrgId, err);
//         if (!cancelled) setPlantOptionsAdd([]);
//         toast.error("Failed to load plants for selected organisation (Add).");
//       } finally {
//         if (!cancelled) setLoadingPlantOptionsAdd(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [addOrgId]);

//   // Load stations for Plan modal when plantId changes
//   useEffect(() => {
//   setStationOptions([]);
//   setStationId("");
//   if (!orgId || !plantId || !unitName) return;
//   let cancelled = false;

//   // Resolve names from IDs
//   const orgObj = orgs.find(
//     (o) => String(o.id) === String(orgId) || String(o.code) === String(orgId)
//   );
//   const plantObj = plantOptionsPlan.find(
//     (p) => String(p.id) === String(plantId)
//   );
//   const orgName = orgObj ? orgObj.name : orgId;
//   const plantName = plantObj ? plantObj.name : plantId;

//   (async () => {
//     setLoadingStationOptions(true);
//     try {
//       // Call the correct function with all three names
//       const sRes = await callFunction(
//         "public.fn_list_stations_by_unit",
//         [orgName, plantName, unitName]
//       );
//       const rows = Array.isArray(sRes)
//         ? sRes
//         : sRes?.rows ?? sRes?.data ?? sRes?.result ?? [];
//       // Map the stations
//       const mapped = rows
//   .map((r: StationRow) => ({
//     id: r.sname ?? r.id ?? r.name ?? "",
//     name: r.sname ?? r.name ?? "",
//     plantId: plantId,
//   }))
//   .filter((s: { id: string; name: string }) => s.id && s.name);

//       if (!cancelled) setStationOptions(mapped);
//     } catch (err) {
//       if (!cancelled) setStationOptions([]);
//       console.error("Failed to load stations for selected unit:", err);
//       toast.error("Failed to load stations for selected unit.");
//     } finally {
//       if (!cancelled) setLoadingStationOptions(false);
//     }
//   })();
//   return () => {
//     cancelled = true;
//   };
// }, [orgId, plantId, unitName, orgs, plantOptionsPlan]);

//   // Load units for Plan modal when orgId or plantId changes
// useEffect(() => {
//   setUnitOptions([]);
//   setUnitName("");
//   if (!orgId || !plantId) return;
//   let cancelled = false;

//   // --- HERE: Get the display name to send to backend ---
//   const orgObj = orgs.find(
//     (o) =>
//       String(o.id) === String(orgId) || String(o.code) === String(orgId)
//   );
//   const plantObj = plantOptionsPlan.find(
//     (p) => String(p.id) === String(plantId)
//   );
//   const orgName = orgObj ? orgObj.name : orgId;
//   const plantName = plantObj ? plantObj.name : plantId;

//   (async () => {
//     try {
//       // NOW pass display name to backend
//       const res: any = await callFunction("public.fn_list_units_by_plant", [
//         orgName,
//         plantName,
//       ]);
//       const rows = Array.isArray(res)
//         ? res
//         : res?.rows ?? res?.data ?? res?.result ?? [];
//       const units = rows.map((r: any) => String(r.uname)).filter(Boolean);
//       if (!cancelled) setUnitOptions(units);
//       if (!cancelled && units.length) setUnitName(units[0]);
//     } catch (err) {
//       if (!cancelled) setUnitOptions([]);
//       console.error("Failed to load units:", err);
//       toast.error("Failed to load units for selected plant/organisation.");
//     }
//   })();
//   return () => {
//     cancelled = true;
//   };
// }, [orgId, plantId, orgs, plantOptionsPlan]);

// // Fetch shift options from backend for Plan modal (when orgId or plantId changes)
// // Fetch shift options from backend for Plan modal (when orgId/plantId/unit changes)
// useEffect(() => {
//   setPlanShiftOptions([]);
//   if (!orgId || !plantId) return;

//   let cancelled = false;

//   // Resolve org/plant human-readable names (what your DB SPs expect)
//   const orgObj = orgs.find(
//     (o) => String(o.id) === String(orgId) || String(o.code) === String(orgId)
//   );
//   const plantObj = plantOptionsPlan.find((p) => String(p.id) === String(plantId));
//   const orgName = orgObj ? orgObj.name : String(orgId);
//   const plantName = plantObj ? plantObj.name : String(plantId);

//   (async () => {
//     setLoadingPlanShiftOptions(true);
//     try {
//       // Try preferred function first (by plant)
//       const args1 = [orgName, plantName];
//       let res: any;

//       try {
//         res = await callFunction("public.fn_list_shift_by_plant", args1);
//       } catch (e) {
//         // Fallback to pluralized variant if your DB uses that
//         res = await callFunction("public.fn_list_shifts_by_plant", args1);
//       }

//       let rows = Array.isArray(res) ? res : res?.rows ?? res?.data ?? res?.result ?? [];

//       // If nothing and your schema is unit-aware, try unit function
//       if ((!rows || rows.length === 0) && unitName) {
//         try {
//           const args2 = [orgName, plantName, unitName];
//           res = await callFunction("public.fn_list_shift_by_unit", args2);
//           rows = Array.isArray(res) ? res : res?.rows ?? res?.data ?? res?.result ?? [];
//         } catch {
//           // ignore
//         }
//       }

//       // Robust column fallbacks for the shift label
//       // Map with robust column fallbacks (typed to avoid unknown[])
// const rawShiftNames: string[] = (rows || [])
//   .map((r: any) =>
//     String(
//       r.sf_name ??
//       r.shift_name ??
//       r.s_name ??
//       r.sfname ??
//       r.shift ??
//       r.type ??
//       r.name ??
//       ""
//     ).trim()
//   )
//   .filter(Boolean) as string[];

// const shiftNames: string[] = [...new Set<string>(rawShiftNames)];


//       if (!cancelled) {
//         // keep UI usable with a fallback
//         setPlanShiftOptions(shiftNames.length ? shiftNames : ["A", "B", "C"]);
//         if (!shiftNames.length) {
//           console.warn("[Plan] No shifts returned; using A/B/C fallback");
//           toast.info("No shifts returned for this plant; showing default A/B/C.");
//         }
//       }
//     } catch (err) {
//       if (!cancelled) setPlanShiftOptions(["A", "B", "C"]);
//       console.error("Failed to load shifts:", err);
//       toast.error("Failed to load shifts for selected plant/organisation.");
//     } finally {
//       if (!cancelled) setLoadingPlanShiftOptions(false);
//     }
//   })();

//   return () => {
//     cancelled = true;
//   };
// }, [orgId, plantId, unitName, orgs, plantOptionsPlan]);

//   // Fetch planned shifts from DB function and map to MappedShift
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setLoadingPlanned(true);
//       try {
//         const raw: any = await callFunction(
//           "public.fn_list_planned_shifts",
//           []
//         );
//         const rows = normalizeRows(raw);

//         const mapped: MappedShift[] = (rows || []).map(
//           (r: any, idx: number) => {
//             const orgCode = r.org_code ?? "";
//             const plantCode = r.plant_code ?? "";
//             const stationCode = r.station_code ?? "";
//             const shiftName = (String(r.shift ?? "") as ShiftName) || "A";
//             const userCodeOrName = String(r.user_code ?? "");

//             const orgObj = orgs.find(
//               (o) =>
//                 String(o.code) === String(orgCode) ||
//                 String(o.id) === String(orgCode)
//             );
//             const orgNameDisplay = orgObj ? orgObj.name : orgCode;

//             const plantObj =
//               plantOptionsPlan.find(
//                 (p) =>
//                   String(p.id) === String(plantCode) ||
//                   String(p.name) === String(plantCode)
//               ) ||
//               plantOptionsAdd.find(
//                 (p) =>
//                   String(p.id) === String(plantCode) ||
//                   String(p.name) === String(plantCode)
//               ) ||
//               plants.find(
//                 (p) =>
//                   String(p.id) === String(plantCode) ||
//                   String(p.name) === String(plantCode)
//               );
//             const plantNameDisplay = plantObj ? plantObj.name : plantCode;

//             const stationObj =
//               stationOptions.find(
//                 (s) =>
//                   String(s.id) === String(stationCode) ||
//                   String(s.name) === String(stationCode)
//               ) ||
//               stations.find(
//                 (s) =>
//                   String(s.id) === String(stationCode) ||
//                   String(s.name) === String(stationCode)
//               );
//             const stationNameDisplay = stationObj
//               ? stationObj.name
//               : stationCode;

//             const employeeFromPool = (
//               employeesForPlant.length ? employeesForPlant : employees
//             ).find(
//               (e) =>
//                 String(e.u_code ?? e.username ?? e.id) ===
//                   String(userCodeOrName) ||
//                 String(e.id) === String(userCodeOrName) ||
//                 String(e.name) === String(userCodeOrName)
//             );
//             const employeeNameDisplay = employeeFromPool
//               ? employeeFromPool.name
//               : userCodeOrName;

//             const dateStr = dayjs().format("DD-MM-YYYY");
//             const dayStr = dayjs().format("dddd");

//             return {
//               id: `${dateStr}-${shiftName}-${stationCode}-${idx}-${Math.random()
//                 .toString(36)
//                 .slice(2, 6)}`,
//               date: dateStr,
//               day: dayStr,
//               shiftType: shiftName as ShiftName,
//               employeeId: String(userCodeOrName),
//               employeeName: employeeNameDisplay,
//               plantId: String(plantCode),
//               unitName: r.unit_name ?? r.unitName ?? "",
//               plantName: plantNameDisplay,
//               stationId: String(stationCode),
//               stationName: stationNameDisplay,
//               orgId: String(orgCode),
//               orgName: orgNameDisplay,
//               dbRid: r.rid,
//             } as MappedShift;
//           }
//         );

//         if (!cancelled) setMappedShifts(mapped);
//       } catch (err: any) {
//         console.error("Failed to fetch planned shifts:", err);
//         toast.error("Failed to load planned shifts.");
//       } finally {
//         if (!cancelled) setLoadingPlanned(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [
//     plannedRefresh,
//     orgs,
//     plantOptionsPlan,
//     plantOptionsAdd,
//     stationOptions,
//     employeesForPlant,
//   ]);

//   // --- NEW: Load 'operator' users from public.list_users2 filtered by organisation (preferred)
//   // Fallback to fn_list_employees_by_plant if list_users2 is not available or returns nothing
//   useEffect(() => {
//     setEmployeesForPlant([]);
//     setLoadingEmployeesForPlant(true);

//     // require plantId or orgId to scope user dropdown
//     if (!orgId && !plantId) {
//       setLoadingEmployeesForPlant(false);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         // Try the centralized user list function first
//         const raw: any = await callFunction("public.fn_list_users", []);        const rows = normalizeRows(raw);
//        // console.debug("[Users] list_users2 rows:", rows?.length ?? 0);

//         // Build identifier set for current orgId (orgId may be rid or org_code depending on your mapping)
//         const selectedOrg = orgs.find(
//           (o) =>
//             String(o.id) === String(orgId) ||
//             String(o.code) === String(orgId) ||
//             String(o.name) === String(orgId)
//         );

//         const orgIdentifiers: string[] = [];
//         if (selectedOrg) {
//           orgIdentifiers.push(String(selectedOrg.id));
//           if (selectedOrg.code) orgIdentifiers.push(String(selectedOrg.code));
//           if (selectedOrg.name) orgIdentifiers.push(String(selectedOrg.name));
//         } else if (orgId) {
//           orgIdentifiers.push(String(orgId));
//         }

//         // Filter to operators and matching organisation
//         const operators = (rows || []).filter((r: any) => {
//           const rawRole = (r.role_name ?? r.role_nam ?? r.rolecode ?? "")
//             .toString()
//             .trim()
//             .toLowerCase();
//           if (rawRole !== "operator") return false;
//           if (!orgIdentifiers.length) return true; // no org scope -> return all operators
//           const userOrgRaw = String(
//             r.org_id ?? r.orgcode ?? r.org ?? ""
//           ).trim();
//           return orgIdentifiers.some(
//             (oid) => String(oid).trim() === userOrgRaw
//           );
//         });

//         console.debug("[Users] filtered operators:", operators?.length ?? 0);

//         if ((operators || []).length > 0) {
//           const mapped = operators
//             .map((r: any) => {
//               const firstName = (r.u_first_name ?? r.first_name ?? "")
//                 .toString()
//                 .trim();
//               const lastName = (r.u_last_name ?? r.last_name ?? "")
//                 .toString()
//                 .trim();
//               const displayName =
//                 firstName || lastName
//                   ? `${firstName} ${lastName}`.trim()
//                   : r.username ?? r.u_email ?? "";
//               return {
//                 id: String(r.u_code ?? r.username ?? r.u_email ?? r.uid ?? ""),
//                 name: displayName,
//                 firstName,
//                 lastName,
//                 plantId: plantId ? String(plantId) : "",
//                 username: String(r.username ?? ""),
//                 u_code: String(r.u_code ?? ""),
//               };
//             })
//             .filter((e: any) => e.id && e.name);

//           if (!cancelled) setEmployeesForPlant(mapped);
//           setLoadingEmployeesForPlant(false);
//           return;
//         }

//         // If list_users2 returned none (or we didn't find operators), fall back to plant-specific function
//         console.debug(
//           "[Users] list_users2 returned no operators for org; falling back to fn_list_employees_by_plant"
//         );
//         throw new Error("No operators found via list_users2");
//       } catch (err) {
//         // Fallback block: call your old fn_list_employees_by_plant which takes plantId
//         try {
//           if (!plantId) {
//             if (!cancelled) setEmployeesForPlant([]);
//             return;
//           }
//           const arg = Number.isFinite(Number(plantId))
//             ? Number(plantId)
//             : plantId;
//           const res: any = await callFunction(
//             "public.fn_list_employees_by_plant",
//             [arg]
//           );
//           const rows = normalizeRows(res);
//           const mapped = (rows || [])
//             .map((r: any) => {
//               const firstName = (
//                 r.emp_first_name ??
//                 r.u_first_name ??
//                 r.first_name ??
//                 ""
//               )
//                 .toString()
//                 .trim();
//               const lastName = (
//                 r.emp_last_name ??
//                 r.u_last_name ??
//                 r.last_name ??
//                 ""
//               )
//                 .toString()
//                 .trim();
//               const displayName =
//                 firstName || lastName
//                   ? `${firstName} ${lastName}`.trim()
//                   : r.emp_name ?? r.name ?? r.display_name ?? r.username ?? "";
//               return {
//                 id: String(
//                   r.emp_id ?? r.id ?? r.uid ?? r.emp_code ?? r.username ?? ""
//                 ),
//                 name: displayName,
//                 firstName,
//                 lastName,
//                 plantId: String(plantId),
//                 username: String(r.username ?? ""),
//                 u_code: String(r.emp_code ?? r.u_code ?? ""),
//               };
//             })
//             .filter((e: any) => e.id && e.name);

//           if (!cancelled) setEmployeesForPlant(mapped);
//         } catch (innerErr) {
//           console.error(
//             "Failed to fetch employees (both list_users2 and fn_list_employees_by_plant failed):",
//             innerErr
//           );
//           if (!cancelled) setEmployeesForPlant([]);
//           toast.error("Failed to load users for selected plant/organisation.");
//         } finally {
//           if (!cancelled) setLoadingEmployeesForPlant(false);
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [orgId, plantId, orgs]);

//   // Edit handler (unchanged)
//   // Edit handler
//   const handleEdit = (id: string) => {
//     const selected = mappedShifts.find((m) => m.id === id);
//     if (!selected) return;

//     // Prefill modal fields from selected row
//     setPlantId(selected.plantId ? String(selected.plantId) : "");
//     setStationId(selected.stationId ? String(selected.stationId) : "");
//     setPlDate(dayjs(selected.date, "DD-MM-YYYY").format("YYYY-MM-DD"));
//     setModalShiftType(selected.shiftType ?? "");
//     setModalUserId(selected.employeeName ?? "");
//     setEditShiftGroup([selected]);

//     // set DB id for update
//     setEditRid(selected.dbRid ? Number(selected.dbRid) : null);

//     setShowMapModal(true);
//   };

//   // Field change helper
//   const handleFieldChange = (
//     index: number,
//     key: keyof Shift,
//     value: string
//   ) => {
//     setFormShifts((prev) => {
//       const updated = [...prev];
//       (updated[index] as any)[key] = value;
//       return updated;
//     });
//   };

//   // Open Add Shift modal: clear add-specific state
//   const openAddShiftModal = () => {
//     setFormShifts([
//       {
//         id: "",
//         type: "A",
//         dayStart: "Day 1",
//         startTime: "",
//         dayEnd: "Day 1",
//         endTime: "",
//       },
//       {
//         id: "",
//         type: "B",
//         dayStart: "Day 1",
//         startTime: "",
//         dayEnd: "Day 1",
//         endTime: "",
//       },
//       {
//         id: "",
//         type: "C",
//         dayStart: "Day 1",
//         startTime: "",
//         dayEnd: "Day 2",
//         endTime: "",
//       },
//     ]);
//     setAddOrgId("");
//     setAddPlantId("");
//     setPlantOptionsAdd([]);
//     setShowAddShiftModal(true);
//   };

//   // Open Plan Shift modal: if there's an org selected in Add modal, default to that org (convenience)
//   const openPlanShiftModal = () => {
//     if (addOrgId) {
//       console.debug("Opening Plan modal with addOrgId:", addOrgId);
//       setOrgId(addOrgId);
//     }
//     setEditRid(null);
//     setShowMapModal(true);
//   };

//   // Confirm modal helpers
//   const openConfirmModal = (
//     mode: ConfirmMode,
//     message: string,
//     payload?: any
//   ) => setConfirmState({ visible: true, mode, message, payload });
//   const closeConfirmModal = () =>
//     setConfirmState({ visible: false, mode: null, message: "", payload: null });

//   const onConfirm = async () => {
//     if (!confirmState.mode) {
//       closeConfirmModal();
//       return;
//     }

//     try {
//       if (confirmState.mode === "delete") {
//         // If the payload contains a rid -> this is a planned-shift delete request
//         if (confirmState.payload && confirmState.payload.rid) {
//           await handleDeletePlannedShift(confirmState.payload.rid);
//         } else {
//           // existing deletion for created shifts
//           await performConfirmedDelete(confirmState.payload);
//         }
//       } else if (confirmState.mode === "update") {
//         await performConfirmedUpdate(confirmState.payload);
//       }
//     } catch (err: any) {
//       console.error("Error during confirm action:", err);
//     } finally {
//       closeConfirmModal();
//     }
//   };

//   // Delete a planned shift by DB rid (calls the SP you created)
//   const handleDeletePlannedShift = async (ridToDelete: number | string) => {
//     if (!ridToDelete) {
//       toast.error("Missing record id (rid).");
//       return;
//     }
//     try {
//       // call the SP that deletes by rid
//       await callProcedure("public.ti_fc_sp_delete_planned_shift", [
//         Number(ridToDelete),
//       ]);
//       toast.success("Planned shift deleted.");
//       // refresh the planned-shifts list from DB (ensure you added plannedRefresh state earlier)
//       setPlannedRefresh((p) => p + 1);
//     } catch (err: any) {
//       console.error("Failed to delete planned shift:", err);
//       toast.error(`Delete failed: ${err?.message || err}`);
//     }
//   };

//   // Delete / Update functions unchanged
//   const performConfirmedDelete = async (s: Shift) => {
//     try {
//       const orgName =
//         s.orgName || orgsForAdd.find((o) => o.id === s.orgId)?.name || "";
//       if (!orgName) {
//         toast.error("Organisation name not available for delete.");
//         return;
//       }
//       await callProcedure("public.ti_fc_sp_delete_shift_details", [
//         s.type,
//         orgName,
//       ]);
//       setShifts((prev) => prev.filter((sh) => sh.id !== s.id));
//       toast.success(`Shift ${s.type} deleted (soft-delete).`);
//     } catch (err: any) {
//       console.error("Failed to delete shift:", err);
//       toast.error(`Failed to delete shift: ${err?.message || err}`);
//     }
//   };

//   const performConfirmedUpdate = async (payload: any) => {
//     try {
//       const { fs, orgName } = payload;
//       const startTimeStr = `${fs.startTime}:00`;
//       const endTimeStr = `${fs.endTime}:00`;
//       await callProcedure("public.ti_fc_sp_update_shift_details", [
//         fs.type,
//         startTimeStr,
//         endTimeStr,
//         orgName,
//       ]);
//       setShifts((prev) =>
//         prev.map((sh) =>
//           sh.id === fs.id
//             ? { ...sh, startTime: fs.startTime, endTime: fs.endTime }
//             : sh
//         )
//       );
//       setShowAddShiftModal(false);
//       setFormShifts([]);
//       setAddOrgId("");
//       setPlantOptionsAdd([]);
//       toast.success(`Shift ${fs.type} updated successfully.`);
//     } catch (err: any) {
//       console.error("Failed to update shift:", err);
//       toast.error(`Failed to update shift: ${err?.message || err}`);
//     }
//   };

//   // Save shifts (add modal) unchanged
//   const saveShifts = async () => {
//     if (!addOrgId) {
//       toast.error("Please select an Organisation before saving shifts.");
//       return;
//     }
//     for (let i = 0; i < formShifts.length; i++) {
//       const fs = formShifts[i];
//       if (!fs.startTime || !fs.endTime) {
//         toast.error("Please provide Start and End times for all shifts.");
//         return;
//       }
//     }
//     const orgObj = orgsForAdd.find(
//       (o) =>
//         String(o.id) === String(addOrgId) || String(o.code) === String(addOrgId)
//     );
//     if (!orgObj) {
//       console.error("Organisation lookup failed in saveShifts()", {
//         addOrgId,
//         orgsForAdd,
//       });
//       toast.error(
//         "Organisation name not found. Please re-select the organisation."
//       );
//       return;
//     }
//     const orgName = orgObj.name;
//     try {
//       const isEditing =
//         formShifts.length === 1 &&
//         !!formShifts[0].id &&
//         shifts.some((sh) => sh.id === formShifts[0].id);
//       if (isEditing) {
//         openConfirmModal(
//           "update",
//           `Confirm update shift ${formShifts[0].type}?`,
//           { fs: formShifts[0], orgName }
//         );
//         return;
//       }

//       // -- Get plant name from plantOptionsAdd, matching addPlantId
// const plantObj = plantOptionsAdd.find(p => String(p.id) === String(addPlantId));
// const plantName = plantObj ? plantObj.name : addPlantId; // fallback

// for (const fs of formShifts) {
//   const startTimeStr = fs.startTime; // "HH:mm" (time input returns correct format)
//   const endTimeStr = fs.endTime;
//   await callProcedure("public.ti_fc_sp_insert_shift_details2", [
//     orgName,        // Organisation name
//     plantName,      // Plant name
//     fs.type,        // Shift name
//     startTimeStr,   // Start time (time string)
//     endTimeStr      // End time (time string)
//   ]);
// }

//       const newShiftsLocal = formShifts.map((fs) => ({
//         ...fs,
//         id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//         orgId: addOrgId,
//         orgName,
//       }));
//       setShifts((prev) => [...prev, ...newShiftsLocal]);
//       setShowAddShiftModal(false);
//       setFormShifts([]);
//       setAddOrgId("");
//       setPlantOptionsAdd([]);
//       setAddPlantId("");
//       toast.success("Shifts saved successfully (organisation only).");
//     } catch (err: any) {
//       console.error("Failed to save shifts:", err);
//       toast.error(`Failed to save shifts: ${err?.message || err}`);
//     }
//   };

//   // Plan modal local state
//   const [modalShiftType, setModalShiftType] = useState<ShiftName | "">("");
//   const [modalUserId, setModalUserId] = useState<string>("");

//   const handleConfirmEditPlannedShift = async () => {
//     if (!editRid) {
//       toast.error("Missing record id (rid).");
//       return;
//     }

//     // Build new values to send
//     const newUser = String(modalUserId ?? "");
//     const stationObj = stationOptions.find(
//       (s) => String(s.id) === String(stationId)
//     );
//     const newStation = stationObj ? stationObj.name : String(stationId ?? "");

//     if ((!newUser || newUser === "") && (!newStation || newStation === "")) {
//       toast.error("Please select a user or station to update.");
//       return;
//     }

//     try {
//       await callProcedure("public.ti_fc_sp_update_planned_shifts", [
//         Number(editRid),
//         newStation,
//         newUser,
//       ]);
//       toast.success("Planned shift updated.");
//       // refresh data from DB
//       setPlannedRefresh((p) => p + 1);

//       // reset modal + edit state
//       setModalShiftType("");
//       setModalUserId("");
//       setPlDate(todayISO);
//       setPlantId("");
//       setStationId("");
//       setEditShiftGroup(null);
//       setEditRid(null);
//       setEmployeesForPlant([]);
//       setStationOptions([]);
//       setShowMapModal(false);
//     } catch (err: any) {
//       console.error("Failed to update planned shift:", err);
//       toast.error(`Update failed: ${err?.message || err}`);
//     }
//   };

//   // Save planned shift (calls your new DB function fn_insert_planned_shift_by_names)
//   // Replace the entire handleSavePlannedShift function with this
//   const handleSavePlannedShift = async () => {
//     if (!orgId) {
//       toast.error("Please select an Organisation (Plan).");
//       return;
//     }
//     if (!plantId) {
//       toast.error("Please select a Plant.");
//       return;
//     }
//     if (!stationId) {
//       toast.error("Please select a Station.");
//       return;
//     }
//     if (!modalShiftType) {
//       toast.error("Please select a Shift.");
//       return;
//     }
//     if (!modalUserId) {
//       toast.error("Please select a User.");
//       return;
//     }

//     try {
//       // Resolve display names (fall back sensibly if not available)
//       const orgObj = orgs.find(
//         (o) =>
//           String(o.id) === String(orgId) || String(o.code) === String(orgId)
//       );
//       const orgName = orgObj?.name ?? String(orgId ?? "");

//       const plantObj = plantOptionsPlan.find(
//         (p) => String(p.id) === String(plantId)
//       );
//       const plantName =
//         plantObj?.name ??
//         plants.find((p) => String(p.id) === String(plantId))?.name ??
//         String(plantId ?? "");

//       const stationObj = stationOptions.find(
//         (s) => String(s.id) === String(stationId)
//       );
//       const stationName =
//         stationObj?.name ??
//         filteredStations.find((s) => String(s.id) === String(stationId))
//           ?.name ??
//         String(stationId ?? "");

//       // Build a user identifier to send:
//       // We expect the select value to be u_code/username if available; otherwise we attempt first+last or display name.
//       const pool = employeesForPlant.length ? employeesForPlant : employees;
//       const emp = pool.find(
//         (e) =>
//           String(e.name) === String(modalUserId) ||
//           String((e as any).u_code ?? (e as any).username ?? e.id) ===
//             String(modalUserId) ||
//           String(e.id) === String(modalUserId)
//       );

//       // Since we want to push the selected display name directly, prefer modalUserId (which now holds the name)
//       let userToSend = String(modalUserId ?? "").trim();

//       // fallback: if modalUserId was empty for some reason, use emp.name or emp.id
//       if ((!userToSend || userToSend === "undefined") && emp) {
//         userToSend = emp.name ?? String(emp.id);
//       }

//       const pShift = String(modalShiftType ?? "")
//         .trim()
//         .toUpperCase();

//       // sanity check
//       if (!orgName || !plantName || !stationName || !userToSend || !pShift) {
//         toast.error(
//           "Missing values. Please ensure Organisation, Plant, Station, Shift and User are selected."
//         );
//         return;
//       }

//       // Build args array and log it for debugging
//       const argsToSend = [orgName, plantName, unitName, stationName, pShift, userToSend];
//       console.log("[Plan] Sending SP args array ->", argsToSend);

//       // Call the stored procedure (positional args)
//       await callProcedure("public.ti_fc_sp_insert_planned_shifts", argsToSend);

//       // Build local mapped preview object (fulfill the MappedShift interface)
//       const employee = emp ??
//         (employeesForPlant.length ? employeesForPlant[0] : employees[0]) ?? {
//           id: String(modalUserId),
//           name: userToSend,
//         };
//       const plantDisplay = plantName;
//       const stationDisplay = stationName;
//       const newMapped: MappedShift = {
//         id: `${plDate}-${modalShiftType}-${modalUserId}-${Math.random()
//           .toString(36)
//           .slice(2, 6)}`,
//         date: dayjs(plDate).format("DD-MM-YYYY"),
//         day: dayjs(plDate).format("dddd"),
//         shiftType: modalShiftType as ShiftName,
//         employeeId: modalUserId,
//         employeeName: employee?.name || userToSend || "",
//         plantId: String(plantId),
//         plantName: plantDisplay,
//         stationId: String(stationId),
//         stationName: stationDisplay,
//         orgId: String(orgObj?.id ?? orgId ?? ""),
//         orgName: String(orgObj?.name ?? orgName ?? ""),
//       };

//       setMappedShifts((prev) => [
//         ...prev.filter(
//           (m) =>
//             !(
//               m.date === newMapped.date &&
//               m.plantId === newMapped.plantId &&
//               m.stationId === newMapped.stationId &&
//               m.shiftType === newMapped.shiftType
//             )
//         ),
//         newMapped,
//       ]);

//       toast.success("Planned shift saved (inserted in DB).");
//       // refresh from DB so UI reflects the real table
//       setPlannedRefresh((p) => p + 1);

//       // reset modal state
//       setModalShiftType("");
//       setModalUserId("");
//       setPlDate(todayISO);
//       setPlantId("");
//       setStationId("");
//       setOrgId("");
//       setEmployeesForPlant([]);
//       setStationOptions([]);
//       setShowMapModal(false);
//     } catch (err: any) {
//       console.error("Failed to save planned shift via SP:", err);
//       toast.error(`Failed to save planned shift: ${err?.message || err}`);
//     }
//   };

//   // When clicking Plan Shift button we call this to open modal
//   const handleOpenPlan = () => {
//     openPlanShiftModal();
//   };

//   // Delete confirm for created shifts (unchanged)
//   const onDeleteButtonClicked = (s: Shift) => {
//     openConfirmModal(
//       "delete",
//       `Are you sure you want to delete shift ${s.type} for ${
//         s.orgName || "this organisation"
//       }?`,
//       s
//     );
//   };

//   // UI
//   return (
//     <div className="h-screen bg-blue-50 py-2 overflow-hidden">
//       <div className="mx-auto max-w-[1400px] px-3">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-2xl font-bold text-blue-900">Shift Management</h2>
//           <div className="space-x-2">
//             <button
//               onClick={openAddShiftModal}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Add Shift
//             </button>
//             <button
//               onClick={handleOpenPlan}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Plan Shift
//             </button>
//           </div>
//         </div>

//         {/* ADD SHIFT MODAL (Add modal uses orgsForAdd -> plantOptionsAdd) */}
//         {showAddShiftModal && (
//           <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-xl w-full max-w-3xl space-y-4 shadow-lg">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-semibold">Add Shift</h3>
//                 <button
//                   onClick={() => setShowAddShiftModal(false)}
//                   className="text-gray-400 text-xl"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="grid grid-cols-3 gap-4 mb-2">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-1">
//                     Organisation
//                   </label>
//                   <select
//                     className="border rounded px-3 py-2 w-full"
//                     value={addOrgId}
//                     onChange={(e) => setAddOrgId(String(e.target.value))}
//                   >
//                     <option value="">
//                       {loadingOrgsForAdd
//                         ? "Loading organisations..."
//                         : "Select Organisation"}
//                     </option>
//                     {orgsForAdd.map((o) => (
//                       <option key={o.id} value={o.id}>
//                         {o.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-1">
//                     Plant
//                   </label>
//                   <select
//                     className="border rounded px-3 py-2 w-full"
//                     value={addPlantId}
//                     onChange={(e) => setAddPlantId(String(e.target.value))}
//                     disabled={!addOrgId || loadingPlantOptionsAdd}
//                   >
//                     <option value="">
//                       {loadingPlantOptionsAdd
//                         ? "Loading plants…"
//                         : !addOrgId
//                         ? "Select Org first"
//                         : "Select Plant"}
//                     </option>
//                     {plantOptionsAdd.map((p) => (
//                       <option key={String(p.id)} value={String(p.id)}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="text-xs text-gray-400 mt-1">
//                     Plants shown are filtered by the Organisation selected
//                     above.
//                   </div>
//                 </div>
//                 <div /> {/* placeholder */}
//               </div>

//               <div className="grid grid-cols-5 gap-4 font-semibold">
//                 <div>Shift</div>
//                 <div>Start Day</div>
//                 <div>Start Time</div>
//                 <div>End Day</div>
//                 <div>End Time</div>
//               </div>

//               {formShifts.map((fs, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-5 gap-4 items-center"
//                 >
//                   <select
//                     className="border rounded px-2 py-1"
//                     value={fs.type}
//                     onChange={(e) =>
//                       handleFieldChange(index, "type", e.target.value)
//                     }
//                   >
//                     {shiftOptions.map((opt) => (
//                       <option key={opt} value={opt}>
//                         {opt}
//                       </option>
//                     ))}
//                   </select>
//                   <select
//                     className="border rounded px-2 py-1"
//                     value={fs.dayStart}
//                     onChange={(e) =>
//                       handleFieldChange(index, "dayStart", e.target.value)
//                     }
//                   >
//                     {dayOptions.map((opt) => (
//                       <option key={opt} value={opt}>
//                         {opt}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="time"
//                     className="border rounded px-2 py-1"
//                     value={fs.startTime}
//                     onChange={(e) =>
//                       handleFieldChange(index, "startTime", e.target.value)
//                     }
//                   />
//                   <select
//                     className="border rounded px-2 py-1"
//                     value={fs.dayEnd}
//                     onChange={(e) =>
//                       handleFieldChange(index, "dayEnd", e.target.value)
//                     }
//                   >
//                     {dayOptions.map((opt) => (
//                       <option key={opt} value={opt}>
//                         {opt}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="time"
//                     className="border rounded px-2 py-1"
//                     value={fs.endTime}
//                     onChange={(e) =>
//                       handleFieldChange(index, "endTime", e.target.value)
//                     }
//                   />
//                 </div>
//               ))}

//               <div className="text-right">
//                 <button
//                   className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//                   onClick={saveShifts}
//                   disabled={!addOrgId}
//                 >
//                   Save Shifts
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PLAN SHIFT MODAL */}
//         {showMapModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-xl p-6 shadow-lg">
//               <div className="flex justify-between mb-4">
//                 <h3 className="text-xl font-semibold">Plan Single Shift</h3>
//                 <button
//                   onClick={() => {
//                     setModalShiftType("");
//                     setModalUserId("");
//                     setPlDate(todayISO);
//                     setPlantId("");
//                     setStationId("");
//                     setEditShiftGroup(null);
//                     setShowMapModal(false);
//                     setOrgId("");
//                     setEditRid(null);
//                   }}
//                   className="text-xl"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Organisation selector added here to avoid showing wrong plants */}
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Organisation
//                   </label>
//                   <select
//                     value={orgId}
//                     onChange={(e) => setOrgId(String(e.target.value))}
//                     className="w-full border px-3 py-2 rounded"
//                   >
//                     <option value="">
//                       {orgs.length
//                         ? "Select Organisation"
//                         : "Loading Organisations..."}
//                     </option>
//                     {orgs.map((o) => (
//                       <option key={o.id} value={o.id}>
//                         {o.name}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="text-xs text-gray-400 mt-1">
//                     Choose organisation first — Plant list is filtered by this.
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Plant
//                   </label>
//                   <select
//                     value={plantId !== "" ? String(plantId) : ""}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       console.debug("[Plan Modal] plant changed:", val);
//                       setPlantId(val);
//                       setStationId("");
//                       setModalUserId("");
//                     }}
//                     className="w-full border px-3 py-2 rounded"
//                     disabled={!orgId || loadingPlantOptionsPlan}
//                   >
//                     <option value="">
//                       {loadingPlantOptionsPlan
//                         ? "Loading plants…"
//                         : !orgId
//                         ? "Select Organisation first"
//                         : "Select Plant"}
//                     </option>
//                     {(plantOptionsPlan.length ? plantOptionsPlan : plants).map(
//                       (p) => (
//                         <option key={String(p.id)} value={String(p.id)}>
//                           {p.name}
//                         </option>
//                       )
//                     )}
//                   </select>
//                 </div>

//                  {/* --- UNIT DROPDOWN (add here) --- */}
//   <div>
//     <label className="text-sm font-medium block mb-1">Unit</label>
//     <select
//       value={unitName}
//       onChange={e => setUnitName(e.target.value)}
//       className="w-full border px-3 py-2 rounded"
//       disabled={!plantId || !unitOptions.length}
//     >
//       <option value="">
//         {unitOptions.length ? "Select Unit" : "No units"}
//       </option>
//       {unitOptions.map(u => (
//         <option key={u} value={u}>{u}</option>
//       ))}
//     </select>
//     <div className="text-xs text-gray-400 mt-1">
//       Units depend on Plant and Organisation.
//     </div>
//   </div>

//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Station
//                   </label>
//                   <select
//                     value={stationId !== "" ? String(stationId) : ""}
//                     onChange={(e) => setStationId(String(e.target.value))}
//                     className="w-full border px-3 py-2 rounded"
//                     disabled={!plantId || loadingStationOptions}
//                   >
//                     <option value="">
//                       {loadingStationOptions
//                         ? "Loading stations…"
//                         : !plantId
//                         ? "Select Plant first"
//                         : "Select Station"}
//                     </option>
//                     {(stationOptions.length
//                       ? stationOptions
//                       : filteredStations
//                     ).map((s) => (
//                       <option key={String(s.id)} value={String(s.id)}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Shift
//                   </label>
//                   <select
//   value={modalShiftType}
//   onChange={e => setModalShiftType(e.target.value as any)}
//   className="w-full border px-3 py-2 rounded"
//   disabled={!plantId || loadingPlanShiftOptions}
// >
//   <option value="">
//     {loadingPlanShiftOptions
//       ? "Loading shifts…"
//       : !plantId
//       ? "Select Plant first"
//       : "Select Shift"}
//   </option>
//   {planShiftOptions.map(sh => (
//     <option key={sh} value={sh}>
//       {sh}
//     </option>
//   ))}
// </select>

//                 </div>

//                 <div>
//                   <label className="text-sm font-medium block mb-1">User</label>
//                   <select
//                     value={modalUserId}
//                     onChange={(e) => setModalUserId(e.target.value)}
//                     className="w-full border px-3 py-2 rounded"
//                     disabled={!plantId || loadingEmployeesForPlant}
//                   >
//                     <option value="">
//                       {loadingEmployeesForPlant
//                         ? "Loading users…"
//                         : !plantId
//                         ? "Select Plant first"
//                         : "Select User"}
//                     </option>
//                     {filteredEmployees.map((emp) => (
//                       <option key={emp.id} value={emp.id}>
//   {emp.name}
// </option>

//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <button
//                   onClick={() => {
//                     setModalShiftType("");
//                     setModalUserId("");
//                     setPlDate(todayISO);
//                     setPlantId("");
//                     setStationId("");
//                     setEditShiftGroup(null);
//                     setShowMapModal(false);
//                     setOrgId("");
//                   }}
//                   className="px-4 py-2 rounded border mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (editRid) handleConfirmEditPlannedShift();
//                     else handleSavePlannedShift();
//                   }}
//                   className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
//                 >
//                   Save & Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* rest of page (Created Shifts and Planned Shifts lists) unchanged */}
//         <div className="bg-white rounded-2xl shadow-md px-5 py-3 border border-gray-100 mt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">
//               Created Shifts
//             </h3>
//             {shifts.length > 0 && (
//               <span className="text-sm text-gray-500">
//                 {shifts.length} total
//               </span>
//             )}
//           </div>

//           {shifts.length === 0 ? (
//             <div className="text-center py-8 text-gray-400 italic">
//               No shifts created yet.
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-lg border border-gray-200">
//               <table className="w-full text-sm">
//                 <thead className="bg-blue-50">
//                   <tr className="text-blue-800">
//                     <th className="px-5 py-3 text-left font-semibold">Shift</th>
//                     <th className="px-5 py-3 text-left font-semibold">
//                       Timing
//                     </th>
//                     <th className="px-5 py-3 text-center font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 bg-white">
//                   {shifts.map((s) => (
//                     <tr key={s.id} className="hover:bg-gray-50 transition">
//                       <td className="px-5 py-3 font-medium text-gray-800">
//                         {s.type}
//                       </td>
//                       <td className="px-5 py-3 text-gray-700">
//                         {s.dayStart} {s.startTime} → {s.dayEnd} {s.endTime}
//                         {s.orgName ? (
//                           <div className="text-xs text-gray-500 mt-1">
//                             Org: {s.orgName}
//                           </div>
//                         ) : null}
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <button
//                           onClick={() => {
//                             setFormShifts([s]);
//                             if (s.orgId) setAddOrgId(s.orgId);
//                             else if (s.orgName) {
//                               const found = orgsForAdd.find(
//                                 (o) => o.name === s.orgName
//                               );
//                               if (found) setAddOrgId(found.id);
//                             }
//                             setShowAddShiftModal(true);
//                           }}
//                           className="text-blue-600 hover:text-blue-800 font-medium transition mr-4"
//                         >
//                           Edit
//                         </button>

//                         {/* created-shift delete - call the existing handler for shifts */}
//                         <button
//                           onClick={() => onDeleteButtonClicked(s)}
//                           className="text-red-500 hover:text-red-600 font-medium transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="mt-8 bg-white rounded-2xl shadow-lg px-5 py-3 border border-gray-100">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">
//               Planned Shifts
//             </h3>
//             {mappedShifts.length > 0 && (
//               <span className="text-sm text-gray-500">
//                 {mappedShifts.length} total
//               </span>
//             )}
//           </div>
//           {mappedShifts.length === 0 ? (
//             <div className="text-center py-8 text-gray-400 italic">
//               No shifts planned yet.
//             </div>
//           ) : (
//             <div className="overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
//               <table className="w-full text-sm">
//                 <thead className="bg-blue-50 text-blue-800 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-5 py-3 text-left font-semibold">Day</th>
//                     <th className="px-5 py-3 text-left font-semibold">Date</th>
//                     <th className="px-5 py-3 text-left font-semibold">Shift</th>
//                     <th className="px-5 py-3 text-left font-semibold">
//                       Employee
//                     </th>
//                     <th className="px-5 py-3 text-left font-semibold">
//                       Organisation
//                     </th>
//                     <th className="px-5 py-3 text-left font-semibold">Plant</th>
//                     <th className="px-5 py-3 text-left font-semibold">Unit</th>
//                     <th className="px-5 py-3 text-left font-semibold">
//                       Station
//                     </th>
//                     <th className="px-5 py-3 text-center font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 bg-white">
//                   {mappedShifts.map((m) => (
//                     <tr key={m.id} className="hover:bg-gray-50 transition">
//                       <td className="px-5 py-3 text-gray-800">{m.day}</td>
//                       <td className="px-5 py-3 text-gray-800">{m.date}</td>
//                       <td className="px-5 py-3 text-gray-800">{m.shiftType}</td>
//                       <td className="px-5 py-3 text-gray-800">
//                         {m.employeeName}
//                       </td>
//                       <td className="px-5 py-3 text-gray-800">
//                         {m.orgName || "-"}
//                       </td>
//                       <td className="px-5 py-3 text-gray-800">{m.plantName}</td>
//                       <td className="px-5 py-3 text-gray-800">{m.unitName || "-"}</td>
//                       <td className="px-5 py-3 text-gray-800">
//                         {m.stationName}
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <button
//                           onClick={() => handleEdit(m.id)}
//                           className="text-blue-600 hover:text-blue-800 font-medium transition mr-4"
//                         >
//                           Edit
//                         </button>
//                         {/* Planned-shift delete: open confirm modal and pass rid in payload */}
//                         <button
//                           onClick={() =>
//                             openConfirmModal(
//                               "delete",
//                               `Delete planned shift for ${m.employeeName} on ${m.date}?`,
//                               { rid: m.dbRid }
//                             )
//                           }
//                           className="text-red-500 hover:text-red-600 font-medium transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Confirm modal */}
//       {confirmState.visible && (
//         <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//             <h4 className="text-lg font-semibold mb-3">Please confirm</h4>
//             <p className="text-sm text-gray-700 mb-6">{confirmState.message}</p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeConfirmModal}
//                 className="px-4 py-2 rounded border hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onConfirm}
//                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer position="top-right" />
//     </div>
//   );
// };

// export default ShiftsPage;

// Soham 
// src/pages/ShiftsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { callFunction, callProcedure } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Shift {
  id: string;
  type: ShiftName;
  dayStart: string;
  startTime: string;
  dayEnd: string;
  endTime: string;
  orgId?: string;
  orgName?: string;
}

interface Plant {
  id: number | string;
  name: string;
}
interface Station {
  id: number | string;
  name: string;
  plantId: number | string;

  }

  interface StationRow {
  sname?: string;
  id?: string;
  name?: string;
}

// Extended employee to keep username / u_code if available
interface Employee {
  id: string;
  name: string;
  plantId: number | string;
  username?: string;
  u_code?: string;
}

interface Org {
  id: string;
  name: string;
  code?: string;
}

interface MappedShift {
  id: string;
  date: string;
  day: string;
  shiftType: ShiftName;
  employeeId: string;
  employeeName: string;
  plantId: string;
  plantName: string;
  stationId: string;
  stationName: string;
  orgId?: string; // <-- added
  orgName?: string;
  unitName?: string;
  dbRid?: number | string;
}

type ShiftName = "A" | "B" | "C";

type Row = {
  date: string;
  day: string;
  shifts: Record<ShiftName, string>;
};

const shiftOptions: ShiftName[] = ["A", "B", "C"];
const dayOptions = ["Day 1", "Day 2"];

// Local fallback data (unchanged)
const plants: Plant[] = [
  { id: "p1", name: "Alpha Plant" },
  { id: "p2", name: "Beta Plant" },
];
const stations: Station[] = [
  { id: "s1", name: "Station A1", plantId: "p1" },
  { id: "s2", name: "Station A2", plantId: "p1" },
  { id: "s3", name: "Station B1", plantId: "p2" },
  { id: "s4", name: "Station B2", plantId: "p2" },
];
const employees: Employee[] = [
  { id: "e1", name: "Alice", plantId: "p1" },
  { id: "e2", name: "Bob", plantId: "p1" },
  { id: "e3", name: "Charlie", plantId: "p1" },
  { id: "e4", name: "David", plantId: "p2" },
  { id: "e5", name: "Eve", plantId: "p2" },
  { id: "e6", name: "Frank", plantId: "p2" },
];

const getItem = <T,>(key: string): T[] => {
  const val = localStorage.getItem(key);
  try {
    return val ? (JSON.parse(val) as T[]) : [];
  } catch {
    return [];
  }
};
const setItem = <T,>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const todayISO = dayjs().format("YYYY-MM-DD");

type ConfirmMode = "delete" | "update" | null;
interface ConfirmState {
  visible: boolean;
  mode: ConfirmMode;
  message?: string;
  payload?: any;
}

const ShiftsPage: React.FC = () => {
  // persisted lists
  const [mappedShifts, setMappedShifts] = useState<MappedShift[]>(
    getItem<MappedShift>("mappedPlantShifts")
  );
  const [shifts, setShifts] = useState<Shift[]>(getItem<Shift>("shifts"));
  // trigger to re-fetch planned shifts from server after insert/delete
  const [plannedRefresh, setPlannedRefresh] = useState<number>(0);
  const [, setLoadingPlanned] = useState<boolean>(false);
  const [editRid, setEditRid] = useState<number | null>(null);

  // modals
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Add-shift form state
  const [formShifts, setFormShifts] = useState<Shift[]>([]);
  const [addOrgId, setAddOrgId] = useState<string>("");
  const [orgsForAdd, setOrgsForAdd] = useState<Org[]>([]);
  const [loadingOrgsForAdd, setLoadingOrgsForAdd] = useState(false);

  // Plan-shift top-level org (selected in Plan modal or set from Add modal when opening)
  const [orgId, setOrgId] = useState<string>(""); // used by Plan modal
  const [orgs, setOrgs] = useState<Org[]>([]);

  // Separate plant lists so Add and Plan do not overwrite each other
  const [plantOptionsPlan, setPlantOptionsPlan] = useState<Plant[]>([]);
  const [plantOptionsAdd, setPlantOptionsAdd] = useState<Plant[]>([]);

  const [unitOptions, setUnitOptions] = useState<string[]>([]);
  const [unitName, setUnitName] = useState<string>(""); // selected unit in modal


  // selected plant/station for plan modal (strings)
  const [plantId, setPlantId] = useState<string>("");
  const [stationId, setStationId] = useState<string>("");
  const [plDate, setPlDate] = useState<string>(todayISO);

  // Add-shift selected plant (UI only) — ensures Add modal shows plants for the addOrgId
  const [addPlantId, setAddPlantId] = useState<string>("");

  // station options for plan (populated by backend call when plantId changes)
  const [stationOptions, setStationOptions] = useState<Station[]>([]);

  // employees for selected plant (plan modal)
  const [employeesForPlant, setEmployeesForPlant] = useState<Employee[]>([]);
  const [loadingEmployeesForPlant, setLoadingEmployeesForPlant] =
    useState(false);

  // loading flags
  const [loadingPlantOptionsPlan, setLoadingPlantOptionsPlan] = useState(false);
  const [loadingPlantOptionsAdd, setLoadingPlantOptionsAdd] = useState(false);
  const [loadingStationOptions, setLoadingStationOptions] = useState(false);

  // rows and edit state for map UI (unchanged)
  const [, setRows] = useState<Row[]>([]);
  const [editShiftGroup, setEditShiftGroup] = useState<MappedShift[] | null>(
    null
  );

  // State for shift options in Plan modal
const [planShiftOptions, setPlanShiftOptions] = useState<string[]>([]);
const [loadingPlanShiftOptions, setLoadingPlanShiftOptions] = useState(false);


  // confirm modal
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    visible: false,
    mode: null,
    message: "",
    payload: null,
  });

  // Normalize backend shapes
  const normalizeRows = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.rows) return res.rows;
    if (res.data) return res.data;
    if (res.result) return res.result;
    return [];
  };

  // Filtered helpers
  const filteredStations = useMemo(
    () =>
      (stationOptions.length ? stationOptions : stations).filter(
        (s) => String(s.plantId) === String(plantId)
      ),
    [plantId, stationOptions, stations]
  );

  const filteredEmployees = useMemo(() => {
    const pool = employeesForPlant.length ? employeesForPlant : employees;
    return pool.filter((e) => String(e.plantId) === String(plantId));
  }, [plantId, employeesForPlant]);

  // persist drafts
  useEffect(() => setItem("shifts", shifts), [shifts]);
  useEffect(() => setItem("mappedPlantShifts", mappedShifts), [mappedShifts]);

  // Manage rows for mapping UI (unchanged)
  useEffect(() => {
    if (!plantId || !stationId || !plDate) {
      setRows([]);
      return;
    }
    const start = dayjs(plDate);
    const end = dayjs(plDate);
    const days = end.diff(start, "day");
    const temp: Row[] = [];
    for (let i = 0; i <= days; i++) {
      const d = start.add(i, "day");
      const formattedDate = d.format("DD-MM-YYYY");
      const dayName = d.format("dddd");
      const defaultShifts: Record<ShiftName, string> = { A: "", B: "", C: "" };
      if (editShiftGroup) {
        const dayShifts: Record<ShiftName, string> = { ...defaultShifts };
        shiftOptions.forEach((shift) => {
          const match = editShiftGroup.find(
            (m) => m.date === formattedDate && m.shiftType === shift
          );
          if (match) dayShifts[shift] = match.employeeId;
        });
        temp.push({ date: formattedDate, day: dayName, shifts: dayShifts });
      } else {
        temp.push({ date: formattedDate, day: dayName, shifts: defaultShifts });
      }
    }
    setRows(temp);
  }, [plantId, stationId, plDate, editShiftGroup]);

  // Load Add Shift orgs when Add modal opens
  useEffect(() => {
    if (!showAddShiftModal) return;
    (async () => {
      try {
        setLoadingOrgsForAdd(true);
        const raw: any = await callFunction("public.list_organisations", []);
        const rows = Array.isArray(raw)
          ? raw
          : raw?.rows ?? raw?.data ?? raw?.result ?? [];
        const mapped = (rows || [])
          .map((row: any) => {
            const rid = row.rid ?? row.id ?? null;
            const code = row.org_code ?? row.code ?? "";
            const name = row.org_name ?? row.name ?? "";
            return {
              id: String(rid ?? code ?? ""),
              code: String(code ?? ""),
              name: String(name ?? ""),
            };
          })
          .filter((o: any) => o.id && o.name);
        setOrgsForAdd(mapped);
        if (!addOrgId && mapped.length) setAddOrgId(mapped[0].id);
      } catch (err) {
        console.error(
          "Failed to fetch organisations for Add Shift modal:",
          err
        );
        setOrgsForAdd([]);
        toast.error("Failed to fetch organisations for Add Shift modal.");
      } finally {
        setLoadingOrgsForAdd(false);
      }
    })();
  }, [showAddShiftModal]);

  // Load orgs once for Plan modal (so Plan modal can show org selector)
  useEffect(() => {
    (async () => {
      try {
        const res: any = await callFunction("public.list_organisations", []);
        const rows = Array.isArray(res) ? res : res?.rows ?? [];
        const mapped = (rows || []).map((r: any) => ({
  id: String(r.rid ?? r.org_code ?? ""),      // <-- use rid or org_code
  code: String(r.org_code ?? ""),
  name: String(r.org_name ?? r.name ?? ""),
}));

        setOrgs(mapped);
      } catch (err) {
        console.error("Failed to load organisations on mount:", err);
      }
    })();
  }, []);

  // Load plants for Plan modal org selection (plantOptionsPlan)
  useEffect(() => {
    setPlantOptionsPlan([]);
    setStationOptions([]);
    setPlantId("");
    setStationId("");
    if (!orgId) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingPlantOptionsPlan(true);
      try {
        const arg = Number.isFinite(Number(orgId)) ? Number(orgId) : orgId;
        console.debug("[Plan] loading plants for org:", orgId, "arg:", arg);
        const res: any = await callFunction("public.fn_list_plants_by_org", [
          arg,
        ]);
        const rows = normalizeRows(res);
        const mapped = (rows || [])
          .map((r: any) => {
            const pid = r.pid ?? r.p_id ?? r.id ?? "";
            const pcode = r.p_code ?? r.plant_code ?? "";
            const name = r.p_name ?? r.pname ?? r.plant_name ?? r.name ?? "";
            const id = pcode
              ? String(pcode)
              : pid !== undefined
              ? String(pid)
              : "";
            return { id, name };
          })
          .filter((p: any) => p.id && p.name);
        console.debug("[Plan] plants returned:", mapped);
        if (!cancelled) setPlantOptionsPlan(mapped);
      } catch (err: any) {
        console.error("Failed to load plants for plan orgId", orgId, err);
        if (!cancelled) setPlantOptionsPlan([]);
        toast.error("Failed to load plants for selected organisation (Plan).");
      } finally {
        if (!cancelled) setLoadingPlantOptionsPlan(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  // Load plants for Add modal org selection (plantOptionsAdd)
  useEffect(() => {
    setPlantOptionsAdd([]);
    setAddPlantId("");
    if (!addOrgId) return;
    let cancelled = false;
    (async () => {
      setLoadingPlantOptionsAdd(true);
      try {
        const arg = Number.isFinite(Number(addOrgId))
          ? Number(addOrgId)
          : addOrgId;
        console.debug(
          "[Add] loading plants for addOrgId:",
          addOrgId,
          "arg:",
          arg
        );
        const res: any = await callFunction("public.fn_list_plants_by_org", [
          arg,
        ]);
        const rows = normalizeRows(res);
        const mapped = (rows || [])
          .map((r: any) => {
            const pid = r.pid ?? r.p_id ?? r.id ?? "";
            const pcode = r.p_code ?? r.plant_code ?? "";
            const name = r.p_name ?? r.pname ?? r.plant_name ?? r.name ?? "";
            const id = pcode
              ? String(pcode)
              : pid !== undefined
              ? String(pid)
              : "";
            return { id, name };
          })
          .filter((p: any) => p.id && p.name);
        console.debug("[Add] plants returned:", mapped);
        if (!cancelled) {
          setPlantOptionsAdd(mapped);
          if (!addPlantId && mapped.length) setAddPlantId(mapped[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load plants for addOrgId", addOrgId, err);
        if (!cancelled) setPlantOptionsAdd([]);
        toast.error("Failed to load plants for selected organisation (Add).");
      } finally {
        if (!cancelled) setLoadingPlantOptionsAdd(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addOrgId]);

  // Load stations for Plan modal when plantId changes
  useEffect(() => {
  setStationOptions([]);
  setStationId("");
  if (!orgId || !plantId || !unitName) return;
  let cancelled = false;

  // Resolve names from IDs
  const orgObj = orgs.find(
    (o) => String(o.id) === String(orgId) || String(o.code) === String(orgId)
  );
  const plantObj = plantOptionsPlan.find(
    (p) => String(p.id) === String(plantId)
  );
  const orgName = orgObj ? orgObj.name : orgId;
  const plantName = plantObj ? plantObj.name : plantId;

  (async () => {
    setLoadingStationOptions(true);
    try {
      // Call the correct function with all three names
      const sRes = await callFunction(
        "public.fn_list_stations_by_unit",
        [orgName, plantName, unitName]
      );
      const rows = Array.isArray(sRes)
        ? sRes
        : sRes?.rows ?? sRes?.data ?? sRes?.result ?? [];
      // Map the stations
      const mapped = rows
  .map((r: StationRow) => ({
    id: r.sname ?? r.id ?? r.name ?? "",
    name: r.sname ?? r.name ?? "",
    plantId: plantId,
  }))
  .filter((s: { id: string; name: string }) => s.id && s.name);

      if (!cancelled) setStationOptions(mapped);
    } catch (err) {
      if (!cancelled) setStationOptions([]);
      console.error("Failed to load stations for selected unit:", err);
      toast.error("Failed to load stations for selected unit.");
    } finally {
      if (!cancelled) setLoadingStationOptions(false);
    }
  })();
  return () => {
    cancelled = true;
  };
}, [orgId, plantId, unitName, orgs, plantOptionsPlan]);

  // Load units for Plan modal when orgId or plantId changes
useEffect(() => {
  setUnitOptions([]);
  setUnitName("");
  if (!orgId || !plantId) return;
  let cancelled = false;

  // --- HERE: Get the display name to send to backend ---
  const orgObj = orgs.find(
    (o) =>
      String(o.id) === String(orgId) || String(o.code) === String(orgId)
  );
  const plantObj = plantOptionsPlan.find(
    (p) => String(p.id) === String(plantId)
  );
  const orgName = orgObj ? orgObj.name : orgId;
  const plantName = plantObj ? plantObj.name : plantId;

  (async () => {
    try {
      // NOW pass display name to backend
      const res: any = await callFunction("public.fn_list_units_by_plant", [
        orgName,
        plantName,
      ]);
      const rows = Array.isArray(res)
        ? res
        : res?.rows ?? res?.data ?? res?.result ?? [];
      const units = rows.map((r: any) => String(r.uname)).filter(Boolean);
      if (!cancelled) setUnitOptions(units);
      if (!cancelled && units.length) setUnitName(units[0]);
    } catch (err) {
      if (!cancelled) setUnitOptions([]);
      console.error("Failed to load units:", err);
      toast.error("Failed to load units for selected plant/organisation.");
    }
  })();
  return () => {
    cancelled = true;
  };
}, [orgId, plantId, orgs, plantOptionsPlan]);

// Fetch shift options from backend for Plan modal (when orgId or plantId changes)
// Fetch shift options from backend for Plan modal (when orgId/plantId/unit changes)
useEffect(() => {
  setPlanShiftOptions([]);
  if (!orgId || !plantId) return;

  let cancelled = false;

  // Resolve org/plant human-readable names (what your DB SPs expect)
  const orgObj = orgs.find(
    (o) => String(o.id) === String(orgId) || String(o.code) === String(orgId)
  );
  const plantObj = plantOptionsPlan.find((p) => String(p.id) === String(plantId));
  const orgName = orgObj ? orgObj.name : String(orgId);
  const plantName = plantObj ? plantObj.name : String(plantId);

  (async () => {
    setLoadingPlanShiftOptions(true);
    try {
      // Try preferred function first (by plant)
      const args1 = [orgName, plantName];
      let res: any;

      try {
        res = await callFunction("public.fn_list_shift_by_plant", args1);
      } catch (e) {
        // Fallback to pluralized variant if your DB uses that
        res = await callFunction("public.fn_list_shifts_by_plant", args1);
      }

      let rows = Array.isArray(res) ? res : res?.rows ?? res?.data ?? res?.result ?? [];

      // If nothing and your schema is unit-aware, try unit function
      if ((!rows || rows.length === 0) && unitName) {
        try {
          const args2 = [orgName, plantName, unitName];
          res = await callFunction("public.fn_list_shift_by_unit", args2);
          rows = Array.isArray(res) ? res : res?.rows ?? res?.data ?? res?.result ?? [];
        } catch {
          // ignore
        }
      }

      // Robust column fallbacks for the shift label
      // Map with robust column fallbacks (typed to avoid unknown[])
const rawShiftNames: string[] = (rows || [])
  .map((r: any) =>
    String(
      r.sf_name ??
      r.shift_name ??
      r.s_name ??
      r.sfname ??
      r.shift ??
      r.type ??
      r.name ??
      ""
    ).trim()
  )
  .filter(Boolean) as string[];

const shiftNames: string[] = [...new Set<string>(rawShiftNames)];


      if (!cancelled) {
        // keep UI usable with a fallback
        setPlanShiftOptions(shiftNames.length ? shiftNames : ["A", "B", "C"]);
        if (!shiftNames.length) {
          console.warn("[Plan] No shifts returned; using A/B/C fallback");
          toast.info("No shifts returned for this plant; showing default A/B/C.");
        }
      }
    } catch (err) {
      if (!cancelled) setPlanShiftOptions(["A", "B", "C"]);
      console.error("Failed to load shifts:", err);
      toast.error("Failed to load shifts for selected plant/organisation.");
    } finally {
      if (!cancelled) setLoadingPlanShiftOptions(false);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [orgId, plantId, unitName, orgs, plantOptionsPlan]);

  // Fetch planned shifts from DB function and map to MappedShift
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPlanned(true);
      try {
        const raw: any = await callFunction(
          "public.fn_list_planned_shifts",
          []
        );
        const rows = normalizeRows(raw);

        const mapped: MappedShift[] = (rows || []).map(
          (r: any, idx: number) => {
            const orgCode = r.org_code ?? "";
            const plantCode = r.plant_code ?? "";
            const stationCode = r.station_code ?? "";
            const shiftName = (String(r.shift ?? "") as ShiftName) || "A";
            const userCodeOrName = String(r.user_code ?? "");

            const orgObj = orgs.find(
              (o) =>
                String(o.code) === String(orgCode) ||
                String(o.id) === String(orgCode)
            );
            const orgNameDisplay = orgObj ? orgObj.name : orgCode;

            const plantObj =
              plantOptionsPlan.find(
                (p) =>
                  String(p.id) === String(plantCode) ||
                  String(p.name) === String(plantCode)
              ) ||
              plantOptionsAdd.find(
                (p) =>
                  String(p.id) === String(plantCode) ||
                  String(p.name) === String(plantCode)
              ) ||
              plants.find(
                (p) =>
                  String(p.id) === String(plantCode) ||
                  String(p.name) === String(plantCode)
              );
            const plantNameDisplay = plantObj ? plantObj.name : plantCode;

            const stationObj =
              stationOptions.find(
                (s) =>
                  String(s.id) === String(stationCode) ||
                  String(s.name) === String(stationCode)
              ) ||
              stations.find(
                (s) =>
                  String(s.id) === String(stationCode) ||
                  String(s.name) === String(stationCode)
              );
            const stationNameDisplay = stationObj
              ? stationObj.name
              : stationCode;

            const employeeFromPool = (
              employeesForPlant.length ? employeesForPlant : employees
            ).find(
              (e) =>
                String(e.u_code ?? e.username ?? e.id) ===
                  String(userCodeOrName) ||
                String(e.id) === String(userCodeOrName) ||
                String(e.name) === String(userCodeOrName)
            );
            const employeeNameDisplay = employeeFromPool
              ? employeeFromPool.name
              : userCodeOrName;

            const dateStr = dayjs().format("DD-MM-YYYY");
            const dayStr = dayjs().format("dddd");

            return {
              id: `${dateStr}-${shiftName}-${stationCode}-${idx}-${Math.random()
                .toString(36)
                .slice(2, 6)}`,
              date: dateStr,
              day: dayStr,
              shiftType: shiftName as ShiftName,
              employeeId: String(userCodeOrName),
              employeeName: employeeNameDisplay,
              plantId: String(plantCode),
              unitName: r.unit_name ?? r.unitName ?? "",
              plantName: plantNameDisplay,
              stationId: String(stationCode),
              stationName: stationNameDisplay,
              orgId: String(orgCode),
              orgName: orgNameDisplay,
              dbRid: r.rid,
            } as MappedShift;
          }
        );

        if (!cancelled) setMappedShifts(mapped);
      } catch (err: any) {
        console.error("Failed to fetch planned shifts:", err);
        toast.error("Failed to load planned shifts.");
      } finally {
        if (!cancelled) setLoadingPlanned(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    plannedRefresh,
    orgs,
    plantOptionsPlan,
    plantOptionsAdd,
    stationOptions,
    employeesForPlant,
  ]);

  // --- NEW: Load 'operator' users from public.list_users2 filtered by organisation (preferred)
  // Fallback to fn_list_employees_by_plant if list_users2 is not available or returns nothing
  useEffect(() => {
    setEmployeesForPlant([]);
    setLoadingEmployeesForPlant(true);

    // require plantId or orgId to scope user dropdown
    if (!orgId && !plantId) {
      setLoadingEmployeesForPlant(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        // Try the centralized user list function first
        const raw: any = await callFunction("public.fn_list_users", []);        const rows = normalizeRows(raw);
       // console.debug("[Users] list_users2 rows:", rows?.length ?? 0);

        // Build identifier set for current orgId (orgId may be rid or org_code depending on your mapping)
        const selectedOrg = orgs.find(
          (o) =>
            String(o.id) === String(orgId) ||
            String(o.code) === String(orgId) ||
            String(o.name) === String(orgId)
        );

        const orgIdentifiers: string[] = [];
        if (selectedOrg) {
          orgIdentifiers.push(String(selectedOrg.id));
          if (selectedOrg.code) orgIdentifiers.push(String(selectedOrg.code));
          if (selectedOrg.name) orgIdentifiers.push(String(selectedOrg.name));
        } else if (orgId) {
          orgIdentifiers.push(String(orgId));
        }

        // Filter to operators and matching organisation
        const operators = (rows || []).filter((r: any) => {
          const rawRole = (r.role_name ?? r.role_nam ?? r.rolecode ?? "")
            .toString()
            .trim()
            .toLowerCase();
          if (rawRole !== "operator") return false;
          if (!orgIdentifiers.length) return true; // no org scope -> return all operators
          const userOrgRaw = String(
            r.org_id ?? r.orgcode ?? r.org ?? ""
          ).trim();
          return orgIdentifiers.some(
            (oid) => String(oid).trim() === userOrgRaw
          );
        });

        console.debug("[Users] filtered operators:", operators?.length ?? 0);

        if ((operators || []).length > 0) {
          const mapped = operators
            .map((r: any) => {
              const firstName = (r.u_first_name ?? r.first_name ?? "")
                .toString()
                .trim();
              const lastName = (r.u_last_name ?? r.last_name ?? "")
                .toString()
                .trim();
              const displayName =
                firstName || lastName
                  ? `${firstName} ${lastName}`.trim()
                  : r.username ?? r.u_email ?? "";
              return {
                id: String(r.u_code ?? r.username ?? r.u_email ?? r.uid ?? ""),
                name: displayName,
                firstName,
                lastName,
                plantId: plantId ? String(plantId) : "",
                username: String(r.username ?? ""),
                u_code: String(r.u_code ?? ""),
              };
            })
            .filter((e: any) => e.id && e.name);

          if (!cancelled) setEmployeesForPlant(mapped);
          setLoadingEmployeesForPlant(false);
          return;
        }

        // If list_users2 returned none (or we didn't find operators), fall back to plant-specific function
        console.debug(
          "[Users] list_users2 returned no operators for org; falling back to fn_list_employees_by_plant"
        );
        throw new Error("No operators found via list_users2");
      } catch (err) {
        // Fallback block: call your old fn_list_employees_by_plant which takes plantId
        try {
          if (!plantId) {
            if (!cancelled) setEmployeesForPlant([]);
            return;
          }
          const arg = Number.isFinite(Number(plantId))
            ? Number(plantId)
            : plantId;
          const res: any = await callFunction(
            "public.fn_list_employees_by_plant",
            [arg]
          );
          const rows = normalizeRows(res);
          const mapped = (rows || [])
            .map((r: any) => {
              const firstName = (
                r.emp_first_name ??
                r.u_first_name ??
                r.first_name ??
                ""
              )
                .toString()
                .trim();
              const lastName = (
                r.emp_last_name ??
                r.u_last_name ??
                r.last_name ??
                ""
              )
                .toString()
                .trim();
              const displayName =
                firstName || lastName
                  ? `${firstName} ${lastName}`.trim()
                  : r.emp_name ?? r.name ?? r.display_name ?? r.username ?? "";
              return {
                id: String(
                  r.emp_id ?? r.id ?? r.uid ?? r.emp_code ?? r.username ?? ""
                ),
                name: displayName,
                firstName,
                lastName,
                plantId: String(plantId),
                username: String(r.username ?? ""),
                u_code: String(r.emp_code ?? r.u_code ?? ""),
              };
            })
            .filter((e: any) => e.id && e.name);

          if (!cancelled) setEmployeesForPlant(mapped);
        } catch (innerErr) {
          console.error(
            "Failed to fetch employees (both list_users2 and fn_list_employees_by_plant failed):",
            innerErr
          );
          if (!cancelled) setEmployeesForPlant([]);
          toast.error("Failed to load users for selected plant/organisation.");
        } finally {
          if (!cancelled) setLoadingEmployeesForPlant(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orgId, plantId, orgs]);

  // Edit handler (unchanged)
  // Edit handler
  const handleEdit = (id: string) => {
    const selected = mappedShifts.find((m) => m.id === id);
    if (!selected) return;

    // Prefill modal fields from selected row
    setPlantId(selected.plantId ? String(selected.plantId) : "");
    setStationId(selected.stationId ? String(selected.stationId) : "");
    setPlDate(dayjs(selected.date, "DD-MM-YYYY").format("YYYY-MM-DD"));
    setModalShiftType(selected.shiftType ?? "");
    setModalUserId(selected.employeeName ?? "");
    setEditShiftGroup([selected]);

    // set DB id for update
    setEditRid(selected.dbRid ? Number(selected.dbRid) : null);

    setShowMapModal(true);
  };

  // Field change helper
  const handleFieldChange = (
    index: number,
    key: keyof Shift,
    value: string
  ) => {
    setFormShifts((prev) => {
      const updated = [...prev];
      (updated[index] as any)[key] = value;
      return updated;
    });
  };

  // Open Add Shift modal: clear add-specific state
  const openAddShiftModal = () => {
    setFormShifts([
      {
        id: "",
        type: "A",
        dayStart: "Day 1",
        startTime: "",
        dayEnd: "Day 1",
        endTime: "",
      },
      {
        id: "",
        type: "B",
        dayStart: "Day 1",
        startTime: "",
        dayEnd: "Day 1",
        endTime: "",
      },
      {
        id: "",
        type: "C",
        dayStart: "Day 1",
        startTime: "",
        dayEnd: "Day 2",
        endTime: "",
      },
    ]);
    setAddOrgId("");
    setAddPlantId("");
    setPlantOptionsAdd([]);
    setShowAddShiftModal(true);
  };

  // Open Plan Shift modal: if there's an org selected in Add modal, default to that org (convenience)
  const openPlanShiftModal = () => {
    if (addOrgId) {
      console.debug("Opening Plan modal with addOrgId:", addOrgId);
      setOrgId(addOrgId);
    }
    setEditRid(null);
    setShowMapModal(true);
  };

  // Confirm modal helpers
  const openConfirmModal = (
    mode: ConfirmMode,
    message: string,
    payload?: any
  ) => setConfirmState({ visible: true, mode, message, payload });
  const closeConfirmModal = () =>
    setConfirmState({ visible: false, mode: null, message: "", payload: null });

  const onConfirm = async () => {
    if (!confirmState.mode) {
      closeConfirmModal();
      return;
    }

    try {
      if (confirmState.mode === "delete") {
        // If the payload contains a rid -> this is a planned-shift delete request
        if (confirmState.payload && confirmState.payload.rid) {
          await handleDeletePlannedShift(confirmState.payload.rid);
        } else {
          // existing deletion for created shifts
          await performConfirmedDelete(confirmState.payload);
        }
      } else if (confirmState.mode === "update") {
        await performConfirmedUpdate(confirmState.payload);
      }
    } catch (err: any) {
      console.error("Error during confirm action:", err);
    } finally {
      closeConfirmModal();
    }
  };

  // Delete a planned shift by DB rid (calls the SP you created)
  const handleDeletePlannedShift = async (ridToDelete: number | string) => {
    if (!ridToDelete) {
      toast.error("Missing record id (rid).");
      return;
    }
    try {
      // call the SP that deletes by rid
      await callProcedure("public.ti_fc_sp_delete_planned_shift", [
        Number(ridToDelete),
      ]);
      toast.success("Planned shift deleted.");
      // refresh the planned-shifts list from DB (ensure you added plannedRefresh state earlier)
      setPlannedRefresh((p) => p + 1);
    } catch (err: any) {
      console.error("Failed to delete planned shift:", err);
      toast.error(`Delete failed: ${err?.message || err}`);
    }
  };

  // Delete / Update functions unchanged
  const performConfirmedDelete = async (s: Shift) => {
    try {
      const orgName =
        s.orgName || orgsForAdd.find((o) => o.id === s.orgId)?.name || "";
      if (!orgName) {
        toast.error("Organisation name not available for delete.");
        return;
      }
      await callProcedure("public.ti_fc_sp_delete_shift_details", [
        s.type,
        orgName,
      ]);
      setShifts((prev) => prev.filter((sh) => sh.id !== s.id));
      toast.success(`Shift ${s.type} deleted (soft-delete).`);
    } catch (err: any) {
      console.error("Failed to delete shift:", err);
      toast.error(`Failed to delete shift: ${err?.message || err}`);
    }
  };

  const performConfirmedUpdate = async (payload: any) => {
    try {
      const { fs, orgName } = payload;
      const startTimeStr = `${fs.startTime}:00`;
      const endTimeStr = `${fs.endTime}:00`;
      await callProcedure("public.ti_fc_sp_update_shift_details", [
        fs.type,
        startTimeStr,
        endTimeStr,
        orgName,
      ]);
      setShifts((prev) =>
        prev.map((sh) =>
          sh.id === fs.id
            ? { ...sh, startTime: fs.startTime, endTime: fs.endTime }
            : sh
        )
      );
      setShowAddShiftModal(false);
      setFormShifts([]);
      setAddOrgId("");
      setPlantOptionsAdd([]);
      toast.success(`Shift ${fs.type} updated successfully.`);
    } catch (err: any) {
      console.error("Failed to update shift:", err);
      toast.error(`Failed to update shift: ${err?.message || err}`);
    }
  };

  // Save shifts (add modal) unchanged
  const saveShifts = async () => {
    if (!addOrgId) {
      toast.error("Please select an Organisation before saving shifts.");
      return;
    }
    for (let i = 0; i < formShifts.length; i++) {
      const fs = formShifts[i];
      if (!fs.startTime || !fs.endTime) {
        toast.error("Please provide Start and End times for all shifts.");
        return;
      }
    }
    const orgObj = orgsForAdd.find(
      (o) =>
        String(o.id) === String(addOrgId) || String(o.code) === String(addOrgId)
    );
    if (!orgObj) {
      console.error("Organisation lookup failed in saveShifts()", {
        addOrgId,
        orgsForAdd,
      });
      toast.error(
        "Organisation name not found. Please re-select the organisation."
      );
      return;
    }
    const orgName = orgObj.name;
    try {
      const isEditing =
        formShifts.length === 1 &&
        !!formShifts[0].id &&
        shifts.some((sh) => sh.id === formShifts[0].id);
      if (isEditing) {
        openConfirmModal(
          "update",
          `Confirm update shift ${formShifts[0].type}?`,
          { fs: formShifts[0], orgName }
        );
        return;
      }

      // -- Get plant name from plantOptionsAdd, matching addPlantId
const plantObj = plantOptionsAdd.find(p => String(p.id) === String(addPlantId));
const plantName = plantObj ? plantObj.name : addPlantId; // fallback

for (const fs of formShifts) {
  const startTimeStr = fs.startTime; // "HH:mm" (time input returns correct format)
  const endTimeStr = fs.endTime;
  await callProcedure("public.ti_fc_sp_insert_shift_details2", [
    orgName,        // Organisation name
    plantName,      // Plant name
    fs.type,        // Shift name
    startTimeStr,   // Start time (time string)
    endTimeStr      // End time (time string)
  ]);
}

      const newShiftsLocal = formShifts.map((fs) => ({
        ...fs,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        orgId: addOrgId,
        orgName,
      }));
      setShifts((prev) => [...prev, ...newShiftsLocal]);
      setShowAddShiftModal(false);
      setFormShifts([]);
      setAddOrgId("");
      setPlantOptionsAdd([]);
      setAddPlantId("");
      toast.success("Shifts saved successfully (organisation only).");
    } catch (err: any) {
      console.error("Failed to save shifts:", err);
      toast.error(`Failed to save shifts: ${err?.message || err}`);
    }
  };

  // Plan modal local state
  const [modalShiftType, setModalShiftType] = useState<ShiftName | "">("");
  const [modalUserId, setModalUserId] = useState<string>("");

  const handleConfirmEditPlannedShift = async () => {
    if (!editRid) {
      toast.error("Missing record id (rid).");
      return;
    }

    // Build new values to send
    const newUser = String(modalUserId ?? "");
    const stationObj = stationOptions.find(
      (s) => String(s.id) === String(stationId)
    );
    const newStation = stationObj ? stationObj.name : String(stationId ?? "");

    if ((!newUser || newUser === "") && (!newStation || newStation === "")) {
      toast.error("Please select a user or station to update.");
      return;
    }

    try {
      await callProcedure("public.ti_fc_sp_update_planned_shifts", [
        Number(editRid),
        newStation,
        newUser,
      ]);
      toast.success("Planned shift updated.");
      // refresh data from DB
      setPlannedRefresh((p) => p + 1);

      // reset modal + edit state
      setModalShiftType("");
      setModalUserId("");
      setPlDate(todayISO);
      setPlantId("");
      setStationId("");
      setEditShiftGroup(null);
      setEditRid(null);
      setEmployeesForPlant([]);
      setStationOptions([]);
      setShowMapModal(false);
    } catch (err: any) {
      console.error("Failed to update planned shift:", err);
      toast.error(`Update failed: ${err?.message || err}`);
    }
  };

  // Save planned shift (calls your new DB function fn_insert_planned_shift_by_names)
  // Replace the entire handleSavePlannedShift function with this
  const handleSavePlannedShift = async () => {
    if (!orgId) {
      toast.error("Please select an Organisation (Plan).");
      return;
    }
    if (!plantId) {
      toast.error("Please select a Plant.");
      return;
    }
    if (!stationId) {
      toast.error("Please select a Station.");
      return;
    }
    if (!modalShiftType) {
      toast.error("Please select a Shift.");
      return;
    }
    if (!modalUserId) {
      toast.error("Please select a User.");
      return;
    }

    try {
      // Resolve display names (fall back sensibly if not available)
      const orgObj = orgs.find(
        (o) =>
          String(o.id) === String(orgId) || String(o.code) === String(orgId)
      );
      const orgName = orgObj?.name ?? String(orgId ?? "");

      const plantObj = plantOptionsPlan.find(
        (p) => String(p.id) === String(plantId)
      );
      const plantName =
        plantObj?.name ??
        plants.find((p) => String(p.id) === String(plantId))?.name ??
        String(plantId ?? "");

      const stationObj = stationOptions.find(
        (s) => String(s.id) === String(stationId)
      );
      const stationName =
        stationObj?.name ??
        filteredStations.find((s) => String(s.id) === String(stationId))
          ?.name ??
        String(stationId ?? "");

      // Build a user identifier to send:
      // We expect the select value to be u_code/username if available; otherwise we attempt first+last or display name.
      const pool = employeesForPlant.length ? employeesForPlant : employees;
      const emp = pool.find(
        (e) =>
          String(e.name) === String(modalUserId) ||
          String((e as any).u_code ?? (e as any).username ?? e.id) ===
            String(modalUserId) ||
          String(e.id) === String(modalUserId)
      );

      // Since we want to push the selected display name directly, prefer modalUserId (which now holds the name)
      let userToSend = String(modalUserId ?? "").trim();

      // fallback: if modalUserId was empty for some reason, use emp.name or emp.id
      if ((!userToSend || userToSend === "undefined") && emp) {
        userToSend = emp.name ?? String(emp.id);
      }

      const pShift = String(modalShiftType ?? "")
        .trim()
        .toUpperCase();

      // sanity check
      if (!orgName || !plantName || !stationName || !userToSend || !pShift) {
        toast.error(
          "Missing values. Please ensure Organisation, Plant, Station, Shift and User are selected."
        );
        return;
      }

      // Build args array and log it for debugging
      const argsToSend = [orgName, plantName, unitName, stationName, pShift, userToSend];
      console.log("[Plan] Sending SP args array ->", argsToSend);

      // Call the stored procedure (positional args)
      await callProcedure("public.ti_fc_sp_insert_planned_shifts", argsToSend);

      // Build local mapped preview object (fulfill the MappedShift interface)
      const employee = emp ??
        (employeesForPlant.length ? employeesForPlant[0] : employees[0]) ?? {
          id: String(modalUserId),
          name: userToSend,
        };
      const plantDisplay = plantName;
      const stationDisplay = stationName;
      const newMapped: MappedShift = {
        id: `${plDate}-${modalShiftType}-${modalUserId}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        date: dayjs(plDate).format("DD-MM-YYYY"),
        day: dayjs(plDate).format("dddd"),
        shiftType: modalShiftType as ShiftName,
        employeeId: modalUserId,
        employeeName: employee?.name || userToSend || "",
        plantId: String(plantId),
        plantName: plantDisplay,
        stationId: String(stationId),
        stationName: stationDisplay,
        orgId: String(orgObj?.id ?? orgId ?? ""),
        orgName: String(orgObj?.name ?? orgName ?? ""),
      };

      setMappedShifts((prev) => [
        ...prev.filter(
          (m) =>
            !(
              m.date === newMapped.date &&
              m.plantId === newMapped.plantId &&
              m.stationId === newMapped.stationId &&
              m.shiftType === newMapped.shiftType
            )
        ),
        newMapped,
      ]);

      toast.success("Planned shift saved (inserted in DB).");
      // refresh from DB so UI reflects the real table
      setPlannedRefresh((p) => p + 1);

      // reset modal state
      setModalShiftType("");
      setModalUserId("");
      setPlDate(todayISO);
      setPlantId("");
      setStationId("");
      setOrgId("");
      setEmployeesForPlant([]);
      setStationOptions([]);
      setShowMapModal(false);
    } catch (err: any) {
      console.error("Failed to save planned shift via SP:", err);
      toast.error(`Failed to save planned shift: ${err?.message || err}`);
    }
  };

  // When clicking Plan Shift button we call this to open modal
  const handleOpenPlan = () => {
    openPlanShiftModal();
  };

  // Delete confirm for created shifts (unchanged)
  const onDeleteButtonClicked = (s: Shift) => {
    openConfirmModal(
      "delete",
      `Are you sure you want to delete shift ${s.type} for ${
        s.orgName || "this organisation"
      }?`,
      s
    );
  };

  // UI
  return (
    <div className="h-screen bg-blue-50 py-2 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-blue-900">Shift Management</h2>
          <div className="space-x-2">
            <button
              onClick={openAddShiftModal}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Shift
            </button>
            <button
              onClick={handleOpenPlan}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
            >
              Plan Shift
            </button>
          </div>
        </div>

        {/* ADD SHIFT MODAL (Add modal uses orgsForAdd -> plantOptionsAdd) */}
        {showAddShiftModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-3xl space-y-4 shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Add Shift</h3>
                <button
                  onClick={() => setShowAddShiftModal(false)}
                  className="text-gray-400 text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Organisation
                  </label>
                  <select
                    className="border rounded px-3 py-2 w-full"
                    value={addOrgId}
                    onChange={(e) => setAddOrgId(String(e.target.value))}
                  >
                    <option value="">
                      {loadingOrgsForAdd
                        ? "Loading organisations..."
                        : "Select Organisation"}
                    </option>
                    {orgsForAdd.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Plant
                  </label>
                  <select
                    className="border rounded px-3 py-2 w-full"
                    value={addPlantId}
                    onChange={(e) => setAddPlantId(String(e.target.value))}
                    disabled={!addOrgId || loadingPlantOptionsAdd}
                  >
                    <option value="">
                      {loadingPlantOptionsAdd
                        ? "Loading plants…"
                        : !addOrgId
                        ? "Select Org first"
                        : "Select Plant"}
                    </option>
                    {plantOptionsAdd.map((p) => (
                      <option key={String(p.id)} value={String(p.id)}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-400 mt-1">
                    Plants shown are filtered by the Organisation selected
                    above.
                  </div>
                </div>
                <div /> {/* placeholder */}
              </div>

              <div className="grid grid-cols-5 gap-4 font-semibold">
                <div>Shift</div>
                <div>Start Day</div>
                <div>Start Time</div>
                <div>End Day</div>
                <div>End Time</div>
              </div>

              {formShifts.map((fs, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 items-center"
                >
                  <select
                    className="border rounded px-2 py-1"
                    value={fs.type}
                    onChange={(e) =>
                      handleFieldChange(index, "type", e.target.value)
                    }
                  >
                    {shiftOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border rounded px-2 py-1"
                    value={fs.dayStart}
                    onChange={(e) =>
                      handleFieldChange(index, "dayStart", e.target.value)
                    }
                  >
                    {dayOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className="border rounded px-2 py-1"
                    value={fs.startTime}
                    onChange={(e) =>
                      handleFieldChange(index, "startTime", e.target.value)
                    }
                  />
                  <select
                    className="border rounded px-2 py-1"
                    value={fs.dayEnd}
                    onChange={(e) =>
                      handleFieldChange(index, "dayEnd", e.target.value)
                    }
                  >
                    {dayOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className="border rounded px-2 py-1"
                    value={fs.endTime}
                    onChange={(e) =>
                      handleFieldChange(index, "endTime", e.target.value)
                    }
                  />
                </div>
              ))}

              <div className="text-right">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={saveShifts}
                  disabled={!addOrgId}
                >
                  Save Shifts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAN SHIFT MODAL */}
        {showMapModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-xl p-6 shadow-lg">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Plan Single Shift</h3>
                <button
                  onClick={() => {
                    setModalShiftType("");
                    setModalUserId("");
                    setPlDate(todayISO);
                    setPlantId("");
                    setStationId("");
                    setEditShiftGroup(null);
                    setShowMapModal(false);
                    setOrgId("");
                    setEditRid(null);
                  }}
                  className="text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Organisation selector added here to avoid showing wrong plants */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Organisation
                  </label>
                  <select
                    value={orgId}
                    onChange={(e) => setOrgId(String(e.target.value))}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">
                      {orgs.length
                        ? "Select Organisation"
                        : "Loading Organisations..."}
                    </option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-400 mt-1">
                    Choose organisation first — Plant list is filtered by this.
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Plant
                  </label>
                  <select
                    value={plantId !== "" ? String(plantId) : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      console.debug("[Plan Modal] plant changed:", val);
                      setPlantId(val);
                      setStationId("");
                      setModalUserId("");
                    }}
                    className="w-full border px-3 py-2 rounded"
                    disabled={!orgId || loadingPlantOptionsPlan}
                  >
                    <option value="">
                      {loadingPlantOptionsPlan
                        ? "Loading plants…"
                        : !orgId
                        ? "Select Organisation first"
                        : "Select Plant"}
                    </option>
                    {(plantOptionsPlan.length ? plantOptionsPlan : plants).map(
                      (p) => (
                        <option key={String(p.id)} value={String(p.id)}>
                          {p.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                 {/* --- UNIT DROPDOWN (add here) --- */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1">Unit</label>
    <select
      value={unitName}
      onChange={e => setUnitName(e.target.value)}
      className="w-full border px-3 py-2 rounded"
      disabled={!plantId || !unitOptions.length}
    >
      <option value="">
        {unitOptions.length ? "Select Unit" : "No units"}
      </option>
      {unitOptions.map(u => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
    <div className="text-xs text-gray-400 mt-1">
      Units depend on Plant and Organisation.
    </div>
  </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Station
                  </label>
                  <select
                    value={stationId !== "" ? String(stationId) : ""}
                    onChange={(e) => setStationId(String(e.target.value))}
                    className="w-full border px-3 py-2 rounded"
                    disabled={!plantId || loadingStationOptions}
                  >
                    <option value="">
                      {loadingStationOptions
                        ? "Loading stations…"
                        : !plantId
                        ? "Select Plant first"
                        : "Select Station"}
                    </option>
                    {(stationOptions.length
                      ? stationOptions
                      : filteredStations
                    ).map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Shift
                  </label>
                  <select
  value={modalShiftType}
  onChange={e => setModalShiftType(e.target.value as any)}
  className="w-full border px-3 py-2 rounded"
  disabled={!plantId || loadingPlanShiftOptions}
>
  <option value="">
    {loadingPlanShiftOptions
      ? "Loading shifts…"
      : !plantId
      ? "Select Plant first"
      : "Select Shift"}
  </option>
  {planShiftOptions.map(sh => (
    <option key={sh} value={sh}>
      {sh}
    </option>
  ))}
</select>

                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">User</label>
                  <select
                    value={modalUserId}
                    onChange={(e) => setModalUserId(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    disabled={!plantId || loadingEmployeesForPlant}
                  >
                    <option value="">
                      {loadingEmployeesForPlant
                        ? "Loading users…"
                        : !plantId
                        ? "Select Plant first"
                        : "Select User"}
                    </option>
                    {filteredEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
  {emp.name}
</option>

                    ))}
                  </select>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => {
                    setModalShiftType("");
                    setModalUserId("");
                    setPlDate(todayISO);
                    setPlantId("");
                    setStationId("");
                    setEditShiftGroup(null);
                    setShowMapModal(false);
                    setOrgId("");
                  }}
                  className="px-4 py-2 rounded border mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editRid) handleConfirmEditPlannedShift();
                    else handleSavePlannedShift();
                  }}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* rest of page (Created Shifts and Planned Shifts lists) unchanged */}
        <div className="bg-white rounded-2xl shadow-md px-5 py-3 border border-gray-100 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Created Shifts
            </h3>
            {shifts.length > 0 && (
              <span className="text-sm text-gray-500">
                {shifts.length} total
              </span>
            )}
          </div>

          {shifts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">
              No shifts created yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr className="text-blue-800">
                    <th className="px-5 py-3 text-left font-semibold">Shift</th>
                    <th className="px-5 py-3 text-left font-semibold text-sm" >
                      Timing
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {s.type}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {s.dayStart} {s.startTime} → {s.dayEnd} {s.endTime}
                        {s.orgName ? (
                          <div className="text-xs text-gray-500 mt-1">
                            Org: {s.orgName}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => {
                            setFormShifts([s]);
                            if (s.orgId) setAddOrgId(s.orgId);
                            else if (s.orgName) {
                              const found = orgsForAdd.find(
                                (o) => o.name === s.orgName
                              );
                              if (found) setAddOrgId(found.id);
                            }
                            setShowAddShiftModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium transition mr-4"
                        >
                          Edit
                        </button>

                        {/* created-shift delete - call the existing handler for shifts */}
                        <button
                          onClick={() => onDeleteButtonClicked(s)}
                          className="text-red-500 hover:text-red-600 font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg px-5 py-3 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Planned Shifts
            </h3>
            {mappedShifts.length > 0 && (
              <span className="text-sm text-gray-500">
                {mappedShifts.length} total
              </span>
            )}
          </div>
          {mappedShifts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">
              No shifts planned yet.
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-blue-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Day</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Shift</th>
                    <th className="px-5 py-3 text-left font-semibold text-sm">
                      Employee
                    </th>
                    <th className="px-5 py-3 text-left font-semibold text-sm">
                      Organisation
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">Plant</th>
                    <th className="px-5 py-3 text-left font-semibold">Unit</th>
                    <th className="px-5 py-3 text-left font-semibold text-sm">
                      Station
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {mappedShifts.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-800 text-sm">{m.day}</td>
                      <td className="px-5 py-3 text-gray-800 text-sm">{m.date}</td>
                      <td className="px-5 py-3 text-gray-800 text-sm">{m.shiftType}</td>
                      <td className="px-5 py-3 text-gray-800 text-sm">
                        {m.employeeName}
                      </td>
                      <td className="px-5 py-3 text-gray-800 text-sm">
                        {m.orgName || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-800 text-sm">{m.plantName}</td>
                      <td className="px-5 py-3 text-gray-800 text-sm">{m.unitName || "-"}</td>
                      <td className="px-5 py-3 text-gray-800 text-sm">
                        {m.stationName}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => handleEdit(m.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition mr-4"
                        >
                          Edit
                        </button>
                        {/* Planned-shift delete: open confirm modal and pass rid in payload */}
                        <button
                          onClick={() =>
                            openConfirmModal(
                              "delete",
                              `Delete planned shift for ${m.employeeName} on ${m.date}?`,
                              { rid: m.dbRid }
                            )
                          }
                          className="text-red-500 hover:text-red-600 font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmState.visible && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h4 className="text-lg font-semibold mb-3">Please confirm</h4>
            <p className="text-sm text-gray-700 mb-6">{confirmState.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default ShiftsPage;