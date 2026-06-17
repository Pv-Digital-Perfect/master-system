import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy, Loader2, Mail, Phone, Search, Save } from "lucide-react";

type PvLead = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  postal_code: string | null;
  city: string | null;
  ownership_status: string | null;
  property_type: string | null;
  roof_type: string | null;
  roof_area_sqm: number | null;
  roof_orientation: string | null;
  roof_age: string | null;
  meter_cabinet_status: string | null;
  annual_consumption_kwh: number | null;
  monthly_electricity_cost: number | null;
  storage_interest: string | null;
  wallbox_interest: string | null;
  timeline: string | null;
  budget_range: string | null;
  message: string | null;
  source: string | null;
  lead_status: string | null;
  internal_notes: string | null;
  email_notification_sent_at: string | null;
  email_notification_error: string | null;
  customer_confirmation_sent_at: string | null;
  customer_confirmation_error: string | null;
  last_email_attempt_at: string | null;
};

async function fetchPvLeads() {
  const { data, error } = await (supabase.from("pv_leads" as any) as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as PvLead[];
}

const labelMap: Record<string, string> = {
  owner: "Eigentümer/in",
  co_owner: "Miteigentümer/in",
  tenant: "Mieter/in",
  company_decision_maker: "Entscheider/in",
  south: "Süd",
  east_west: "Ost/West",
  south_west: "Süd-West",
  south_east: "Süd-Ost",
  modern: "modern",
  older: "älter",
  under_10: "unter 10 Jahre",
  "10_25": "10–25 Jahre",
  over_25: "über 25 Jahre",
  under_10000: "unter 10.000 €",
  "10000_20000": "10.000–20.000 €",
  "20000_35000": "20.000–35.000 €",
  over_35000: "über 35.000 €",
  single_family_house: "Einfamilienhaus",
  multi_family_house: "Mehrfamilienhaus",
  commercial: "Gewerbe",
  farm: "Landwirtschaft",
  pitched_roof: "Schrägdach",
  flat_roof: "Flachdach",
  unknown: "Unklar",
  yes: "Ja",
  no: "Nein",
  consultation: "Beratung",
  later: "Vielleicht später",
  now: "Sofort",
  "3_months": "3 Monate",
  "6_months": "6 Monate",
  research: "Info-Phase",
  new: "Neu",
  contacted: "Kontaktiert",
  offer_sent: "Angebot gesendet",
  appointment: "Termin geplant",
  won: "Gewonnen",
  lost: "Verloren",
};

const statusOptions = ["new", "contacted", "appointment", "offer_sent", "won", "lost"];

function humanize(value?: string | null) {
  if (!value) return "—";
  return labelMap[value] || value;
}

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const { data: leads = [], isLoading, isError, error } = useQuery({ queryKey: ["admin-pv-leads"], queryFn: fetchPvLeads, retry: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<PvLead> }) => {
      const { error } = await (supabase.from("pv_leads" as any) as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pv-leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pv-leads-preview"] });
      toast({ title: "Lead aktualisiert" });
    },
    onError: (mutationError) => {
      toast({ title: "Speichern fehlgeschlagen", description: String((mutationError as Error)?.message || mutationError), variant: "destructive" });
    },
  });

  const filteredLeads = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return leads;

    return leads.filter((lead) =>
      [lead.full_name, lead.email, lead.phone, lead.postal_code, lead.city, lead.ownership_status, lead.property_type, lead.roof_type, lead.roof_orientation, lead.message, lead.source, lead.internal_notes]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }, [leads, searchTerm]);

  function copyEmails() {
    const text = filteredLeads.map((lead) => lead.email).filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: `${filteredLeads.length} Lead-E-Mails kopiert` });
  }

  function exportCsv() {
    const headers = ["Datum", "Name", "E-Mail", "Telefon", "PLZ", "Ort", "Eigentümer", "Immobilie", "Dach", "Dachfläche", "Ausrichtung", "Dachalter", "Zählerschrank", "Verbrauch", "Speicher", "Wallbox", "Zeitrahmen", "Budget", "Quelle", "Status", "Mail Betreiber", "Mail Kunde", "Nachricht", "Interne Notizen"];
    const rows = filteredLeads.map((lead) => [
      new Date(lead.created_at).toLocaleString("de-AT"),
      lead.full_name || "",
      lead.email || "",
      lead.phone || "",
      lead.postal_code || "",
      lead.city || "",
      humanize(lead.ownership_status),
      humanize(lead.property_type),
      humanize(lead.roof_type),
      lead.roof_area_sqm || "",
      humanize(lead.roof_orientation),
      humanize(lead.roof_age),
      humanize(lead.meter_cabinet_status),
      lead.annual_consumption_kwh || "",
      humanize(lead.storage_interest),
      humanize(lead.wallbox_interest),
      humanize(lead.timeline),
      humanize(lead.budget_range),
      lead.source || "",
      humanize(lead.lead_status),
      lead.email_notification_sent_at ? "gesendet" : lead.email_notification_error ? `Fehler: ${lead.email_notification_error}` : "offen",
      lead.customer_confirmation_sent_at ? "gesendet" : lead.customer_confirmation_error ? `Fehler: ${lead.customer_confirmation_error}` : "nicht gesendet",
      lead.message || "",
      lead.internal_notes || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pv-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">PV-Leads</h2>
          <p className="text-muted-foreground">Qualifizierte Photovoltaik-Anfragen aus Rechner, Formular und Kontaktseite.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={copyEmails}><Copy className="mr-2 h-4 w-4" /> E-Mails kopieren</Button>
          <Button onClick={exportCsv}>CSV Export</Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Name, E-Mail, Telefon, PLZ, Ort oder Nachricht suchen..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : isError ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-orange-900">
            <strong>pv_leads ist noch nicht erreichbar.</strong>
            <p className="mt-2 text-sm">Bitte prüfe Tabelle, RLS und Login. Technische Meldung: {String((error as Error)?.message || "Unbekannt")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Anfragen ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Standort</TableHead>
                  <TableHead>Objekt</TableHead>
                  <TableHead>PV-Daten</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notizen</TableHead>
                  <TableHead>Nachricht</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const currentNote = notesDraft[lead.id] ?? lead.internal_notes ?? "";
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{new Date(lead.created_at).toLocaleDateString("de-AT")}</TableCell>
                      <TableCell className="min-w-[220px]">
                        <div className="font-bold">{lead.full_name || "—"}</div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />{lead.email || "—"}</div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5" />{lead.phone || "—"}</div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {lead.email_notification_sent_at ? (
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Betreiber-Mail gesendet</Badge>
                          ) : lead.email_notification_error ? (
                            <Badge variant="destructive" title={lead.email_notification_error}>Betreiber-Mail Fehler</Badge>
                          ) : (
                            <Badge variant="outline">Betreiber-Mail offen</Badge>
                          )}
                          {lead.customer_confirmation_sent_at ? (
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Kunden-Mail gesendet</Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{lead.postal_code || "—"} {lead.city || ""}</TableCell>
                      <TableCell className="min-w-[190px]"><Badge variant="outline">{humanize(lead.property_type)}</Badge><div className="mt-2 text-xs text-muted-foreground">Eigentümer: {humanize(lead.ownership_status)}</div><div className="text-xs text-muted-foreground">Dach: {humanize(lead.roof_type)} · {lead.roof_area_sqm ? `${lead.roof_area_sqm} m²` : "Fläche —"}</div><div className="text-xs text-muted-foreground">Ausrichtung: {humanize(lead.roof_orientation)}</div><div className="text-xs text-muted-foreground">Zähler: {humanize(lead.meter_cabinet_status)}</div></TableCell>
                      <TableCell className="min-w-[190px]">
                        <div className="text-sm">Verbrauch: {lead.annual_consumption_kwh ? `${lead.annual_consumption_kwh} kWh` : "—"}</div>
                        <div className="text-xs text-muted-foreground">Speicher: {humanize(lead.storage_interest)} · Wallbox: {humanize(lead.wallbox_interest)}</div>
                        <div className="text-xs text-muted-foreground">Zeitrahmen: {humanize(lead.timeline)}</div>
                        <div className="text-xs text-muted-foreground">Budget: {humanize(lead.budget_range)}</div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <Select value={lead.lead_status || "new"} onValueChange={(value) => updateLeadMutation.mutate({ id: lead.id, patch: { lead_status: value } })}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => <SelectItem key={status} value={status}>{humanize(status)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[260px]">
                        <div className="flex gap-2">
                          <Textarea value={currentNote} onChange={(event) => setNotesDraft((current) => ({ ...current, [lead.id]: event.target.value }))} className="min-h-20" placeholder="Interne Notiz..." />
                          <Button size="icon" variant="outline" onClick={() => updateLeadMutation.mutate({ id: lead.id, patch: { internal_notes: currentNote } })} disabled={updateLeadMutation.isPending}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate" title={lead.message || ""}>{lead.message || "—"}</TableCell>
                    </TableRow>
                  );
                })}
                {filteredLeads.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">Keine PV-Leads gefunden.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
