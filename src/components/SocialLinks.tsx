import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useFooterConfig } from "@/hooks/useSettings";

type SocialPlatform = "facebook" | "instagram";

type SocialLinkConfig = {
  url?: string | null;
  enabled?: boolean | null;
};

type SocialLinksConfig = Partial<Record<SocialPlatform, SocialLinkConfig | string | null>> | SocialLinkConfig[] | null | undefined;

type SocialLinksVariant = "footer" | "mobileMenu";

type SocialLinksProps = {
  variant?: SocialLinksVariant;
  className?: string;
};

const PLATFORM_META: Record<SocialPlatform, { label: string; shortLabel: string; icon: (className?: string) => JSX.Element }> = {
  facebook: {
    label: "Facebook",
    shortLabel: "FB",
    icon: (className) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M14.2 8.35V6.7c0-.77.18-1.3 1.32-1.3h1.57V2.55A21.46 21.46 0 0 0 14.8 2.43c-2.27 0-3.83 1.39-3.83 3.94v1.98H8.4v3.19h2.57v8.03h3.15v-8.03h2.63l.42-3.19H14.2Z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    shortLabel: "IG",
    icon: (className) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
};

const VARIANT_CLASSES: Record<SocialLinksVariant, { wrapper: string; title: string; list: string; link: string; icon: string; label: string }> = {
  footer: {
    wrapper: "mt-5",
    title: "mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary/70",
    list: "flex flex-wrap items-center gap-2",
    link: "group inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-white/70 text-secondary shadow-sm shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/45 hover:bg-white hover:text-secondary hover:shadow-md hover:shadow-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
    icon: "h-4 w-4",
    label: "sr-only",
  },
  mobileMenu: {
    wrapper: "mt-2 pt-2",
    title: "mb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400",
    list: "flex items-center justify-center gap-3",
    link: "group inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary shadow-sm shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary hover:text-white hover:shadow-md hover:shadow-secondary/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
    icon: "h-4 w-4",
    label: "sr-only",
  },
};

function normalizeSocialLinks(config: SocialLinksConfig) {
  const entries = ["facebook", "instagram"] as SocialPlatform[];

  if (Array.isArray(config)) {
    return entries
      .map((platform) => {
        const match = config.find((item: any) => String(item?.platform || item?.id || "").toLowerCase() === platform);
        const url = String((match as any)?.url || "").trim();
        return { platform, url, enabled: (match as any)?.enabled !== false };
      })
      .filter((item) => item.enabled && item.url);
  }

  return entries
    .map((platform) => {
      const raw = config?.[platform];
      const url = typeof raw === "string" ? raw : String(raw?.url || "").trim();
      const enabled = typeof raw === "string" ? true : raw?.enabled !== false;
      return { platform, url: String(url || "").trim(), enabled };
    })
    .filter((item) => item.enabled && item.url);
}

export function SocialLinks({ variant = "footer", className }: SocialLinksProps) {
  const footerConfig = useFooterConfig();
  const classes = VARIANT_CLASSES[variant];

  const links = useMemo(() => normalizeSocialLinks((footerConfig as any)?.social_links), [footerConfig]);

  if (!links.length) return null;

  return (
    <div className={cn(classes.wrapper, className)}>
      <div className={classes.title}>Social Media</div>
      <div className={classes.list}>
        {links.map(({ platform, url }) => {
          const meta = PLATFORM_META[platform];
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`TierTarif auf ${meta.label} öffnen`}
              className={classes.link}
            >
              {meta.icon(classes.icon)}
              <span className={classes.label}>{meta.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
