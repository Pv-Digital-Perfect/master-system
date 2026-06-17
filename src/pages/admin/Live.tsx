import type { ReactNode } from "react";
import { ExternalLink, Globe, Lock, MapPinned, Settings, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activePackageLabel, activePublicPageLinks, externalToolLinks, internalAdminLinks, lockedPublicPageLinks, technicalPublicLinks } from "@/config/adminConfig";
import { siteConfig } from "@/config/siteConfig";

function openLink(href: string, type: "internal" | "external") {
  const url = type === "external" ? href : href;
  window.open(url, "_blank", "noopener,noreferrer");
}

function LinkGrid({ title, description, icon, links, emptyText }: { title: string; description: string; icon: ReactNode; links: { label: string; href: string; description?: string; type: "internal" | "external" }[]; emptyText?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {links.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <button key={`${link.label}-${link.href}`} onClick={() => openLink(link.href, link.type)} className="rounded-2xl border border-border bg-background p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-foreground">{link.label}</div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{link.href}</div>
                {link.description ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{link.description}</p> : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{emptyText || "Keine Links hinterlegt."}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminLive() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Live-Seiten</h2>
          <p className="mt-2 text-muted-foreground">Schnellzugriff auf aktive Website-Seiten, wichtige Dateien und Verwaltungsbereiche.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-emerald-600 px-4 py-2 text-white">Paket: {activePackageLabel}</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-2">{siteConfig.siteUrl}</Badge>
        </div>
      </div>

      <LinkGrid title="Aktive öffentliche Seiten" description="Diese Seiten sind aktuell sichtbar und sollten regelmäßig geprüft werden." icon={<Globe className="h-5 w-5 text-emerald-600" />} links={activePublicPageLinks} />
      <LinkGrid title="Technische Dateien" description="Sitemap und robots.txt direkt öffnen und prüfen." icon={<MapPinned className="h-5 w-5 text-orange-500" />} links={technicalPublicLinks} />
      <LinkGrid title="Admin-Bereiche" description="Interne Bereiche zur schnellen Navigation." icon={<Settings className="h-5 w-5 text-blue-600" />} links={internalAdminLinks} />
      <LinkGrid title="Weitere Verwaltung" description="Zusätzliche Verwaltungslinks können hinterlegt werden, wenn sie benötigt werden." icon={<ShieldCheck className="h-5 w-5 text-violet-600" />} links={externalToolLinks} emptyText="Keine weiteren Verwaltungslinks hinterlegt." />

      {lockedPublicPageLinks.length ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-950"><Lock className="h-5 w-5" /> Nicht aktive Seiten</CardTitle>
            <p className="text-sm text-orange-900/80">Diese Seiten sind aktuell nicht sichtbar.</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lockedPublicPageLinks.map((link) => (
              <div key={link.href} className="rounded-2xl border border-orange-200 bg-white p-4">
                <div className="font-black text-orange-950">{link.label}</div>
                <div className="mt-1 text-xs text-orange-900/70">{link.href}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-black text-emerald-950">Live-Prüfung</div>
            <p className="mt-1 text-sm text-emerald-900/80">Nach Änderungen: aktive Seiten, Formular, Mailstatus und mobile Darstellung kurz prüfen.</p>
          </div>
          <Button onClick={() => window.open(siteConfig.siteUrl, "_blank", "noopener,noreferrer")} className="rounded-full bg-emerald-600 font-black text-white hover:bg-emerald-700">Website öffnen</Button>
        </CardContent>
      </Card>
    </div>
  );
}
