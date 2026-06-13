import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database, MessageSquare, ShieldCheck, Zap } from "lucide-react";

type PvLead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  lead_status: string | null;
  created_at: string;
};

async function fetchPvLeads() {
  const { data, error } = await (supabase.from("pv_leads" as any) as any)
    .select("id, full_name, email, phone, lead_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data || []) as PvLead[];
}

export default function AdminDashboard() {
  const { data: leads = [], isLoading, isError, error } = useQuery({ queryKey: ["admin-pv-leads-preview"], queryFn: fetchPvLeads, retry: false });
  const newLeads = leads.filter((lead) => lead.lead_status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black tracking-tight text-foreground">PV Lead System Dashboard</h2>
        <p className="mt-2 text-muted-foreground">Überblick über eingehende PV-Anfragen und den aktuellen Systemstatus.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card><CardContent className="p-6"><MessageSquare className="mb-4 h-7 w-7 text-emerald-600" /><div className="text-3xl font-black">{isLoading ? "…" : leads.length}</div><p className="mt-1 text-sm text-muted-foreground">Letzte PV-Leads</p></CardContent></Card>
        <Card><CardContent className="p-6"><Zap className="mb-4 h-7 w-7 text-orange-500" /><div className="text-3xl font-black">{isLoading ? "…" : newLeads}</div><p className="mt-1 text-sm text-muted-foreground">Neue Leads</p></CardContent></Card>
        <Card className="border-emerald-200 bg-emerald-50"><CardContent className="p-6"><ShieldCheck className="mb-4 h-7 w-7 text-emerald-700" /><div className="text-lg font-black text-emerald-950">Supabase Auth aktiv</div><p className="mt-1 text-sm text-emerald-800">Admin-Bereich ist für eingeloggte Benutzer geschützt.</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Neueste Anfragen</CardTitle>
          <Button asChild variant="outline"><Link to="/admin/leads">Alle Leads öffnen</Link></Button>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-900">
              Tabelle <strong>pv_leads</strong> ist noch nicht erreichbar. Meldung: {String((error as Error)?.message || "unbekannt")}
            </div>
          ) : leads.length > 0 ? (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-border p-4">
                  <div className="font-bold">{lead.full_name || "Ohne Name"}</div>
                  <div className="text-sm text-muted-foreground">{lead.email || "Keine E-Mail"} · {lead.phone || "Keine Telefonnummer"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <Database className="mx-auto mb-3 h-8 w-8" />
              Noch keine PV-Leads vorhanden.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
