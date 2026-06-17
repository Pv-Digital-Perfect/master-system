import { supabase } from "@/integrations/supabase/client";

type LeadNotificationSource = "offer_request" | "contact_form" | "pv_calculator" | string;

type NotifyLeadOptions = {
  leadId?: string | null;
  source?: LeadNotificationSource;
};

const LEAD_NOTIFICATION_TIMEOUT_MS = 4500;

function timeoutAfter(ms: number) {
  return new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error("Benachrichtigungsfunktion hat zu lange gebraucht.")), ms);
  });
}

export async function notifyLeadByEmail({ leadId, source }: NotifyLeadOptions) {
  if (!leadId) {
    return { ok: false, reason: "missing_lead_id" };
  }

  try {
    const result = await Promise.race([
      supabase.functions.invoke("send-pv-lead-email", {
        body: { leadId, source },
      }),
      timeoutAfter(LEAD_NOTIFICATION_TIMEOUT_MS),
    ]);

    if ("error" in result && result.error) {
      console.warn("Lead-Benachrichtigung fehlgeschlagen:", result.error);
      return { ok: false, reason: String(result.error.message || result.error) };
    }

    return { ok: true };
  } catch (error) {
    console.warn("Lead-Benachrichtigung fehlgeschlagen:", error);
    return { ok: false, reason: String((error as Error)?.message || error) };
  }
}
