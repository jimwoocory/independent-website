import { useTranslations } from '@/lib/translations';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { FileDown, Video, BookOpen, HelpCircle, FileText, Package } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'resources' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

const resourceCategories = [
  {
    id: 'downloads',
    icon: FileDown,
    items: [
      { type: 'catalog', fileSize: '12.5 MB', format: 'PDF' },
      { type: 'priceList', fileSize: '2.3 MB', format: 'Excel' },
      { type: 'specifications', fileSize: '8.7 MB', format: 'PDF' },
      { type: 'shippingGuide', fileSize: '5.2 MB', format: 'PDF' },
    ]
  },
  {
    id: 'guides',
    icon: BookOpen,
    items: [
      { type: 'buyingGuide', duration: '12 min read' },
      { type: 'importProcess', duration: '15 min read' },
      { type: 'customsClearance', duration: '10 min read' },
      { type: 'paymentOptions', duration: '8 min read' },
    ]
  },
  {
    id: 'videos',
    icon: Video,
    items: [
      { type: 'factoryTour', duration: '5:32', views: '12.5K' },
      { type: 'inspectionProcess', duration: '8:15', views: '9.2K' },
      { type: 'shippingProcess', duration: '6:48', views: '11.8K' },
      { type: 'customerStories', duration: '4:20', views: '15.3K' },
    ]
  }
];

const faqs = [
  { category: 'general', count: 8 },
  { category: 'shipping', count: 12 },
  { category: 'payment', count: 6 },
  { category: 'customs', count: 10 },
  { category: 'warranty', count: 5 },
];

export default function ResourcesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              <ResourceBadge />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              <ResourceTitle />
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              <ResourceSubtitle />
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {resourceCategories.map((category) => (
              <ResourceCategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">
              <FAQTitle />
            </h2>
            <p className="text-slate-300 text-lg">
              <FAQSubtitle />
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <FAQCard key={faq.category} faq={faq} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              <CTATitle />
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              <CTASubtitle />
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              <CTAButton />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResourceBadge() {
  const t = useTranslations('resources');
  return <span>{t('badge')}</span>;
}

function ResourceTitle() {
  const t = useTranslations('resources');
  return <span>{t('title')}</span>;
}

function ResourceSubtitle() {
  const t = useTranslations('resources');
  return <span>{t('subtitle')}</span>;
}

function FAQTitle() {
  const t = useTranslations('resources.faq');
  return <span>{t('title')}</span>;
}

function FAQSubtitle() {
  const t = useTranslations('resources.faq');
  return <span>{t('subtitle')}</span>;
}

function CTATitle() {
  const t = useTranslations('resources.cta');
  return <span>{t('title')}</span>;
}

function CTASubtitle() {
  const t = useTranslations('resources.cta');
  return <span>{t('subtitle')}</span>;
}

function CTAButton() {
  const t = useTranslations('resources.cta');
  return <span>{t('button')}</span>;
}

function ResourceCategoryCard({ category, locale }: { category: any; locale: string }) {
  const t = useTranslations('resources');
  const Icon = category.icon;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">{t(`${category.id}.title`)}</h3>
      </div>

      <div className="space-y-4">
        {category.items.map((item: any) => (
          <div
            key={item.type}
            className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer group/item"
          >
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1 group-hover/item:text-blue-400 transition-colors">
                {t(`${category.id}.items.${item.type}`)}
              </h4>
              <p className="text-sm text-slate-400">
                {item.fileSize && `${item.fileSize} • ${item.format}`}
                {item.duration && !item.views && item.duration}
                {item.duration && item.views && `${item.duration} • ${item.views} views`}
              </p>
            </div>
            <FileDown className="w-5 h-5 text-slate-400 group-hover/item:text-blue-400 transition-colors" />
          </div>
        ))}
      </div>

      <Link
        href={`/${locale}/resources/${category.id}`}
        className="mt-6 flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
      >
        {t('viewAll')} →
      </Link>
    </div>
  );
}

function FAQCard({ faq, locale }: { faq: any; locale: string }) {
  const t = useTranslations('resources.faq.categories');

  return (
    <Link
      href={`/${locale}/resources/faq?category=${faq.category}`}
      className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <HelpCircle className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform" />
        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
          {faq.count}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {t(`${faq.category}.title`)}
      </h3>
      <p className="text-slate-400 text-sm">
        {t(`${faq.category}.description`)}
      </p>
    </Link>
  );
}
