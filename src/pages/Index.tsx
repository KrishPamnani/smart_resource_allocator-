import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, ClipboardList, Filter, LayoutDashboard, MapPin, Radio, Search, Settings, TrendingUp, Users, FileText, Waves, Wifi } from "lucide-react";
import { Marker, NavigationControl } from "react-map-gl/maplibre";

import { Button } from "@/components/ui/button";
import { Map, type MapRef } from "@/components/ui/map";
import aishaImg from "@/assets/volunteer-aisha.jpg";
import danielImg from "@/assets/volunteer-daniel.jpg";
import josephImg from "@/assets/volunteer-joseph.jpg";
import meeraImg from "@/assets/volunteer-meera.jpg";

type Need = {
  id: number;
  title: string;
  zone: string;
  score: number;
  reports: number;
  coordinates: [number, number];
  impacted: number;
  type: string;
};

const needs: Need[] = [
  { id: 8421, title: "Water Shortage - Ward 4", zone: "Red Zone", score: 9.2, reports: 28, coordinates: [77.209, 28.6139], impacted: 1240, type: "Water" },
  { id: 8417, title: "Food insecurity cluster", zone: "North Camp", score: 8.6, reports: 19, coordinates: [77.225, 28.623], impacted: 870, type: "Food" },
  { id: 8398, title: "Mobile clinic requested", zone: "River Block", score: 7.8, reports: 14, coordinates: [77.196, 28.604], impacted: 430, type: "Healthcare" },
];

const volunteers = [
  { name: "Aisha Rahman", occupation: "Community Health Nurse", experience: "6 yrs", distance: "1.2 km", match: 96, language: "Local Dialect", status: "Available", image: aishaImg },
  { name: "Daniel Okoro", occupation: "Water Systems Engineer", experience: "8 yrs", distance: "1.8 km", match: 94, language: "Hindi + English", status: "Available", image: danielImg },
  { name: "Meera Patel", occupation: "Logistics Coordinator", experience: "5 yrs", distance: "2.4 km", match: 91, language: "Local Dialect", status: "On standby", image: meeraImg },
  { name: "Joseph Kamau", occupation: "Paramedic", experience: "7 yrs", distance: "3.1 km", match: 88, language: "English", status: "Available", image: josephImg },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Needs Map", icon: MapPin },
  { label: "Volunteer Directory", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Impacted", value: "12,540", detail: "+18% this week", icon: TrendingUp, tone: "bg-primary text-primary-foreground" },
  { label: "Active Tasks", value: "186", detail: "42 critical", icon: ClipboardList, tone: "bg-destructive text-destructive-foreground" },
  { label: "Volunteer Utilization", value: "78%", detail: "312 responders", icon: Users, tone: "bg-accent text-accent-foreground" },
];

const Index = () => {
  const mapRef = useRef<MapRef>(null);
  const [selectedNeed, setSelectedNeed] = useState(needs[0]);
  const [mapStyle, setMapStyle] = useState<"default" | "openstreetmap" | "openstreetmap3d">("openstreetmap");
  const styles = useMemo(
    () => ({
      default: undefined,
      openstreetmap: "https://tiles.openfreemap.org/styles/bright",
      openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
    }),
    [],
  );

  useEffect(() => {
    mapRef.current?.easeTo({ center: selectedNeed.coordinates, zoom: 12.4, pitch: mapStyle === "openstreetmap3d" ? 60 : 0, duration: 500 });
  }, [selectedNeed, mapStyle]);

  return (
    <main className="min-h-screen bg-field-gradient text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-card/85 p-5 shadow-soft backdrop-blur lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft"><Waves className="size-5" /></div>
            <div><p className="text-sm font-semibold">ReliefGrid</p><p className="text-xs text-muted-foreground">Impact Command</p></div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button key={item.label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-secondary ${index === 0 ? "bg-secondary font-semibold text-primary" : "text-muted-foreground"}`}>
                <item.icon className="size-4" />{item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div><p className="text-sm font-semibold text-primary">Intelligence Command Center</p><h1 className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-4xl">Real-time Relief Operations Map</h1></div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-64 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-soft"><Search className="size-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Search issues, wards, volunteers</span></div>
              <button className="relative rounded-lg border border-border bg-card p-3 shadow-soft"><Bell className="size-4" /><span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" /></button>
            </div>
          </header>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className={`${stat.tone} rounded-lg p-4 shadow-panel`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <p className="text-3xl font-semibold tracking-normal">{stat.value}</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-card/20"><stat.icon className="size-5" /></div>
                </div>
                <p className="mt-3 text-xs font-medium opacity-90">{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div><p className="font-semibold">Live Map</p><p className="text-sm text-muted-foreground">Cluster markers update the priority feed by viewport</p></div>
                <select value={mapStyle} onChange={(event) => setMapStyle(event.target.value as typeof mapStyle)} className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-soft">
                  <option value="default">Default (Carto)</option><option value="openstreetmap">OpenStreetMap</option><option value="openstreetmap3d">OpenStreetMap 3D</option>
                </select>
              </div>
              <div className="relative h-[500px]">
                <Map ref={mapRef} mapStyle={styles[mapStyle]} initialViewState={{ longitude: 77.209, latitude: 28.6139, zoom: 11.4 }}>
                  <NavigationControl position="bottom-right" />
                  {needs.map((need) => <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="center"><button onClick={() => setSelectedNeed(need)} className="relative flex size-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-panel transition hover:scale-110"><span className="absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-pulse-ring" /><span className="relative text-xs font-bold">{need.score}</span></button></Marker>)}
                </Map>
                <div className="absolute left-4 top-4 rounded-lg border border-border bg-card/95 p-4 shadow-soft backdrop-blur"><p className="text-sm font-semibold">{selectedNeed.zone}</p><p className="text-xs text-muted-foreground">Coordinates: [{selectedNeed.coordinates.join(", ")}]</p></div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between"><p className="font-semibold">Priority Feed</p><Filter className="size-4 text-muted-foreground" /></div>
                <div className="space-y-3">{needs.map((need) => <button key={need.id} onClick={() => setSelectedNeed(need)} className={`w-full rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${selectedNeed.id === need.id ? "border-primary bg-secondary" : "border-border bg-background"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{need.title}</p><p className="text-xs text-muted-foreground">#{need.id} · {need.reports} field reports · {need.impacted} impacted</p></div><span className="rounded-md bg-alert-gradient px-2 py-1 text-xs font-bold text-destructive-foreground">{need.score}/10</span></div></button>)}</div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-soft animate-slide-up">
                <p className="text-sm font-semibold text-primary">Issue #{selectedNeed.id}: {selectedNeed.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">AI summary: multiple field reports indicate urgent {selectedNeed.type.toLowerCase()} support needs in {selectedNeed.zone}, with vulnerable households requiring dispatch within 4 hours.</p>
                <div className="mt-4 flex gap-2"><Button variant="command" className="flex-1">Dispatch Resources</Button><Button variant="quiet" size="icon"><Radio className="size-4" /></Button></div>
              </div>
            </aside>
          </div>

          <section className="mt-6 rounded-lg border border-border bg-panel-gradient p-4 shadow-panel">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Recommended Volunteers Near Affected Area</p><p className="text-sm text-muted-foreground">Compact match list ranked by proximity, skill, and language fit</p></div><Button variant="command"><CheckCircle2 className="size-4" />Assign All</Button></div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {volunteers.map((volunteer) => <article key={volunteer.name} className="rounded-lg border border-border bg-card p-3 shadow-soft transition hover:-translate-y-0.5 hover:border-primary hover:shadow-panel"><div className="flex items-center gap-3"><img src={volunteer.image} alt={`${volunteer.name}, ${volunteer.occupation}`} width={96} height={96} loading="lazy" className="size-14 shrink-0 rounded-lg object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h2 className="truncate text-sm font-semibold">{volunteer.name}</h2><p className="truncate text-xs text-muted-foreground">{volunteer.occupation}</p></div><span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-primary">{volunteer.match}%</span></div><div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs"><p><span className="text-muted-foreground">Dist:</span> <span className="font-semibold">{volunteer.distance}</span></p><p><span className="text-muted-foreground">Exp:</span> <span className="font-semibold">{volunteer.experience}</span></p><p className="col-span-2 truncate"><span className="text-muted-foreground">Lang:</span> <span className="font-semibold">{volunteer.language}</span></p></div></div></div></article>)}
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {["Report Needs", "My Tasks", "Sync Status"].map((label, index) => <button key={label} className="rounded-lg border border-border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary"><ClipboardList className="mb-3 size-5 text-primary" /><p className="font-semibold">{label}</p><p className="text-sm text-muted-foreground">{index === 2 ? "OCR digitized · waiting for connectivity" : "Offline-first field workflow ready"}</p>{index === 2 && <div className="mt-3 flex items-center gap-2 text-sm text-primary"><Wifi className="size-4" />Sync queued</div>}</button>)}
          </section>
        </section>
      </div>
    </main>
  );
};

export default Index;