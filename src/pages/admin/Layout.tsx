import { Navigate, Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Settings, LogOut, Loader2, Menu, X, Globe, ShieldCheck, MessageSquare, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_BRAND_NAME } from "@/lib/constants";

type AdminNavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

const navItems: AdminNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "PV-Anfragen", icon: MessageSquare, path: "/admin/leads" },
  { label: "Einstellungen", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const { user, isLoading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const currentTitle =
    navItems.find((item) => item.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.path))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex min-h-screen">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-24 items-center justify-between border-b border-sidebar-border px-6">
            <Link to="/admin" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-black/15">
                <span className="text-lg font-black">PV</span>
              </div>
              <div>
                <div className="text-lg font-black tracking-tight">{DEFAULT_BRAND_NAME}</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-foreground/70">Admin Control</div>
              </div>
            </Link>
            <button className="rounded-xl p-2 text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pt-6">
            <div className="rounded-2xl border border-sidebar-border bg-white/5 p-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/70">
                <ShieldCheck className="h-4 w-4 text-sidebar-primary" />
                Projektsteuerung
              </div>
              <p className="mt-2 text-sm leading-relaxed text-sidebar-foreground/82">
                PV-Anfragen, Rechnerwerte und Website-Einstellungen zentral steuern.
              </p>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  isActive ? "bg-white text-primary shadow-lg ring-1 ring-secondary/20" : "text-sidebar-foreground/82 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sticky bottom-0 mt-auto border-t border-sidebar-border bg-sidebar/95 p-4 backdrop-blur">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="truncate text-sm font-semibold text-white">{user.email}</p>
              <div className="mt-4 space-y-2">
                <Link to="/"><Button variant="ghost" size="sm" className="w-full justify-start rounded-xl text-sidebar-foreground/82 hover:bg-white/10 hover:text-white"><Globe className="mr-2 h-4 w-4" />Zur Website</Button></Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start rounded-xl text-red-100 hover:bg-red-500/10 hover:text-red-50"><LogOut className="mr-2 h-4 w-4" />Abmelden</Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-card/92 backdrop-blur-md lg:hidden">
            <div className="flex h-16 items-center justify-between px-4">
              <button className="rounded-xl border border-border p-2 text-primary" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
              <div className="text-base font-black text-secondary">PV Admin</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-white">PV</div>
            </div>
          </header>

          <div className="hidden sticky top-0 z-20 border-b border-border bg-card/92 backdrop-blur-md lg:block">
            <div className="flex h-20 items-center justify-between px-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">PV-Projektverwaltung</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-secondary">{currentTitle}</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary shadow-sm shadow-secondary/10">
                <ShieldCheck className="h-4 w-4" />
                RLS aktiv
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1680px]"><Outlet /></div>
          </div>
        </main>
      </div>
    </div>
  );
}
