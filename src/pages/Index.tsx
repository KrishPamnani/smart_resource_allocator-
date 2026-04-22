import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Crosshair,
  DatabaseZap,
  FileText,
  HandHeart,
  LayoutDashboard,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";
import { Marker } from "react-map-gl/maplibre";

import { Button } from "@/components/ui/button";
import { Map, type MapRef } from "@/components/ui/map";
import Testimonials from "@/components/Testimonials";
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
  { id: 8421, title: "Water Shortage — Ward 4", zone: "Dharavi Relief Grid", score: 9.2, reports: 257, coordinates: [72.8553, 19.038], impacted: 142, type: "Water" },
  { id: 8417, title: "Food Crisis — Transit Camp", zone: "Kurla Transit Camp", score: 9.3, reports: 209, coordinates: [72.8796, 19.0726], impacted: 118, type: "Food" },
  { id: 8398, title: "Medical Triage Needed", zone: "Sion Medical Line", score: 8.9, reports: 99, coordinates: [72.8611, 19.044], impacted: 76, type: "Healthcare" },
  { id: 8374, title: "Coastal Evacuation Block", zone: "Mahim Coastal Block", score: 9.1, reports: 39, coordinates: [72.8401, 19.0427], impacted: 64, type: "Logistics" },
];

const volunteers = [
  { name: "Dr. Jane Doe", occupation: "Field Medic", experience: "5+ Years", distance: "1.2 km away", match: 96, image: aishaImg },
  { name: "Dr. Aisha Rahman", occupation: "Community Nurse", experience: "6+ Years", distance: "1.8 km away", match: 94, image: danielImg },
  { name: "Dr. Meera Patel", occupation: "Logistics Lead", experience: "5+ Years", distance: "2.4 km away", match: 91, image: meeraImg },
  { name: "Dr. Joseph Kamau", occupation: "Rescue Paramedic", experience: "7+ Years", distance: "3.1 km away", match: 88, image: josephImg },
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

const projects = [
  { name: "Relief kitchens", start: "col-start-1", span: "col-span-4", tone: "bg-primary" },
  { name: "Medical tents", start: "col-start-2", span: "col-span-5", tone: "bg-accent" },
  { name: "Water points", start: "col-start-4", span: "col-span-4", tone: "bg-primary" },
  { name: "Shelter logistics", start: "col-start-5", span: "col-span-3", tone: "bg-accent" },
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
      <div className="grid min-h-screen grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* SIDEBAR — fixed, non-scrollable */}
        <aside className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-border bg-card px-3 py-5 xl:px-4">
          <div className="mb-7 flex items-center justify-center gap-3 xl:justify-start">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Waves className="size-5" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold leading-tight">The Human Company</p>
              <p className="text-[11px] text-muted-foreground">Disaster response OS</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-hidden">
            {navTop.map((item) => (
              <button
                key={item.label}
                className={`flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium transition xl:justify-start ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="hidden truncate xl:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-1 border-t border-border pt-3">
            {[
              { label: "About", Icon: ShieldCheck },
              { label: "Settings", Icon: Settings },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                className="flex h-10 w-full items-center justify-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary xl:justify-start"
              >
                <Icon className="size-4" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            ))}
            <Button variant="command" className="mt-3 h-10 w-full rounded-md px-0 xl:px-4">
              <Siren className="size-4" />
              <span className="hidden xl:inline">Deploy Responders</span>
            </Button>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 p-4 xl:p-6">
          {/* Top bar */}
          <header className="mb-5 flex flex-col gap-3 rounded-md border border-border bg-card p-2.5 shadow-soft xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap gap-1 text-sm font-medium">
              {["Community Pulse", "Analytics", "Active Projects", "Resource Allocation"].map((label, index) => (
                <button
                  key={label}
                  className={`rounded-md px-3 py-1.5 transition ${
                    index === 0 ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 sm:min-w-64">
                <Search className="size-4 text-muted-foreground" />
                <input
                  aria-label="Search coordinates"
                  placeholder="Search coordinates"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button className="relative rounded-md border border-border bg-background p-2">
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
              </button>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1 pr-3">
                <img src={aishaImg} alt="Maya Rao" className="size-7 rounded-sm object-cover" />
                <span className="hidden text-sm font-semibold sm:inline">Maya Rao</span>
              </div>
            </div>
          </header>

          {/* QUICK STATS — 4 horizontal cards */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Card 1 — Forest Green */}
            <article className="rounded-md bg-primary p-4 text-primary-foreground shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Total Impacted</p>
              <p className="mt-3 text-3xl font-semibold">142</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium opacity-90">
                <TrendingUp className="size-3.5" /> + 12.73% vs last week
              </p>
            </article>

            {/* Card 2 — Soft Sage */}
            <article className="rounded-md bg-secondary p-4 text-secondary-foreground shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">Active Tasks</p>
              <p className="mt-3 text-3xl font-semibold text-primary">892</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-primary/80">
                <TrendingUp className="size-3.5" /> + 30.32% throughput
              </p>
            </article>

            {/* Card 3 — White with circular ring */}
            <article className="flex items-center justify-between rounded-md border border-border bg-card p-4 shadow-soft">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Volunteer Util.</p>
                <p className="mt-3 text-3xl font-semibold">78.5%</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">Live capacity</p>
              </div>
              <div
                className="grid size-16 place-items-center rounded-full text-xs font-bold text-primary"
                style={{
                  background: `conic-gradient(hsl(var(--primary)) 0% 78.5%, hsl(var(--muted)) 78.5% 100%)`,
                }}
              >
                <span className="grid size-12 place-items-center rounded-full bg-card">78%</span>
              </div>
            </article>

            {/* Card 4 — Mustard / Accent */}
            <article className="rounded-md bg-accent p-4 text-accent-foreground shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Data Accuracy</p>
              <p className="mt-3 text-3xl font-semibold">98.4</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold">
                <CheckCircle2 className="size-3.5" /> Verified
              </p>
            </article>
          </div>

          {/* CENTRAL ZONE — Map 75% / Side 25% */}
          <div className="grid gap-4 xl:grid-cols-[3fr_1fr]">
            {/* MAP */}
            <section className="overflow-hidden rounded-md border border-border bg-card shadow-soft">
              <div className="relative h-[560px] min-h-[460px]">
                <Map
                  ref={mapRef}
                  mapStyle={styles[mapStyle]}
                  initialViewState={{ longitude: 72.8656, latitude: 19.0607, zoom: 10.7 }}
                >
                  {needs.map((need) => (
                    <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="bottom">
                      <button onClick={() => setSelectedNeed(need)} className="group relative flex flex-col items-center">
                        <span className="mb-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow-soft">
                          {need.reports}
                        </span>
                        <span className="relative grid size-9 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-soft transition group-hover:-translate-y-1">
                          <span className="absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-pulse-ring" />
                          <MapPin className="relative size-5 fill-current" />
                        </span>
                      </button>
                    </Marker>
                  ))}
                </Map>
                {/* Floating info-box */}
                <div className="absolute left-4 top-4 max-w-[280px] rounded-md border border-border bg-card/95 p-3 shadow-soft backdrop-blur">
                  <p className="text-sm font-semibold">Mumbai Needs Map</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Active: {selectedNeed.zone}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    [{selectedNeed.coordinates.join(", ")}]
                  </p>
                </div>
                {/* Pill style switcher */}
                <div className="absolute right-4 top-4 flex flex-wrap gap-1 rounded-full border border-border bg-card/95 p-1 shadow-soft backdrop-blur">
                  {(Object.keys(styles) as Array<keyof typeof styles>).map((style) => (
                    <button
                      key={style}
                      onClick={() => setMapStyle(style)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        mapStyle === style ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {style === "openstreetmap3d" ? "3D" : style === "openstreetmap" ? "OSM" : "Default"}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN — vertical stack */}
            <aside className="flex flex-col gap-4">
              {/* PRIORITY FEED */}
              <section className="rounded-md border border-border bg-card p-3.5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Priority Feed</h2>
                  <Crosshair className="size-4 text-destructive" />
                </div>
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {needs.map((need) => (
                    <article
                      key={need.id}
                      className={`rounded-md border p-2.5 transition cursor-pointer ${
                        selectedNeed.id === need.id
                          ? "border-destructive/40 bg-destructive/5 shadow-[0_0_18px_hsl(var(--destructive)/0.18)]"
                          : "border-border bg-background hover:border-destructive/30"
                      }`}
                      onClick={() => setSelectedNeed(need)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">Needs Detail & Match</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                            #{need.id} · {need.zone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-destructive">URGENCY</p>
                          <p className="text-base font-bold leading-none text-destructive">{need.score}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[11px] text-muted-foreground">{need.impacted}+ impacted</p>
                        <Button variant="command" size="sm" className="h-7 rounded-md px-3 text-xs">
                          Assign
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* VOLUNTEERS — horizontal scroll */}
              <section className="rounded-md border border-border bg-card p-3.5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Volunteers Near Area</h2>
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {volunteers.map((v) => (
                    <article
                      key={v.name}
                      className="min-w-[180px] shrink-0 rounded-md border border-border bg-background p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative shrink-0">
                          <img
                            src={v.image}
                            alt={v.name}
                            loading="lazy"
                            className="size-10 rounded-full object-cover"
                          />
                          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-2.5" />
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{v.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{v.occupation}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {v.distance}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                          {v.experience}
                        </span>
                      </div>
                      <Button variant="command" size="sm" className="mt-2 h-7 w-full rounded-md text-xs">
                        Assign
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          </div>

          {/* BOTTOM — Projects timeline + Inventory */}
          <div className="mt-5 grid gap-4 xl:grid-cols-[3fr_1fr]">
            <section className="rounded-md border border-border bg-card p-4 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Active Projects</h2>
                <CalendarDays className="size-4 text-primary" />
              </div>
              <div className="grid grid-cols-[132px_repeat(8,minmax(40px,1fr))] gap-y-3 overflow-x-auto text-xs">
                <div />
                {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month) => (
                  <div key={month} className="text-center text-[11px] font-semibold text-muted-foreground">
                    {month}
                  </div>
                ))}
                {projects.map((project) => (
                  <div key={project.name} className="contents">
                    <p className="py-1.5 text-xs font-medium">{project.name}</p>
                    <div className="col-span-8 grid grid-cols-8 items-center border-l border-border">
                      <span className={`${project.start} ${project.span} h-2.5 rounded-full ${project.tone}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Resource Inventory</h2>
                <Package className="size-4 text-primary" />
              </div>
              <div className="grid gap-2.5">
                <div className="rounded-md bg-secondary p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-primary/70">Reports · Headers 600</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">$1,787</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Accuracy Index</p>
                  <p className="mt-1 text-2xl font-semibold">39</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-5 flex items-center justify-between">
            <Button variant="quiet" className="rounded-md">
              <Settings className="size-4" />
              Settings
            </Button>
            <Button variant="command" className="rounded-md">
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </footer>

          <Testimonials />
        </section>
      </div>
    </main>
  );
};

export default Index;
