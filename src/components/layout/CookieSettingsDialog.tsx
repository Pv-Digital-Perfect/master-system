import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CookieConsentState } from "@/lib/cookie-consent";

type CookieSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Pick<CookieConsentState, "analytics" | "marketing">;
  onDraftChange: (next: Pick<CookieConsentState, "analytics" | "marketing">) => void;
  onSave: () => void;
};

export const CookieSettingsDialog = ({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onSave,
}: CookieSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-2xl rounded-[1.75rem] border border-white/10 bg-[#0F172A] p-0 text-white shadow-[0_40px_120px_-42px_rgba(0,0,0,0.72)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.18),transparent_34%),linear-gradient(135deg,rgba(249,115,22,0.16),rgba(15,23,42,0.88))] px-6 py-5 md:px-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#22C55E]/20 text-[#22C55E]">
                <ShieldCheck size={18} />
              </span>
              Cookie-Einstellungen
            </DialogTitle>
            <DialogDescription className="text-sm leading-7 text-white/70">
              Essenzielle Cookies bleiben immer aktiv. Analyse- und Marketing-Cookies werden erst nach aktiver Zustimmung geladen.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-6 md:px-8 md:py-7">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-sm font-semibold text-white">Essenzielle Cookies</Label>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Notwendig für Sicherheit, Session-Stabilität, Routing und grundlegende Funktionen.
                </p>
              </div>
              <Switch checked disabled aria-label="Essenzielle Cookies immer aktiv" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="cookie-analytics" className="text-sm font-semibold text-white">
                  Analyse & Performance
                </Label>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Aktiviert Analyse-Skripte wie Google Analytics erst nach Zustimmung.
                </p>
              </div>
              <Switch
                id="cookie-analytics"
                checked={draft.analytics}
                onCheckedChange={(checked) => onDraftChange({ ...draft, analytics: checked })}
                aria-label="Analyse Cookies"
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="cookie-marketing" className="text-sm font-semibold text-white">
                  Marketing
                </Label>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Reserviert für Kampagnen-, Retargeting- und Partner-Skripte.
                </p>
              </div>
              <Switch
                id="cookie-marketing"
                checked={draft.marketing}
                onCheckedChange={(checked) => onDraftChange({ ...draft, marketing: checked })}
                aria-label="Marketing Cookies"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button className="rounded-xl bg-[#F97316] text-white hover:bg-orange-600" onClick={onSave}>
              Auswahl speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
