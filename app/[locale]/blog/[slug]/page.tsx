import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {LanguageSwitcher} from "@/components/language-switcher";
import {FavoritesCount} from "@/components/favorites-count";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {getTranslations} from "@/lib/translations";
import type {Database} from "@/supabase/database.types";
import {Calendar, User, ArrowLeft, Share2} from "lucide-react";
import {notFound} from "next/navigation";

// 服务器端组件使用服务器端的getTranslations

export const revalidate = 600; // 10分钟

type Props = {
  params: {locale: string; slug: string};
};

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
}

export default async function BlogDetailPage({params}: Props) {
  // 获取服务器端翻译函数
  const t = await getTranslations(params.locale);
  
  const supabase = getSupabaseServerClient();

  // 获取文章
  const {data: blog, error} = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  const title = (blog.title_i18n as Record<string, string>)?.[params.locale] || "Article";
  const content = (blog.content_i18n as Record<string, string>)?.[params.locale] || "";
  const publishedDate = blog.published_at ? new Date(blog.published_at).toLocaleDateString(params.locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";

  // 获取相关文章
  const {data: relatedBlogs} = await supabase
    .from("blogs")
    .select("*")
    .eq("category", blog.category)
    .neq("id", blog.id)
    .limit(3);

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
            <Link href={`/${params.locale}/blog`} className="transition hover:text-blue-400">
              {t("nav.blog")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <FavoritesCount locale={params.locale} />
            <LanguageSwitcher current={params.locale} />
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href={`/${params.locale}/blog`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("blog.backToList")}
        </Link>

        <div className="mx-auto max-w-4xl">
          {/* Category Badge */}
          {blog.category && (
            <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-300">
              {t(`blog.category.${blog.category}`)}
            </span>
          )}

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-white/10 pb-6 text-sm text-slate-400">
            {blog.author && (
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {blog.author}
              </span>
            )}
            {publishedDate && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {publishedDate}
              </span>
            )}
            <button className="ml-auto flex items-center gap-2 transition hover:text-white">
              <Share2 className="h-4 w-4" />
              {t("blog.share")}
            </button>
          </div>

          {/* Cover Image */}
          {blog.cover_image && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={blog.cover_image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{__html: content.replace(/\n/g, '<br />')}}
            />
          </div>

          {/* Tags (future) */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm text-slate-500">{t("blog.tags")}:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
                {t("brand.name")}
              </span>
              <span className="rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
                {t(`blog.category.${blog.category}`)}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="border-t border-white/10 bg-slate-900/40 py-16">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-center text-3xl font-bold">
              {t("blog.relatedArticles")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog: Blog) => {
                const relatedTitle = (relatedBlog.title_i18n as Record<string, string>)?.[params.locale] || "Article";
                const relatedExcerpt = (relatedBlog.content_i18n as Record<string, string>)?.[params.locale]?.substring(0, 100) + "..." || "";

                return (
                  <Link
                    key={relatedBlog.id}
                    href={`/${params.locale}/blog/${relatedBlog.slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition hover:border-blue-500/50"
                  >
                    {relatedBlog.cover_image && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedBlog.cover_image}
                          alt={relatedTitle}
                          fill
                          className="object-cover transition group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="mb-2 font-semibold group-hover:text-blue-400">
                        {relatedTitle}
                      </h3>
                      <p className="line-clamp-2 text-sm text-slate-400">
                        {relatedExcerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
