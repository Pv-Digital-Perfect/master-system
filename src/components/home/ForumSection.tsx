import { Link } from "react-router-dom";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useHomeContent } from "@/hooks/useSettings";

type ForumHomePost = {
  id: string;
  title: string;
  slug: string;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  created_at: string;
  author_name?: string | null;
  seo_description?: string | null;
  category_id?: string | null;
  forum_categories?: { name?: string | null } | { name?: string | null }[] | null;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getCategoryName(post: ForumHomePost) {
  if (Array.isArray(post.forum_categories)) {
    return post.forum_categories[0]?.name || "Magazin";
  }

  return post.forum_categories?.name || "Magazin";
}

function optimizeImageUrl(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.pathname.includes("/storage/v1/render/image/public/")) {
      parsed.pathname = parsed.pathname.replace("/render/image/public/", "/object/public/");
      ["width", "height", "quality", "resize", "format"].forEach((key) => parsed.searchParams.delete(key));
      return parsed.toString();
    }

    if (parsed.pathname.includes("/storage/v1/object/public/")) {
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}

export function ForumSection() {
  const { content } = useHomeContent();
  const forumContent = content.forum;
  const postLimit = Math.max(1, Math.min(24, Number(forumContent?.count) || 12));
  const buttonUrl = forumContent?.button_url || "/forum";
  const readMoreText = forumContent?.read_more || "Artikel lesen";
  const fallbackDescription = forumContent?.fallback_description || "Lies den ganzen Beitrag im TierTarif Magazin.";

  const { data: latestPosts, isLoading } = useQuery({
    queryKey: ["home-latest-posts", postLimit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_threads")
        .select(`
          id,
          title,
          slug,
          featured_image_url,
          featured_image_alt,
          created_at,
          author_name,
          seo_description,
          category_id,
          forum_categories ( name )
        `)
        .eq("is_active", true)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(postLimit);

      if (error) throw error;
      return (data || []) as ForumHomePost[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const PostCard = ({ post }: { post: ForumHomePost }) => (
    <Link
      to={`/forum/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-100/60 focus:outline-none focus:ring-4 focus:ring-orange-500/15"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        {post.featured_image_url ? (
          <img
            src={optimizeImageUrl(post.featured_image_url)}
            alt={post.featured_image_alt || post.title}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-orange-50 text-slate-300">
            <BookOpen className="h-10 w-10 opacity-20" />
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.created_at)}
          </div>

          <div className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            <BookOpen className="h-3 w-3 text-orange-500" />
            {getCategoryName(post)}
          </div>
        </div>

        <h3 className="mb-2 min-h-[3rem] text-lg font-bold leading-tight text-slate-900 line-clamp-2 transition-colors group-hover:text-orange-500">
          {post.title}
        </h3>

        <p className="mb-4 min-h-[2.5rem] flex-grow text-sm leading-relaxed text-slate-500 line-clamp-2">
          {post.seo_description || fallbackDescription}
        </p>

        <div className="mt-auto border-t border-slate-50 pt-2">
          <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
            {readMoreText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <section className="border-t border-slate-200 bg-slate-50 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-[400px] w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!latestPosts || latestPosts.length === 0) return null;

  const showDesktopArrows = latestPosts.length > 3;
  const showMobileArrows = latestPosts.length > 1;

  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-slate-50 py-20 md:py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {forumContent?.badge && (
              <Badge variant="outline" className="mb-4 rounded-full border-orange-200 bg-orange-50 px-3 py-1 text-orange-700">
                {forumContent.badge}
              </Badge>
            )}
            <h2 className="mb-4 flex items-center gap-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              <BookOpen className="h-8 w-8 text-secondary" />
              {forumContent?.headline || "Neueste Magazin-Beiträge"}
            </h2>
            <p className="text-lg text-slate-600">
              {forumContent?.subheadline || "Aktuelle Ratgeber zu Tierversicherungen, Tierarztkosten und Tarifdetails."}
            </p>
          </div>

          <Button variant="outline" asChild className="hidden rounded-full px-6 md:flex group">
            <Link to={buttonUrl}>
              {forumContent?.button_text || "Alle Beiträge ansehen"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="relative w-full">
          <Carousel
            opts={{ align: "start", loop: false }}
            className={`w-full pb-4 ${showDesktopArrows ? "lg:px-20" : ""}`}
          >
            <CarouselContent className="-ml-4">
              {latestPosts.map((post) => (
                <CarouselItem key={post.id} className="h-full basis-[85%] pl-4 sm:basis-[60%] md:basis-[45%] lg:basis-1/3">
                  <div className="h-full py-2">
                    <PostCard post={post} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {showDesktopArrows && (
              <div className="hidden lg:block">
                <CarouselPrevious className="absolute left-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-none bg-orange-500 text-white shadow-[0_8px_30px_rgb(249,115,22,0.3)] transition-all duration-300 hover:scale-110 hover:bg-slate-900 hover:text-orange-500 disabled:pointer-events-none disabled:opacity-35" />
                <CarouselNext className="absolute right-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-none bg-orange-500 text-white shadow-[0_8px_30px_rgb(249,115,22,0.3)] transition-all duration-300 hover:scale-110 hover:bg-slate-900 hover:text-orange-500 disabled:pointer-events-none disabled:opacity-35" />
              </div>
            )}

            {showMobileArrows && (
              <div className="mt-8 flex justify-center gap-4 lg:hidden">
                <CarouselPrevious className="static h-14 w-14 translate-y-0 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm transition-all hover:bg-orange-500 hover:text-white disabled:pointer-events-none disabled:opacity-35" />
                <CarouselNext className="static h-14 w-14 translate-y-0 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 shadow-sm transition-all hover:bg-orange-500 hover:text-white disabled:pointer-events-none disabled:opacity-35" />
              </div>
            )}
          </Carousel>

          <div className="mt-6 text-center md:hidden">
            <Button asChild className="h-12 w-full rounded-xl text-base font-bold" size="lg">
              <Link to={buttonUrl}>{forumContent?.button_text || "Zum Magazin"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
