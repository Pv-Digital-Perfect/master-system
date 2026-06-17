import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BarChart3, ClipboardCheck, Database, ExternalLink, MailCheck, MailWarning, MessageSquare, MonitorCheck, Settings, ShieldCheck, Zap } from "lucide-react";
import { activePackageFeatures, activePackageLabel, activePublicPageLinks, externalToolLinks } from "@/config/adminConfig";
import { featureLabels } from "@/config/packageConfig";
import { siteConfig } from "@/config/siteConfig";

type PvLead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  lead_status: string | null;
  created_at: string;
  email_notification_sent_at: string | null;
  email_notification_error: string | null;
};

async function fetchPvLeads() {
  const { data, error } = await (supabase.from("pv_leads" as any) as any)
    .select("id, full_name, email, phone, lead_status, created_at, email_notification_sent_at, email_notification_error")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data || []) as PvLead[];
}

function isToday(dateString: string) {
  const leadDate = new Date(dateString);
  const now = new Date();
  return leadDate.getFullYear() === now.getFullYear() && leadDate.getMonth() === now.getMonth() && leadDate.getDate() === now.getDate();
}

function StatCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string | number; hint: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
        <div className="text-3xl font-black">{value}</div>
        <p className="mt-1 text-sm font-bold text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: leads = [], isLoading, isError, error } = useQuery({ queryKey: ["admin-pv-leads-preview"], queryFn: fetchPvLeads, retry: false });

  const stats = useMemo(() => {
    const newLeads = leads.filter((lead) => lead.lead_status === "new").length;
    const todayLeads = leads.filter((lead) => isToday(lead.created_at)).length;
    const mailErrors = leads.filter((lead) => Boolean(lead.email_notification_error)).length;
    const mailSent = leads.filter((lead) => Boolean(lead.email_notification_sent_at)).length;
    return { newLeads, todayLeads, mailErrors, mailSent };
  }, [leads]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">PV-Betreiber-Cockpit</h2>
          <p className="mt-2 text-muted-foreground">Überblick über PV-Anfragen, Paketstatus, Live-Seiten, Mailstatus und Website-Qualität.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-emerald-600 px-4 py-2 text-white">{activePackageLabel}</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-2">{siteConfig.siteUrl}</Badge>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<MessageSquare className="h-5 w-5" />} label="Leads geladen" value={isLoading ? "…" : leads.length} hint="Letzte bis zu 100 PV-Anfragen" />
        <StatCard icon={<Zap className="h-5 w-5" />} label="Heute" value={isLoading ? "…" : stats.todayLeads} hint="Neue Anfragen seit Tagesbeginn" />
        <StatCard icon={<MailCheck className="h-5 w-5" />} label="Mails gesendet" value={isLoading ? "…" : stats.mailSent} hint="Betreiber-Benachrichtigungen" />
        <StatCard icon={<MailWarning className="h-5 w-5" />} label="Mailfehler" value={isLoading ? "…" : stats.mailErrors} hint="Muss bei >0 geprüft werden" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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
                {leads.slice(0, 6).map((lead) => (
                  <div key={lead.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-border p-4 md:flex-row md:items-center">
                    <div>
                      <div className="font-bold">{lead.full_name || "Ohne Name"}</div>
                      <div className="text-sm text-muted-foreground">{lead.email || "Keine E-Mail"} · {lead.phone || "Keine Telefonnummer"}</div>
                    </div>
                    <Badge variant={lead.lead_status === "new" ? "default" : "outline"}>{lead.lead_status || "new"}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <Database className="mx-auto mb-3 h-8 w-8" />Noch keine PV-Leads vorhanden.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-950"><ShieldCheck className="h-5 w-5" /> Paketstatus</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activePackageFeatures.map((feature) => <div key={feature} className="rounded-2xl bg-white p-3 text-sm font-bold text-emerald-950">{featureLabels[feature]}</div>)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-6"><MonitorCheck className="mb-3 h-6 w-6 text-emerald-600" /><div className="font-black">Live-Seiten</div><p className="mt-1 text-sm text-muted-foreground">{activePublicPageLinks.length} aktive Seiten prüfen.</p><Button asChild className="mt-5 w-full rounded-full" variant="outline"><Link to="/admin/live">Öffnen</Link></Button></CardContent></Card>
        <Card><CardContent className="p-6"><BarChart3 className="mb-3 h-6 w-6 text-orange-500" /><div className="font-black">Analytics</div><p className="mt-1 text-sm text-muted-foreground">Funnel, Quellen, Orte und Status.</p><Button asChild className="mt-5 w-full rounded-full" variant="outline"><Link to="/admin/analytics">Öffnen</Link></Button></CardContent></Card>
        <Card><CardContent className="p-6"><ClipboardCheck className="mb-3 h-6 w-6 text-blue-600" /><div className="font-black">Checkliste</div><p className="mt-1 text-sm text-muted-foreground">Website-Status und Inhalte prüfen.</p><Button asChild className="mt-5 w-full rounded-full" variant="outline"><Link to="/admin/checklist">Öffnen</Link></Button></CardContent></Card>
        <Card><CardContent className="p-6"><Settings className="mb-3 h-6 w-6 text-violet-600" /><div className="font-black">Einstellungen</div><p className="mt-1 text-sm text-muted-foreground">Website-Texte, Anfrageprozess und Rechnerwerte.</p><Button asChild className="mt-5 w-full rounded-full" variant="outline"><Link to="/admin/settings">Öffnen</Link></Button></CardContent></Card>
      </div>

      {externalToolLinks.length ? (
        <Card>
          <CardHeader><CardTitle>Verwaltung</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {externalToolLinks.map((link) => <Button key={link.label} asChild variant="outline" className="justify-between rounded-2xl"><a href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink className="h-4 w-4" /></a></Button>)}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
