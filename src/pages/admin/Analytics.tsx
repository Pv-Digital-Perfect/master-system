import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CalendarClock, CheckCircle2, Clock, Loader2, MailWarning, MapPin, TrendingUp, Users } from "lucide-react";

type PvLead = {
  id: string;
  created_at: string;
  lead_status: string | null;
  source: string | null;
  city: string | null;
  postal_code: string | null;
  property_type: string | null;
  storage_interest: string | null;
  wallbox_interest: string | null;
  email_notification_sent_at: string | null;
  email_notification_error: string | null;
};

const statusOrder = ["new", "contacted", "appointment", "offer_sent", "won", "lost"];
const statusLabels: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  appointment: "Termin geplant",
  offer_sent: "Angebot gesendet",
  won: "Gewonnen",
  lost: "Verloren",
};

const sourceLabels: Record<string, string> = {
  pv_calculator: "PV-Rechner",
  offer_request: "Anfrageformular",
  contact_form: "Kontaktformular",
};

async function fetchAnalyticsLeads() {
  const { data, error } = await (supabase.from("pv_leads" as any) as any)
    .select("id, created_at, lead_status, source, city, postal_code, property_type, storage_interest, wallbox_interest, email_notification_sent_at, email_notification_error")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;
  return (data || []) as PvLead[];
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function countBy(leads: PvLead[], key: keyof PvLead) {
  const map = new Map<string, number>();
  for (const lead of leads) {
    const raw = lead[key];
    const value = raw ? String(raw) : "Nicht angegeben";
    map.set(value, (map.get(value) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function MetricCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle: string; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
        <div className="text-3xl font-black text-foreground">{value}</div>
        <div className="mt-1 text-sm font-bold text-foreground">{title}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items, labels }: { title: string; items: [string, number][]; labels?: Record<string, string> }) {
  const max = Math.max(...items.map((item) => item[1]), 1);

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.length ? items.slice(0, 6).map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-bold">{labels?.[label] || label}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
            <Progress value={(count / max) * 100} className="h-2" />
          </div>
        )) : <p className="text-sm text-muted-foreground">Noch keine Daten vorhanden.</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminAnalytics() {
  const { data: leads = [], isLoading, isError, error } = useQuery({ queryKey: ["admin-analytics-leads"], queryFn: fetchAnalyticsLeads, retry: false });

  const analytics = useMemo(() => {
    const today = startOfToday();
    const last7 = daysAgo(7);
    const last30 = daysAgo(30);
    const total = leads.length;
    const todayCount = leads.filter((lead) => new Date(lead.created_at) >= today).length;
    const last7Count = leads.filter((lead) => new Date(lead.created_at) >= last7).length;
    const last30Count = leads.filter((lead) => new Date(lead.created_at) >= last30).length;
    const openCount = leads.filter((lead) => [null, "new", "contacted", "appointment", "offer_sent"].includes(lead.lead_status)).length;
    const wonCount = leads.filter((lead) => lead.lead_status === "won").length;
    const mailErrors = leads.filter((lead) => Boolean(lead.email_notification_error)).length;
    const mailSent = leads.filter((lead) => Boolean(lead.email_notification_sent_at)).length;
    const conversionRate = total ? Math.round((wonCount / total) * 100) : 0;

    return { total, todayCount, last7Count, last30Count, openCount, wonCount, mailErrors, mailSent, conversionRate };
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts = countBy(leads, "lead_status");
    return statusOrder.map((status) => [status, counts.find(([key]) => key === status)?.[1] || 0] as [string, number]);
  }, [leads]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  if (isError) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-orange-900"><strong>Analytics nicht erreichbar.</strong><p className="mt-2 text-sm">{String((error as Error)?.message || "Unbekannt")}</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Lead-Analytics</h2>
        <p className="mt-2 text-muted-foreground">Auswertung der letzten bis zu 500 PV-Anfragen.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Leads gesamt" value={analytics.total} subtitle="Alle geladenen Anfragen" icon={<Users className="h-5 w-5" />} />
        <MetricCard title="Heute" value={analytics.todayCount} subtitle="Neue Anfragen seit 00:00 Uhr" icon={<Clock className="h-5 w-5" />} />
        <MetricCard title="Letzte 7 Tage" value={analytics.last7Count} subtitle="Aktuelle Nachfrage" icon={<CalendarClock className="h-5 w-5" />} />
        <MetricCard title="Gewonnen" value={`${analytics.conversionRate}%`} subtitle={`${analytics.wonCount} gewonnene Leads`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50"><CardContent className="p-6"><CheckCircle2 className="mb-3 h-6 w-6 text-emerald-700" /><div className="text-2xl font-black text-emerald-950">{analytics.mailSent}</div><p className="text-sm text-emerald-900/80">Betreiber-Mails gesendet</p></CardContent></Card>
        <Card className={analytics.mailErrors ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}><CardContent className="p-6"><MailWarning className={analytics.mailErrors ? "mb-3 h-6 w-6 text-red-700" : "mb-3 h-6 w-6 text-emerald-700"} /><div className={analytics.mailErrors ? "text-2xl font-black text-red-950" : "text-2xl font-black text-emerald-950"}>{analytics.mailErrors}</div><p className={analytics.mailErrors ? "text-sm text-red-900/80" : "text-sm text-emerald-900/80"}>Mailfehler</p></CardContent></Card>
        <Card><CardContent className="p-6"><BarChart3 className="mb-3 h-6 w-6 text-orange-500" /><div className="text-2xl font-black">{analytics.openCount}</div><p className="text-sm text-muted-foreground">Offene / aktive Leads</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListCard title="Funnel nach Status" items={statusCounts} labels={statusLabels} />
        <ListCard title="Leadquellen" items={countBy(leads, "source")} labels={sourceLabels} />
        <ListCard title="Top-Orte" items={countBy(leads, "city").filter(([label]) => label !== "Nicht angegeben")} />
        <ListCard title="Immobilientypen" items={countBy(leads, "property_type")} />
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex gap-3 p-6 text-blue-950"><MapPin className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-sm leading-relaxed">Für bessere regionale Auswertung sollten PLZ und Ort im Anfrageformular möglichst konsequent abgefragt werden. Die Werte werden bereits in <strong>pv_leads</strong> gespeichert.</p></CardContent>
      </Card>
    </div>
  );
}
