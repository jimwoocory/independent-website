import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {LanguageSwitcher} from "@/components/language-switcher";
import {FavoritesCount} from "@/components/favorites-count";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {getTranslations} from "@/lib/translations";
import type {Database} from "@/supabase/database.types";
import {Calendar, Clock, User, ArrowRight} from "lucide-react";

// 服务器端组件使用服务器端的getTranslations

export const revalidate = 300; // 5分钟重新验证

// 定义博客文章类型
interface Blog {
  id: string;
  title_i18n: Record<string, string>;
  content_i18n: Record<string, string>;
  slug: string;
  category: string;
  cover_image: string | null;
  created_at: string | null;
  published_at: string | null;
  author: string | null;
  status: string;
}

type Props = {
  params: {locale: string};
  searchParams: {category?: string; page?: string};
};

export default async function BlogPage({params, searchParams}: Props) {
  // 获取服务器端翻译函数
  const t = await getTranslations(params.locale);
  
  const supabase = getSupabaseServerClient();

  // 分页
  const page = Number(searchParams.page) || 1;
  const pageSize = 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 构建查询
  let query = supabase
    .from("blogs")
    .select("*", {count: "exact"})
    .eq("status", "published")  // 只显示已发布的文章
    .order("published_at", {ascending: false})
    .range(from, to);

  // 分类筛选
  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  const {data: blogs, count, error} = await query;

  if (error) {
    console.error("Blog fetch error:", error);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  const categories = ["all", "company", "industry", "knowledge"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={`/${params.locale}`} className="text-xl font-bold tracking-tight">
            {t("brand.name")}
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href={`/${params.locale}`} className="transition hover:text-blue-400">
              {t("nav.home")}
            </Link>
            <Link href={`/${params.locale}/about`} className="transition hover:text-blue-400">
              {t("nav.about")}
            </Link>
            <Link href={`/${params.locale}/vehicles`} className="transition hover:text-blue-400">
              {t("nav.vehicles")}
            </Link>
            <Link href={`/${params.locale}/blog`} className="font-semibold text-blue-400">
              {t("nav.blog")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <FavoritesCount locale={params.locale} />
            <LanguageSwitcher current={params.locale} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-white/5 bg-gradient-to-r from-indigo-950 via-slate-950 to-slate-900 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              {t("blog.badge")}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("blog.title")}
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            {t("blog.subtitle")}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b border-white/10 bg-slate-900/40 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${params.locale}/blog?category=${cat}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  (searchParams.category || "all") === cat
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-white/10 text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/10"
                }`}
              >
                {t(`blog.category.${cat}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-6 py-12">
        {blogs && blogs.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: Blog) => {
              const title = (blog.title_i18n as Record<string, string>)?.[params.locale] || "Article";
              const excerpt = (blog.content_i18n as Record<string, string>)?.[params.locale]?.substring(0, 150) + "..." || "";
              const publishedDate = blog.published_at ? new Date(blog.published_at).toLocaleDateString(params.locale) : "";

              return (
                <article
                  key={blog.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {blog.cover_image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.cover_image}
                        alt={title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {/* Category Badge */}
                    {blog.category && (
                      <span className="mb-3 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                        {t(`blog.category.${blog.category}`)}
                      </span>
                    )}
                    
                    <h2 className="mb-3 text-xl font-semibold leading-tight">
                      <Link href={`/${params.locale}/blog/${blog.slug}`} className="hover:text-blue-400">
                        {title}
                      </Link>
                    </h2>
                    
                    <p className="mb-4 line-clamp-3 text-sm text-slate-400">
                      {excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {blog.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {blog.author}
                        </span>
                      )}
                      {publishedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {publishedDate}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/${params.locale}/blog/${blog.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                      {t("blog.readMore")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 py-20 text-center">
            <p className="text-lg text-slate-400">{t("blog.noArticles")}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <Link
              href={`/${params.locale}/blog?${new URLSearchParams({...searchParams, page: String(page - 1)})}`}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                page === 1
                  ? "cursor-not-allowed border-white/5 text-slate-600"
                  : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
              }`}
              aria-disabled={page === 1}
            >
              {t("pagination.prev")}
            </Link>
            <div className="flex items-center gap-2">
              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const pageNum = page > 3 ? page - 2 + i : i + 1;
                if (pageNum > totalPages) return null;
                return (
                  <Link
                    key={pageNum}
                    href={`/${params.locale}/blog?${new URLSearchParams({...searchParams, page: String(pageNum)})}`}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      pageNum === page
                        ? "border-blue-500 bg-blue-500/20 font-semibold text-white"
                        : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/${params.locale}/blog?${new URLSearchParams({...searchParams, page: String(page + 1)})}`}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                page === totalPages
                  ? "cursor-not-allowed border-white/5 text-slate-600"
                  : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
              }`}
              aria-disabled={page === totalPages}
            >
              {t("pagination.next")}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
