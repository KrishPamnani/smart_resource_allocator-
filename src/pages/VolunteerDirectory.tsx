import { useState } from "react";
import { Search, Filter, Mail, Phone, MapPin, MoreHorizontal, UserCheck, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { initialVolunteers } from "@/data/mockData";

const VolunteerDirectory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [volunteers, setVolunteers] = useState(initialVolunteers);

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.occupation.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || v.occupation.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVolunteer = {
        id: volunteers.length + 1,
        name: formData.get("name") as string,
        occupation: formData.get("occupation") as string,
        experience: formData.get("experience") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        distance: "0.0 km",
        status: "Available" as const,
        match: 100,
        image: aishaImg, // Default image for demo
    };

    setVolunteers([newVolunteer, ...volunteers]);
    setIsRegisterOpen(false);
    toast.success(`${newVolunteer.name} has been successfully registered!`, {
        description: "Certification verified. Ready for immediate deployment.",
        icon: <ShieldCheck className="size-4 text-green-500" />,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Volunteer Directory</h1>
        <p className="text-muted-foreground text-sm">Manage and deploy certified humanitarian responders.</p>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or skillset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/50 bg-card text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-border/50 bg-card" onClick={() => toast.info("Filtering volunteers by category...")}>
                <Filter className="mr-2 size-4" />
                {filter === "All" ? "All Occupations" : filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={() => setFilter("All")}>All Occupations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Medic")}>Medics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Engineer")}>Engineers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Logistician")}>Logisticians</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Nurse")}>Nurses</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332]" onClick={() => toast.success("Opening volunteer registration portal...")}>
                    <Plus className="mr-2 size-4" />
                    Register New Volunteer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-border/40 bg-card p-0 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="h-2 w-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C]" />
                <form onSubmit={handleRegisterSubmit}>
                    <div className="p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Humanitarian Registration</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Enter volunteer credentials for secure tactical directory inclusion.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-8">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Legal Name</Label>
                                <Input id="name" name="name" placeholder="Dr. Alex Rivera" required className="rounded-xl border-border/40 bg-background focus:ring-[#2D6A4F]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="occupation" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Skillset</Label>
                                    <Input id="occupation" name="occupation" placeholder="Field Surgeon" required className="rounded-xl border-border/40 bg-background focus:ring-[#2D6A4F]" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Experience</Label>
                                    <Input id="experience" name="experience" placeholder="8+ Years" required className="rounded-xl border-border/40 bg-background focus:ring-[#2D6A4F]" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secure Email</Label>
                                <Input id="email" name="email" type="email" placeholder="a.rivera@human.org" required className="rounded-xl border-border/40 bg-background focus:ring-[#2D6A4F]" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Satellite Phone / Primary Contact</Label>
                                <Input id="phone" name="phone" placeholder="+1 800 555 0199" required className="rounded-xl border-border/40 bg-background focus:ring-[#2D6A4F]" />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" className="rounded-xl h-11 px-6" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
                            <Button type="submit" className="rounded-xl h-11 px-8 bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-lg shadow-[#2D6A4F]/20">
                                Verify & Register
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border/40">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Volunteer</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Skillset / Exp</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Availability</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Proximity</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">AI Match</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredVolunteers.map((v) => (
                <tr key={v.id} className="group hover:bg-secondary/5 transition-colors animate-in fade-in zoom-in-95 duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={v.image} alt={v.name} className="size-10 rounded-full object-cover" />
                        <span className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card ${v.status === 'Available' ? 'bg-green-500' : v.status === 'In Mission' ? 'bg-orange-500' : 'bg-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{v.name}</p>
                        <p className="text-[11px] text-muted-foreground">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground font-medium">{v.occupation}</p>
                    <p className="text-[11px] text-muted-foreground">{v.experience}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      v.status === 'Available' ? 'bg-green-100/10 text-green-500 border border-green-500/20' : 
                      v.status === 'In Mission' ? 'bg-orange-100/10 text-orange-500 border border-orange-500/20' : 'bg-gray-100/10 text-gray-500 border border-gray-500/20'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3" />
                      {v.distance}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-bold text-[#2D6A4F]">{v.match}%</div>
                        <div className="w-16 h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-[#2D6A4F]" style={{ width: `${v.match}%` }} />
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]" onClick={() => toast.success(`Drafting email to ${v.name}...`)}>
                            <Mail className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]" onClick={() => toast.info(`Initializing secure call line to ${v.phone}...`)}>
                            <Phone className="size-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => toast.info(`Opening options for ${v.name}...`)}>
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => toast.success(`Deploying ${v.name} to active zone...`)}>
                                    <UserCheck className="size-4" /> Deploy to Zone
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`Loading detailed profile for ${v.name}...`)}>View Profile</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => {
                                    setVolunteers(volunteers.filter(vol => vol.id !== v.id));
                                    toast.error(`Removing ${v.name} from active directory...`);
                                }}>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVolunteers.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No volunteers found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDirectory;
