import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BriefcaseMedical,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Crosshair,
  DatabaseZap,
  FileText,
  Gauge,
  HandHeart,
  LayoutDashboard,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Users,
  Waves,
} from "lucide-react";
import { Marker } from "react-map-gl/maplibre";

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
  { id: 8421, title: "Needs Detail & Match", zone: "Dharavi Relief Grid", score: 9.2, reports: 257, coordinates: [72.8553, 19.038], impacted: 142, type: "Water" },
  { id: 8417, title: "Needs Detail & Match", zone: "Kurla Transit Camp", score: 9.3, reports: 209, coordinates: [72.8796, 19.0726], impacted: 118, type: "Food" },
  { id: 8398, title: "Needs Detail & Match", zone: "Sion Medical Line", score: 8.9, reports: 99, coordinates: [72.8611, 19.044], impacted: 76, type: "Healthcare" },
  { id: 8374, title: "Needs Detail & Match", zone: "Mahim Coastal Block", score: 9.1, reports: 39, coordinates: [72.8401, 19.0427], impacted: 64, type: "Logistics" },
];

const volunteers = [
  { name: "Dr. Jane Doe", occupation: "Field Medic", experience: "5+ Years", distance: "1.2 km away", match: 96, image: aishaImg },
  { name: "Aisha Rahman", occupation: "Community Nurse", experience: "6+ Years", distance: "1.8 km away", match: 94, image: danielImg },
  { name: "Meera Patel", occupation: "Logistics Lead", experience: "5+ Years", distance: "2.4 km away", match: 91, image: meeraImg },
  { name: "Joseph Kamau", occupation: "Rescue Paramedic", experience: "7+ Years", distance: "3.1 km away", match: 88, image: josephImg },
];

const navTop = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Needs Map", icon: MapPin, active: true },
  { label: "Volunteer Directory", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Needs Handling", icon: ClipboardList },
  { label: "Finance", icon: DatabaseZap },
  { label: "Teams", icon: HandHeart },
];

const quickStats = [
  { label: "TOTAL IMPACTED", value: "142", detail: "+ 12.73%", icon: ArrowUpRight, tone: "bg-primary text-primary-foreground", iconTone: "bg-primary-foreground/15" },
  { label: "ACTIVE TASKS", value: "892", detail: "+ 30.32%", icon: ArrowUpRight, tone: "bg-secondary text-secondary-foreground", iconTone: "bg-primary/10" },
  { label: "VOLUNTEER UTILIZATION", value: "78.5%", detail: "Live capacity", icon: Gauge, tone: "bg-muted text-foreground", iconTone: "bg-card" },
  { label: "DATA ACCURACY INDEX", value: "98.4", detail: "Verified", icon: CheckCircle2, tone: "bg-accent text-accent-foreground", iconTone: "bg-card/50" },
];

const projects = [
  { name: "Relief kitchens", start: "col-start-1", span: "col-span-4", tone: "bg-primary" },
  { name: "Medical tents", start: "col-start-2", span: "col-span-5", tone: "bg-accent" },
  { name: "Water points", start: "col-start-4", span: "col-span-4", tone: "bg-primary" },
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
    mapRef.current?.easeTo({ center: selectedNeed.coordinates, zoom: 11.8, pitch: mapStyle === "openstreetmap3d" ? 60 : 0, duration: 500 });
  }, [selectedNeed, mapStyle]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[88px_minmax(0,1fr)] xl:grid-cols-[258px_minmax(0,1fr)]">
        <aside className="flex min-h-screen flex-col border-r border-border bg-card px-3 py-5 shadow-soft xl:px-5">
          <div className="mb-7 flex items-center justify-center gap-3 xl:justify-start">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft"><Waves className="size-5" /></div>
            <div className="hidden xl:block"><p className="text-sm font-semibold">The Human Company</p><p className="text-xs text-muted-foreground">Disaster response OS</p></div>
          </div>
          <nav className="flex-1 space-y-1.5">
            {navTop.map((item) => (
              <button key={item.label} className={`flex h-11 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm transition hover:bg-secondary xl:justify-start ${item.active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground"}`}>
                <item.icon className="size-4 shrink-0" /><span className="hidden truncate xl:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-1.5 border-t border-border pt-4">
            {["About", "Settings"].map((label, index) => {
              const Icon = index === 0 ? ShieldCheck : Settings;
              return <button key={label} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-secondary xl:justify-start"><Icon className="size-4" /><span className="hidden xl:inline">{label}</span></button>;
            })}
            <Button variant="command" className="mt-3 h-11 w-full px-0 xl:px-4"><Siren className="size-4" /><span className="hidden xl:inline">Deploy Responders</span></Button>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-5 xl:p-7">
          <header className="mb-5 flex flex-col gap-4 rounded-lg border border-border bg-card/90 p-3 shadow-soft xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap gap-2 text-sm font-medium">
              {["Community Pulse", "Analytics", "Analytics", "Resource Allocation"].map((label, index) => <button key={`${label}-${index}`} className={`rounded-md px-3 py-2 transition ${index === 0 ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{label}</button>)}
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 shadow-soft sm:min-w-64"><Search className="size-4 text-muted-foreground" /><input aria-label="Search coordinates" placeholder="Search coordinates" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
              <button className="relative rounded-lg border border-border bg-background p-3 shadow-soft"><Bell className="size-4" /><span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" /></button>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5 pr-3 shadow-soft"><img src={aishaImg} alt="User profile avatar" className="size-8 rounded-md object-cover" /><span className="hidden text-sm font-semibold sm:inline">Maya Rao</span></div>
            </div>
          </header>

          <div className="mb-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {quickStats.map((stat) => (
              <article key={stat.label} className={`${stat.tone} min-h-32 rounded-lg p-4 shadow-panel`}>
                <div className="flex items-start justify-between gap-3"><p className="text-xs font-bold tracking-wide opacity-80">{stat.label}</p><div className={`flex size-9 items-center justify-center rounded-lg ${stat.iconTone}`}><stat.icon className="size-4" /></div></div>
                <div className="mt-5 flex items-end justify-between gap-3"><p className="text-4xl font-semibold tracking-normal">{stat.value}</p>{stat.label.includes("UTILIZATION") && <div className="grid size-14 place-items-center rounded-full border-[6px] border-primary bg-card text-xs font-bold text-primary">78%</div>}</div>
                <p className="mt-3 flex items-center gap-1 text-sm font-semibold"><ArrowUpRight className="size-4" />{stat.detail}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_520px]">
            <section className="overflow-hidden rounded-lg border border-border bg-card shadow-panel">
              <div className="relative h-[520px] min-h-[420px]">
                <Map ref={mapRef} mapStyle={styles[mapStyle]} initialViewState={{ longitude: 72.8656, latitude: 19.0607, zoom: 10.7 }}>
                  {needs.map((need, index) => (
                    <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="bottom">
                      <button onClick={() => setSelectedNeed(need)} className="group relative flex flex-col items-center">
                        <span className="mb-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-panel">{[257, 209, 99, 39][index]}</span>
                        <span className="relative grid size-9 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-panel transition group-hover:-translate-y-1"><span className="absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-pulse-ring" /><MapPin className="relative size-5 fill-current" /></span>
                      </button>
                    </Marker>
                  ))}
                </Map>
                <div className="absolute left-4 top-4 max-w-[280px] rounded-lg border border-border bg-card/95 p-4 shadow-soft backdrop-blur"><p className="text-sm font-semibold">Mumbai Needs Map</p><p className="text-xs text-muted-foreground">Active: {selectedNeed.zone} · [{selectedNeed.coordinates.join(", ")}]</p></div>
                <div className="absolute right-4 top-4 flex flex-wrap gap-1 rounded-full border border-border bg-card/95 p-1 shadow-soft backdrop-blur">
                  {Object.keys(styles).map((style) => <button key={style} onClick={() => setMapStyle(style as typeof mapStyle)} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${mapStyle === style ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{style === "openstreetmap3d" ? "3D View" : style === "openstreetmap" ? "OpenStreetMap" : "Default (Carto)"}</button>)}
                </div>
              </div>
            </section>

            <aside className="space-y-5 overflow-hidden">
              <section className="rounded-lg border border-border bg-card p-4 shadow-panel">
                <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Priority Feed</h2><Crosshair className="size-4 text-destructive" /></div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {needs.map((need) => <article key={need.id} className="min-w-56 rounded-lg border border-destructive/20 bg-background p-3 shadow-[0_0_28px_hsl(var(--destructive)/0.18)]"><p className="text-sm font-semibold">{need.title}</p><p className="mt-3 text-xs font-bold text-destructive">URGENCY SCORE</p><p className="text-2xl font-semibold text-destructive">{need.score}/10</p><div className="mt-3 space-y-1 text-xs text-muted-foreground"><p className="font-semibold text-foreground">EME Sane Doe</p><p>Logistic Marked Shorting</p><p>{need.impacted}+ tcs</p><p>5+ Years</p></div><Button variant="command" size="sm" className="mt-3 h-8 w-full" onClick={() => setSelectedNeed(need)}>Assign</Button></article>)}
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-4 shadow-panel">
                <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Volunteers Near Area</h2><Users className="size-4 text-primary" /></div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {volunteers.map((volunteer) => <article key={volunteer.name} className="min-w-56 rounded-lg border border-border bg-background p-3 shadow-soft"><div className="flex items-center gap-3"><div className="relative"><img src={volunteer.image} alt={`${volunteer.name}, ${volunteer.occupation}`} loading="lazy" className="size-12 rounded-full object-cover" /><span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{volunteer.name}</p><p className="truncate text-xs text-muted-foreground">{volunteer.occupation}</p></div></div><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-secondary px-2 py-1 font-semibold text-primary">{volunteer.distance}</span><span className="rounded-full bg-muted px-2 py-1">{volunteer.experience}</span><span className="rounded-full bg-accent px-2 py-1 font-semibold text-accent-foreground">Skill-match {volunteer.match}%</span></div><Button variant="command" size="sm" className="mt-3 h-8 w-full">Assign</Button></article>)}
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-lg border border-border bg-card p-4 shadow-panel">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Active Projects</h2><CalendarDays className="size-4 text-primary" /></div>
              <div className="grid grid-cols-[132px_repeat(8,minmax(44px,1fr))] gap-y-4 overflow-x-auto text-xs">
                <div />{["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month) => <div key={month} className="text-center font-semibold text-muted-foreground">{month}</div>)}
                {projects.map((project) => <div key={project.name} className="contents"><p className="py-2 font-medium">{project.name}</p><div className="col-span-8 grid grid-cols-8 items-center border-l border-border"><span className={`${project.start} ${project.span} h-3 rounded-full ${project.tone} shadow-soft`} /></div></div>)}
              </div>
            </section>
            <section className="rounded-lg border border-border bg-card p-4 shadow-panel">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Resource Inventory</h2><Package className="size-4 text-primary" /></div>
              <div className="grid gap-3"><div className="rounded-lg bg-secondary p-4"><p className="text-xs font-bold text-muted-foreground">Reports · Headers 600</p><p className="mt-2 text-3xl font-semibold">$1,787</p></div><div className="rounded-lg bg-muted p-4"><p className="text-xs font-bold text-muted-foreground">Data Accuracy Index</p><p className="mt-2 text-3xl font-semibold">39</p></div></div>
            </section>
          </div>

          <footer className="mt-5 flex items-center justify-between"><Button variant="quiet"><Settings className="size-4" />Settings</Button><Button variant="command"><RefreshCw className="size-4" />Refresh</Button></footer>
        </section>
      </div>
    </main>
  );
};

export default Index;
