import { useEffect, useMemo, useRef, useState } from "react";
import { 
  Siren, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Truck, 
  FileText,
  Rss,
  Sparkles,
  Check,
  MapPin,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Zap
} from "lucide-react";
import { Marker } from "react-map-gl/maplibre";
import { Map, type MapRef } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  { id: 8350, title: "Power Failure — Sector 3", zone: "Chembur Grid", score: 8.5, reports: 156, coordinates: [72.89, 19.05], impacted: 90, type: "Utilities" },
  { id: 8320, title: "Bridge Collapse Risk", zone: "Vashi Bridge Path", score: 9.5, reports: 42, coordinates: [72.93, 19.04], impacted: 200, type: "Logistics" },
];

const stats = [
  { label: "Total Urgent Needs", value: "142", sub: "+12% vs last hr", icon: Siren, color: "destructive", accent: "bg-destructive" },
  { label: "Active Volunteers", value: "892", sub: "On-Site: 240", icon: Users, color: "primary", accent: "bg-[#2D6A4F]" },
  { label: "Tasks Completed", value: "3,120", sub: "94% Target", icon: CheckCircle2, color: "sky-500", accent: "bg-sky-500" },
  { label: "Data Accuracy Index", value: "98.4", sub: "Verified Logs", icon: ShieldCheck, color: "accent", accent: "bg-accent" },
];

const Overview = () => {
  const mapRef = useRef<MapRef>(null);
  const [selectedNeed, setSelectedNeed] = useState(needs[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const styles = useMemo(
    () => ({
      openstreetmap: "https://tiles.openfreemap.org/styles/bright",
    }),
    [],
  );

  useEffect(() => {
    mapRef.current?.easeTo({ center: selectedNeed.coordinates, zoom: 12.5, duration: 800 });
  }, [selectedNeed]);

  const handleExportCSV = () => {
    toast.promise(new Promise(r => setTimeout(r, 1200)), {
        loading: 'Compiling mission data...',
        success: () => {
            const blob = new Blob(["id,title,zone,score\n8421,Water Shortage,Dharavi,9.2"], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'disaster_response_summary.csv';
            a.click();
            return 'Mission summary exported successfully.';
        },
        error: 'Export failed.',
    });
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    toast.loading("Running predictive impact simulations...", { id: "sim-toast" });
    setTimeout(() => {
        setIsSimulating(false);
        toast.success("Simulation Complete: Redirection reduces rescue latency by 22%.", { id: "sim-toast" });
    }, 2500);
  };

  const handleAuthorize = () => {
    setIsAuthorized(true);
    toast.success("Strategic redirection authorized.", {
        description: "Ground units Alpha-4 and Delta-2 have been rerouted.",
        icon: <ShieldCheck className="size-4 text-[#2D6A4F]" />
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time status of disaster response efforts across all sectors.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={handleExportCSV}>Export CSV</Button>
          <Button className="rounded-full bg-[#2D6A4F] text-white hover:bg-[#1B4332]" onClick={() => toast.info("Comprehensive activity logs are synced every 30s.")}>View All Logs</Button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article 
            key={stat.label} 
            className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          >
            <span className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className={`text-[10px] font-medium ${stat.color === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`}>{stat.sub}</span>
              </p>
            </div>
            <div className={`grid size-10 place-items-center rounded-lg ${stat.color === 'destructive' ? 'bg-destructive/10 text-destructive' : stat.color === 'primary' ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' : stat.color === 'sky-500' ? 'bg-sky-500/10 text-sky-600' : 'bg-accent/20 text-accent-foreground'}`}>
              <stat.icon className="size-5" />
            </div>
          </article>
        ))}
      </div>

      {/* MAP SECTION */}
      <section className="relative h-[480px] w-full rounded-[2rem] border border-border/50 bg-card shadow-soft overflow-hidden">
        <Map
          ref={mapRef}
          mapStyle={styles.openstreetmap}
          initialViewState={{ longitude: 72.8656, latitude: 19.0607, zoom: 11 }}
          className="h-full w-full"
        >
          {needs.map((need) => (
            <Marker key={need.id} longitude={need.coordinates[0]} latitude={need.coordinates[1]} anchor="bottom">
              <button onClick={() => setSelectedNeed(need)} className="group relative flex flex-col items-center">
                <div className="mb-1 rounded-full bg-[#2D6A4F] px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white/20 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  {need.reports} Reports
                </div>
                <span className={`relative grid size-10 place-items-center rounded-full text-white shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 ${selectedNeed.id === need.id ? 'bg-destructive' : 'bg-destructive/80'}`}>
                  <span className={`absolute inset-0 rounded-full bg-destructive/40 motion-safe-only animate-ping ${selectedNeed.id === need.id ? 'opacity-100' : 'opacity-0'}`} />
                  <MapPin className="relative size-5 fill-current" />
                </span>
              </button>
            </Marker>
          ))}
        </Map>

        {/* LEFT FLOATING PANELS */}
        <div className="absolute left-6 top-6 w-64 flex flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border/40 bg-card/90 p-3 shadow-xl backdrop-blur-md">
                <div className="grid size-9 place-items-center rounded-lg bg-[#2D6A4F]/10 text-[#2D6A4F]">
                    <MapPin className="size-4" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-foreground">Focusing Zone</p>
                    <p className="text-[10px] text-muted-foreground">{selectedNeed.zone}</p>
                </div>
            </div>

            <div className="pointer-events-auto space-y-3 rounded-xl border border-border/40 bg-card/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <h2 className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Active Need</h2>
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[8px] font-bold text-destructive border border-destructive/20 uppercase">Urgency: {selectedNeed.score}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-tight">{selectedNeed.title}</h3>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>{selectedNeed.impacted}+ impacted residents</span>
                    <span className="font-bold text-[#2D6A4F] uppercase tracking-tighter">{selectedNeed.type}</span>
                </div>
                <Button className="w-full h-9 bg-[#2D6A4F] text-white rounded-lg text-[10px] font-bold shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all" onClick={() => toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: 'Initializing deployment protocol...', success: 'Response team dispatched to focus zone.', error: 'Deployment failed.' })}>
                    Assign Response Team
                </Button>
            </div>
        </div>

        {/* RIGHT FLOATING PANEL */}
        <div className="absolute right-6 top-6 w-64 h-[calc(100%-48px)] pointer-events-none">
            <div className="pointer-events-auto h-full p-2 flex flex-col bg-transparent">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <AlertCircle className="size-3 text-destructive" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">High Priority Feed</h2>
                </div>
                
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-2 custom-scrollbar">
                    {needs.map((need) => (
                        <button 
                            key={need.id}
                            onClick={() => setSelectedNeed(need)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                selectedNeed.id === need.id 
                                ? 'border-[#2D6A4F] bg-white dark:bg-zinc-900 shadow-lg scale-[1.02]' 
                                : 'border-border/40 bg-white/90 dark:bg-zinc-900/90 hover:border-[#2D6A4F]/40'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-1.5">
                                <p className="text-xs font-bold text-foreground leading-tight line-clamp-2">{need.title}</p>
                                <span className={`text-[10px] font-bold text-destructive`}>{need.score}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                                <span>{need.reports} Reports</span>
                                <ChevronRight className={`size-3 transition-transform ${selectedNeed.id === need.id ? 'translate-x-1' : ''}`} />
                            </div>
                        </button>
                    ))}
                    <div className="h-4 w-full" />
                </div>
            </div>
        </div>
      </section>

      {/* AI STRATEGIC RESPONSE REPORT */}
      <section className="relative rounded-[2.5rem] border border-border/50 bg-card overflow-hidden shadow-soft">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <BrainCircuit className="size-64" />
        </div>
        
        <div className="p-10">
            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white shadow-lg shadow-[#2D6A4F]/20">
                        <Sparkles className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Strategic Intelligence Report</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`size-2 rounded-full ${isAuthorized ? 'bg-blue-500' : 'bg-[#2D6A4F]'} animate-pulse`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isAuthorized ? 'text-blue-500' : 'text-[#2D6A4F]'}`}>
                                {isAuthorized ? 'Command Override Active' : 'Real-time Analysis Active'}
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="rounded-full text-xs h-9 px-6 border-border/60 hover:bg-secondary" onClick={() => toast.info("Accessing Level 4 AI Model Heuristics...")}>
                    View Methodology
                </Button>
            </div>
            
            <div className="grid lg:grid-cols-[1.2fr_1px_0.8fr] gap-12 items-stretch">
                <div className="space-y-6">
                    <div className="bg-secondary/10 rounded-3xl p-8 border border-border/40 relative overflow-hidden group">
                        {isSimulating && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center p-8">
                                <div className="w-full max-w-xs space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-center text-[#2D6A4F]">Computing Mission Scenarios...</p>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2D6A4F] animate-progress-fast" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp className="size-16 text-[#2D6A4F]" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="size-3 text-[#2D6A4F]" />
                            Primary Deployment Recommendation
                        </p>
                        <p className="text-lg text-foreground leading-relaxed font-medium">
                            Synthesizing data from <span className="text-[#2D6A4F] font-bold underline decoration-2 underline-offset-4">Sector 7 Distress Cluster</span> and satellite soil moisture telemetry. 
                        </p>
                        <p className="text-muted-foreground mt-4 leading-relaxed">
                            Immediate redirection of <span className="font-bold text-foreground">Unit Alpha-4</span> to Dharavi West is critical. Delayed response beyond <span className="text-destructive font-bold">45 minutes</span> increases the probability of a level 4 resource collapse by 64%.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Button 
                                className={`flex-1 ${isAuthorized ? 'bg-blue-600' : 'bg-[#2D6A4F]'} text-white hover:opacity-90 rounded-2xl h-12 font-bold shadow-lg transition-all`}
                                onClick={handleAuthorize}
                                disabled={isAuthorized}
                            >
                                {isAuthorized ? 'Redirection Authorized' : 'Authorize Redirection'}
                            </Button>
                            <Button 
                                variant="outline" 
                                className="rounded-2xl h-12 px-6 border-border/60" 
                                onClick={handleSimulate}
                                disabled={isSimulating}
                            >
                                Simulate Outcome
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />

                <div className="flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card transition-all group cursor-default">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="size-4 text-orange-500" />
                                <p className="text-sm font-bold text-foreground">Coastal Surge Warning</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">82% probability of tide-induced flooding in Mahim. Evacuation protocols recommended for low-lying transit camps.</p>
                        </div>
                        
                        <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card transition-all group cursor-default">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="size-4 text-green-500" />
                                <p className="text-sm font-bold text-foreground">Logistics Verification</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Medical supply chain to Central Hub verified via blockchain audit. 100% stock integrity confirmed for emergency meds.</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Model Confidence</p>
                            <p className="text-lg font-extrabold text-[#2D6A4F]">98.4%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Latency</p>
                            <p className="text-lg font-extrabold text-foreground">14ms</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
