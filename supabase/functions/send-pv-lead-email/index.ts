import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type LeadRecord = Record<string, unknown>;

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string[];
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function env(name: string, fallback = "") {
  return Deno.env.get(name) || fallback;
}

function splitRecipients(value: string) {
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUuid(value: unknown) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function value(record: LeadRecord, key: string) {
  const raw = record[key];
  if (raw === null || raw === undefined || raw === "") return "—";
  return String(raw);
}

function htmlEscape(input: unknown) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const labelMap: Record<string, string> = {
  owner: "Eigentümer/in",
  co_owner: "Miteigentümer/in",
  tenant: "Mieter/in",
  company_decision_maker: "Entscheider/in im Unternehmen",
  single_family_house: "Einfamilienhaus",
  multi_family_house: "Mehrfamilienhaus",
  commercial: "Gewerbeobjekt",
  farm: "Landwirtschaft",
  pitched_roof: "Schrägdach",
  flat_roof: "Flachdach",
  unknown: "Unbekannt",
  south: "Süd",
  east_west: "Ost/West",
  south_west: "Süd-West",
  south_east: "Süd-Ost",
  under_10: "unter 10 Jahre",
  "10_25": "10–25 Jahre",
  over_25: "über 25 Jahre",
  modern: "modern / neu",
  older: "älter",
  yes: "Ja",
  no: "Nein",
  consultation: "Beratung gewünscht",
  later: "Vielleicht später",
  now: "Sofort / so schnell wie möglich",
  "3_months": "In den nächsten 3 Monaten",
  "6_months": "In den nächsten 6 Monaten",
  research: "Erst informieren",
  under_10000: "unter 10.000 €",
  "10000_20000": "10.000–20.000 €",
  "20000_35000": "20.000–35.000 €",
  over_35000: "über 35.000 €",
  pv_calculator: "PV-Rechner",
  offer_request: "Anfrageformular",
  contact_form: "Kontaktformular",
};

function humanize(input: unknown) {
  if (input === null || input === undefined || input === "") return "—";
  const raw = String(input);
  return labelMap[raw] || raw;
}

function row(label: string, content: unknown) {
  return `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;font-weight:700;width:210px;">${htmlEscape(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${htmlEscape(content)}</td></tr>`;
}

function buildOperatorEmail(lead: LeadRecord, siteName: string) {
  const createdAt = lead.created_at ? new Date(String(lead.created_at)).toLocaleString("de-AT", { timeZone: "Europe/Vienna" }) : new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" });
  const source = humanize(lead.source);
  const name = value(lead, "full_name");
  const postalCode = value(lead, "postal_code");
  const city = value(lead, "city");

  const rows = [
    row("Eingang", createdAt),
    row("Quelle", source),
    row("Name", name),
    row("E-Mail", value(lead, "email")),
    row("Telefon", value(lead, "phone")),
    row("Standort", `${postalCode}${city !== "—" ? ` ${city}` : ""}`.trim()),
    row("Eigentümerstatus", humanize(lead.ownership_status)),
    row("Immobilientyp", humanize(lead.property_type)),
    row("Dachart", humanize(lead.roof_type)),
    row("Dachfläche", lead.roof_area_sqm ? `${lead.roof_area_sqm} m²` : "—"),
    row("Dachausrichtung", humanize(lead.roof_orientation)),
    row("Dachalter", humanize(lead.roof_age)),
    row("Zählerschrank", humanize(lead.meter_cabinet_status)),
    row("Stromverbrauch", lead.annual_consumption_kwh ? `${lead.annual_consumption_kwh} kWh/Jahr` : "—"),
    row("Monatliche Stromkosten", lead.monthly_electricity_cost ? `${lead.monthly_electricity_cost} €` : "—"),
    row("Speicher", humanize(lead.storage_interest)),
    row("Wallbox", humanize(lead.wallbox_interest)),
    row("Zeitrahmen", humanize(lead.timeline)),
    row("Budget", humanize(lead.budget_range)),
    row("Nachricht", value(lead, "message")),
  ].join("");

  const subject = `Neue PV-Anfrage: ${name} ${postalCode !== "—" ? `(${postalCode})` : ""}`.trim();
  const text = [
    `Neue Photovoltaik-Anfrage über ${siteName}`,
    "",
    `Eingang: ${createdAt}`,
    `Quelle: ${source}`,
    `Name: ${name}`,
    `E-Mail: ${value(lead, "email")}`,
    `Telefon: ${value(lead, "phone")}`,
    `Standort: ${postalCode}${city !== "—" ? ` ${city}` : ""}`.trim(),
    `Eigentümerstatus: ${humanize(lead.ownership_status)}`,
    `Immobilientyp: ${humanize(lead.property_type)}`,
    `Dachart: ${humanize(lead.roof_type)}`,
    `Dachfläche: ${lead.roof_area_sqm ? `${lead.roof_area_sqm} m²` : "—"}`,
    `Dachausrichtung: ${humanize(lead.roof_orientation)}`,
    `Dachalter: ${humanize(lead.roof_age)}`,
    `Zählerschrank: ${humanize(lead.meter_cabinet_status)}`,
    `Stromverbrauch: ${lead.annual_consumption_kwh ? `${lead.annual_consumption_kwh} kWh/Jahr` : "—"}`,
    `Monatliche Stromkosten: ${lead.monthly_electricity_cost ? `${lead.monthly_electricity_cost} €` : "—"}`,
    `Speicher: ${humanize(lead.storage_interest)}`,
    `Wallbox: ${humanize(lead.wallbox_interest)}`,
    `Zeitrahmen: ${humanize(lead.timeline)}`,
    `Budget: ${humanize(lead.budget_range)}`,
    `Nachricht: ${value(lead, "message")}`,
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:760px;margin:0 auto;padding:28px 16px;">
        <div style="border-radius:24px;background:#0f172a;padding:28px;color:#ffffff;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#22c55e;">Neue Photovoltaik-Anfrage</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.15;">${htmlEscape(name)}</h1>
          <p style="margin:10px 0 0;color:#cbd5e1;">Quelle: ${htmlEscape(source)} · Standort: ${htmlEscape(`${postalCode}${city !== "—" ? ` ${city}` : ""}`.trim())}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:18px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <tbody>${rows}</tbody>
        </table>
        <p style="margin:18px 0 0;color:#64748b;font-size:13px;line-height:1.55;">Diese E-Mail wurde automatisch nach Eingang der Anfrage erstellt. Antworten auf diese E-Mail gehen direkt an die angegebene Kontaktadresse, sofern eine gültige E-Mail-Adresse übermittelt wurde.</p>
      </div>
    </div>
  `;

  return { subject, html, text };
}

function buildCustomerConfirmation(lead: LeadRecord, siteName: string) {
  const name = value(lead, "full_name") === "—" ? "Guten Tag" : `Guten Tag ${value(lead, "full_name")}`;
  const subject = "Ihre Photovoltaik-Anfrage ist eingegangen";
  const text = [
    `${name},`,
    "",
    "vielen Dank für Ihre Anfrage rund um Photovoltaik, Speicher und mögliche Förderungen.",
    "Wir prüfen Ihre Angaben und melden uns zeitnah mit einer persönlichen Rückmeldung.",
    "",
    "Freundliche Grüße",
    siteName,
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
        <div style="border-radius:24px;background:#ffffff;border:1px solid #e2e8f0;padding:28px;">
          <div style="font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#22c55e;">Anfrage eingegangen</div>
          <h1 style="margin:12px 0 0;font-size:26px;line-height:1.15;color:#0f172a;">Vielen Dank für Ihre Anfrage.</h1>
          <p style="margin:18px 0 0;color:#334155;line-height:1.65;">${htmlEscape(name)},</p>
          <p style="margin:10px 0 0;color:#334155;line-height:1.65;">wir haben Ihre Angaben erhalten und prüfen diese für eine erste Einschätzung rund um Photovoltaik, Speicher und mögliche Fördermöglichkeiten.</p>
          <p style="margin:10px 0 0;color:#334155;line-height:1.65;">Wir melden uns zeitnah mit einer persönlichen Rückmeldung.</p>
          <p style="margin:22px 0 0;color:#0f172a;font-weight:700;">Freundliche Grüße<br>${htmlEscape(siteName)}</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html, text };
}

async function sendResendEmail(apiKey: string, payload: ResendPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Resend Fehler ${response.status}: ${body}`);
  }

  return body;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  }

  const supabaseUrl = env("SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = env("RESEND_API_KEY");
  const siteName = env("PV_SITE_NAME", "PV-System.Digital-Perfect");
  const from = env("PV_LEAD_EMAIL_FROM", "PV-System <onboarding@resend.dev>");
  const recipients = splitRecipients(env("PV_LEAD_EMAIL_TO"));
  const fallbackReplyTo = env("PV_LEAD_EMAIL_REPLY_TO");
  const sendCustomerConfirmation = env("PV_SEND_CUSTOMER_CONFIRMATION", "false").toLowerCase() === "true";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, error: "missing_supabase_server_env" }, 500);
  }

  if (!resendApiKey || recipients.length === 0) {
    return jsonResponse({ ok: false, error: "missing_email_env" }, 500);
  }

  let payload: { leadId?: unknown; force?: boolean };
  try {
    payload = await req.json();
  } catch (_error) {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  if (!isUuid(payload.leadId)) {
    return jsonResponse({ ok: false, error: "invalid_lead_id" }, 400);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("pv_leads")
    .select("*")
    .eq("id", payload.leadId)
    .single();

  if (leadError || !lead) {
    return jsonResponse({ ok: false, error: "lead_not_found" }, 404);
  }

  const now = new Date().toISOString();

  await supabaseAdmin
    .from("pv_leads")
    .update({ last_email_attempt_at: now })
    .eq("id", payload.leadId);

  if (lead.email_notification_sent_at && !payload.force) {
    return jsonResponse({ ok: true, status: "already_sent" });
  }

  const replyTo = String(lead.email || fallbackReplyTo || "").trim();
  const operatorEmail = buildOperatorEmail(lead as LeadRecord, siteName);

  try {
    await sendResendEmail(resendApiKey, {
      from,
      to: recipients,
      subject: operatorEmail.subject,
      html: operatorEmail.html,
      text: operatorEmail.text,
      ...(replyTo ? { reply_to: [replyTo] } : {}),
    });

    await supabaseAdmin
      .from("pv_leads")
      .update({
        email_notification_sent_at: new Date().toISOString(),
        email_notification_error: null,
      })
      .eq("id", payload.leadId);
  } catch (error) {
    const message = String((error as Error)?.message || error).slice(0, 2000);
    await supabaseAdmin
      .from("pv_leads")
      .update({ email_notification_error: message })
      .eq("id", payload.leadId);

    return jsonResponse({ ok: false, error: "operator_email_failed", details: message }, 502);
  }

  if (sendCustomerConfirmation && lead.email) {
    const customerEmail = buildCustomerConfirmation(lead as LeadRecord, siteName);

    try {
      await sendResendEmail(resendApiKey, {
        from,
        to: [String(lead.email)],
        subject: customerEmail.subject,
        html: customerEmail.html,
        text: customerEmail.text,
        ...(fallbackReplyTo ? { reply_to: [fallbackReplyTo] } : {}),
      });

      await supabaseAdmin
        .from("pv_leads")
        .update({
          customer_confirmation_sent_at: new Date().toISOString(),
          customer_confirmation_error: null,
        })
        .eq("id", payload.leadId);
    } catch (error) {
      const message = String((error as Error)?.message || error).slice(0, 2000);
      await supabaseAdmin
        .from("pv_leads")
        .update({ customer_confirmation_error: message })
        .eq("id", payload.leadId);
    }
  }

  return jsonResponse({ ok: true, status: "sent" });
});
