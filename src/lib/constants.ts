import { buildSiteUrl, siteConfig } from "@/config/siteConfig";

export const DEFAULT_BRAND_NAME = siteConfig.brandName;
export const DEFAULT_SITE_URL = siteConfig.siteUrl;
export const DEFAULT_CONTACT_EMAIL = siteConfig.contact.email;
export const DEFAULT_SITE_DESCRIPTION = siteConfig.siteDescription;
export const DEFAULT_AUTHOR_NAME = siteConfig.brandName;
export const DEFAULT_ASSISTANT_IMAGE = siteConfig.assets.assistantImage;
export const DEFAULT_HERO_IMAGE = siteConfig.assets.defaultHeroImage;

export function buildAbsoluteSiteUrl(path = "/") {
  return buildSiteUrl(path);
}
