import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  DEFAULT_SITE_URL,
  buildAbsoluteSiteUrl,
  getCategoriesRoute,
  getCategoryRoute,
  getForumIndexRoute,
  getForumThreadRoute,
  normalizeRoutePath,
} from "../_shared/routes.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const BUCKET_NAME = "seo-assets";
const SITEMAP_PATH = "sitemap.xml";
const ABOUT_PAGE_SETTING_KEY = "about_page_content";
const DEFAULT_ABOUT_SLUG = "ueber-uns";
const XML_CONTENT_TYPE = "application/xml";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function getEnv(name: string, aliases: string[] = []) {
  const keys = [name, ...aliases];

  for (const key of keys) {
    const value = Deno.env.get(key)?.trim();
    if (value) return value;
  }

  throw new Error(`Missing environment variable: ${keys.join(" or ")}`);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getIsoDate(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getAboutPagePath(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return normalizeRoutePath(DEFAULT_ABOUT_SLUG);
  }

  const content = value as Record<string, unknown>;
  const isEnabled = getBooleanValue(content.enabled ?? content.is_enabled, true);

  if (!isEnabled) {
    return null;
  }

  const slug = getStringValue(content.slug) || DEFAULT_ABOUT_SLUG;
  return normalizeRoutePath(slug);
}

function isAdminRole(row: Record<string, unknown>) {
  return String(row.role || "").toUpperCase() === "ADMIN";
}

async function ensureAdminUser(
  supabaseUrl: string,
  supabaseAnonKey: string,
  serviceRoleKey: string,
  authHeader: string,
) {
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    throw new Error(`Unauthorized: ${userError?.message || "No authenticated user"}`);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: roleRows, error: roleError } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .limit(10);

  if (roleError) {
    throw new Error(`Admin role check failed: ${roleError.message}`);
  }

  if ((roleRows || []).some((row: Record<string, unknown>) => isAdminRole(row))) {
    return { user, adminClient };
  }

  // Fallback für ältere Builds, falls das Projekt zusätzlich profiles.is_admin verwendet.
  try {
    const { data: profileRow, error: profileError } = await adminClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileError && profileRow?.is_admin) {
      return { user, adminClient };
    }
  } catch (_) {
    // Kein harter Fehler: user_roles ist die maßgebliche Admin-Quelle.
  }

  throw new Error("Forbidden: authenticated user is not ADMIN");
}

type UrlEntry = {
  path: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
};

function addUrl(
  map: Map<string, UrlEntry>,
  path: string,
  lastmod: string,
  changefreq: UrlEntry["changefreq"],
  priority: string,
) {
  const normalizedPath = normalizeRoutePath(path);
  if (!normalizedPath) return;

  const existing = map.get(normalizedPath);
  if (!existing || existing.lastmod < lastmod) {
    map.set(normalizedPath, {
      path: normalizedPath,
      lastmod,
      changefreq,
      priority,
    });
  }
}

async function ensurePublicBucket(adminClient: ReturnType<typeof createClient>) {
  const { data: buckets, error: bucketsError } = await adminClient.storage.listBuckets();
  if (bucketsError) {
    throw new Error(`Storage bucket list failed: ${bucketsError.message}`);
  }

  const exists = (buckets ?? []).some((bucket) => bucket.name === BUCKET_NAME || bucket.id === BUCKET_NAME);

  if (!exists) {
    const { error: createBucketError } = await adminClient.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: [XML_CONTENT_TYPE, "text/xml"],
    });

    if (createBucketError && !createBucketError.message.toLowerCase().includes("already exists")) {
      throw new Error(`Storage bucket create failed: ${createBucketError.message}`);
    }

    return;
  }

  const { error: updateBucketError } = await adminClient.storage.updateBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: [XML_CONTENT_TYPE, "text/xml"],
  });

  if (updateBucketError) {
    throw new Error(`Storage bucket update failed: ${updateBucketError.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization")?.trim();
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY", ["SUPABASE_PUBLISHABLE_KEY"]);
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY", ["SERVICE_ROLE_KEY"]);
    const siteUrl = Deno.env.get("SITE_URL")?.trim() || DEFAULT_SITE_URL;

    const { adminClient } = await ensureAdminUser(
      supabaseUrl,
      supabaseAnonKey,
      serviceRoleKey,
      authHeader,
    );

    const [categoriesResult, forumThreadsResult, aboutPageResult] = await Promise.all([
      adminClient
        .from("categories")
        .select("slug, updated_at, created_at")
        .eq("is_active", true),
      adminClient
        .from("forum_threads")
        .select("slug, updated_at, created_at")
        .eq("is_active", true)
        .eq("status", "published"),
      adminClient
        .from("settings")
        .select("value, updated_at")
        .eq("key", ABOUT_PAGE_SETTING_KEY)
        .maybeSingle(),
    ]);

    if (categoriesResult.error) throw new Error(`Categories query failed: ${categoriesResult.error.message}`);
    if (forumThreadsResult.error) throw new Error(`Forum threads query failed: ${forumThreadsResult.error.message}`);
    if (aboutPageResult.error) throw new Error(`About page query failed: ${aboutPageResult.error.message}`);

    const urlMap = new Map<string, UrlEntry>();
    const today = getIsoDate();

    addUrl(urlMap, "/", today, "daily", "1.0");
    addUrl(urlMap, getCategoriesRoute(), today, "daily", "0.9");
    addUrl(urlMap, getForumIndexRoute(), today, "daily", "0.8");
    addUrl(urlMap, "/kontakt", today, "monthly", "0.4");
    addUrl(urlMap, "/impressum", today, "monthly", "0.3");
    addUrl(urlMap, "/datenschutz", today, "monthly", "0.3");
    addUrl(urlMap, "/agb", today, "monthly", "0.3");
    addUrl(urlMap, "/wie-wir-vergleichen", today, "monthly", "0.5");

    const aboutPath = getAboutPagePath(aboutPageResult.data?.value ?? null);
    if (aboutPath) {
      addUrl(
        urlMap,
        aboutPath,
        getIsoDate(aboutPageResult.data?.updated_at),
        "monthly",
        "0.5",
      );
    }

    for (const category of categoriesResult.data ?? []) {
      const slug = String(category.slug ?? "").trim();
      if (!slug) continue;
      addUrl(urlMap, getCategoryRoute(slug), getIsoDate(category.updated_at ?? category.created_at), "weekly", "0.8");
    }

    // Partner-/Affiliate-Projekte liegen bei TierTarif hinter /go/-Redirects.
    // Diese Routen bleiben bewusst aus der Sitemap, damit Google keine Tracking-/Outbound-Routen crawlt.

    for (const thread of forumThreadsResult.data ?? []) {
      const slug = String(thread.slug ?? "").trim();
      if (!slug) continue;
      addUrl(urlMap, getForumThreadRoute(slug), getIsoDate(thread.updated_at ?? thread.created_at), "weekly", "0.7");
    }

    const urlEntries = Array.from(urlMap.values()).sort((a, b) => a.path.localeCompare(b.path));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries
      .map((entry) => `  <url>\n    <loc>${escapeXml(buildAbsoluteSiteUrl(entry.path, siteUrl))}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`)
      .join("\n")}\n</urlset>`;

    await ensurePublicBucket(adminClient);

    const sitemapFile = new File([xml], SITEMAP_PATH, { type: XML_CONTENT_TYPE });

    const { error: uploadError } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(SITEMAP_PATH, sitemapFile, {
        upsert: true,
        contentType: XML_CONTENT_TYPE,
        cacheControl: "300",
      });

    if (uploadError) {
      throw new Error(`Sitemap upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(SITEMAP_PATH);

    return json({
      success: true,
      bucket: BUCKET_NAME,
      path: SITEMAP_PATH,
      url_count: urlEntries.length,
      public_url: publicUrlData.publicUrl,
      site_url: siteUrl,
      about_page_path: aboutPath,
      about_page_included: Boolean(aboutPath && urlMap.has(aboutPath)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.startsWith("Unauthorized") || message === "Missing Authorization header"
      ? 401
      : message.startsWith("Forbidden")
        ? 403
        : 500;

    console.error("generate-sitemap failed", message);

    return json(
      {
        success: false,
        error: message,
      },
      status,
    );
  }
});
