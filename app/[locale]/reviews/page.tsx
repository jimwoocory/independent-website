import { useTranslations } from '@/lib/translations';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Star, Quote, MapPin, Calendar, Check, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'reviews' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

// 模拟客户评价数据
const reviews = [
  {
    id: 1,
    customer: 'Ahmed Hassan',
    company: 'Premium Motors LLC',
    location: 'Dubai, UAE',
    country: 'AE',
    rating: 5,
    date: '2025-01-15',
    verified: true,
    orderSize: '25 vehicles',
    review: 'Outstanding service from start to finish. The vehicle quality exceeded expectations, and the shipping was incredibly fast. Their team handled all customs documentation perfectly. This is our 3rd order and we\'ll definitely continue this partnership.',
    highlights: ['fast_shipping', 'quality_vehicles', 'excellent_communication']
  },
  {
    id: 2,
    customer: 'Carlos Rodriguez',
    company: 'Automotriz Sur',
    location: 'Buenos Aires, Argentina',
    country: 'AR',
    rating: 5,
    date: '2024-12-28',
    verified: true,
    orderSize: '40 vehicles',
    review: 'Best auto exporter we\'ve worked with in South America. They understand our market requirements and handle MERCOSUR compliance seamlessly. Competitive pricing and reliable delivery times.',
    highlights: ['competitive_pricing', 'market_expertise', 'reliable_delivery']
  },
  {
    id: 3,
    customer: 'John Okonkwo',
    company: 'Lagos Auto Import',
    location: 'Lagos, Nigeria',
    country: 'NG',
    rating: 5,
    date: '2024-12-10',
    verified: true,
    orderSize: '60 vehicles',
    review: 'Excellent experience importing to West Africa. They provided detailed documentation for Nigerian customs and arranged delivery to Lagos port efficiently. The vehicles arrived exactly as described.',
    highlights: ['detailed_documentation', 'accurate_description', 'efficient_logistics']
  },
  {
    id: 4,
    customer: 'Mei Chen',
    company: 'Southeast Asia Motors',
    location: 'Bangkok, Thailand',
    country: 'TH',
    rating: 5,
    date: '2024-11-22',
    verified: true,
    orderSize: '35 RHD vehicles',
    review: 'Professional team with deep knowledge of ASEAN markets. They sourced exactly the right-hand drive models we needed with tropical climate specifications. Fast turnaround from order to delivery.',
    highlights: ['rhd_expertise', 'fast_turnaround', 'regional_knowledge']
  },
  {
    id: 5,
    customer: 'Pierre Dubois',
    company: 'Euro Auto Trade',
    location: 'Paris, France',
    country: 'FR',
    rating: 4,
    date: '2024-11-05',
    verified: true,
    orderSize: '15 vehicles',
    review: 'Good quality vehicles and professional service. Delivery took slightly longer than expected due to port congestion, but they kept us informed throughout. Would recommend for European buyers.',
    highlights: ['good_quality', 'transparent_communication', 'professional_service']
  },
  {
    id: 6,
    customer: 'Maria Silva',
    company: 'Brasil Auto Distribuidora',
    location: 'São Paulo, Brazil',
    country: 'BR',
    rating: 5,
    date: '2024-10-18',
    verified: true,
    orderSize: '50 vehicles',
    review: 'Exceptional partner for Brazilian market. They handled all MERCOSUR certifications and provided comprehensive support with customs brokerage. Our customers are very satisfied with vehicle quality.',
    highlights: ['certification_support', 'customs_assistance', 'customer_satisfaction']
  }
];

const stats = [
  { label: 'Average Rating', value: '4.9', suffix: '/5.0', icon: Star },
  { label: 'Total Reviews', value: '1,245', suffix: '+', icon: Quote },
  { label: 'Verified Buyers', value: '98', suffix: '%', icon: Check },
  { label: 'Repeat Customers', value: '87', suffix: '%', icon: TrendingUp }
];

export default function ReviewsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-blue-400" />
              <ReviewsBadge />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              <ReviewsTitle />
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              <ReviewsSubtitle />
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} locale={locale} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              <LoadMoreButton />
            </button>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <CTAButton />
              </Link>
              <Link
                href={`/${locale}/vehicles`}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300"
              >
                <CTASecondary />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewsBadge() {
  const t = useTranslations('reviews');
  return <span>{t('badge')}</span>;
}

function ReviewsTitle() {
  const t = useTranslations('reviews');
  return <span>{t('title')}</span>;
}

function ReviewsSubtitle() {
  const t = useTranslations('reviews');
  return <span>{t('subtitle')}</span>;
}

function LoadMoreButton() {
  const t = useTranslations('reviews');
  return <span>{t('loadMore')}</span>;
}

function CTATitle() {
  const t = useTranslations('reviews.cta');
  return <span>{t('title')}</span>;
}

function CTASubtitle() {
  const t = useTranslations('reviews.cta');
  return <span>{t('subtitle')}</span>;
}

function CTAButton() {
  const t = useTranslations('reviews.cta');
  return <span>{t('button')}</span>;
}

function CTASecondary() {
  const t = useTranslations('reviews.cta');
  return <span>{t('secondary')}</span>;
}

function StatCard({ stat, locale }: { stat: any; locale: string }) {
  const t = useTranslations('reviews.stats');
  const Icon = stat.icon;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-blue-500/50 transition-all duration-300">
      <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
      <div className="text-3xl font-bold text-white mb-1">
        {stat.value}
        <span className="text-blue-400">{stat.suffix}</span>
      </div>
      <div className="text-sm text-slate-400">{t(stat.label.toLowerCase().replace(/\s+/g, '_'))}</div>
    </div>
  );
}

function ReviewCard({ review, locale }: { review: any; locale: string }) {
  const t = useTranslations('reviews');

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Customer Info */}
        <div className="md:w-1/4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {review.customer.charAt(0)}
            </div>
            <div>
              <h3 className="text-white font-semibold">{review.customer}</h3>
              <p className="text-sm text-slate-400">{review.company}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{review.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(review.date).toLocaleDateString(locale, { year: 'numeric', month: 'long' })}</span>
            </div>
            {review.verified && (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">{t('verified')}</span>
              </div>
            )}
          </div>

          <div className="mt-4 bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium">
            {review.orderSize}
          </div>
        </div>

        {/* Right: Review Content */}
        <div className="md:w-3/4">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
              />
            ))}
            <span className="text-white font-semibold ml-2">{review.rating}.0</span>
          </div>

          {/* Review Text */}
          <Quote className="w-8 h-8 text-blue-400/30 mb-2" />
          <p className="text-slate-200 text-lg leading-relaxed mb-6">
            {review.review}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {review.highlights.map((highlight: string) => (
              <span
                key={highlight}
                className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm"
              >
                {t(`highlights.${highlight}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
