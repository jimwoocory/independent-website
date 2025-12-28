'use client';

import { useTranslations } from '@/lib/translations';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Car, Truck, Users, Zap } from 'lucide-react';

const categories = [
  { id: 'all', icon: Car, color: 'blue' },
  { id: 'suv', icon: Car, color: 'indigo' },
  { id: 'sedan', icon: Car, color: 'purple' },
  { id: 'mpv', icon: Users, color: 'pink' },
  { id: 'pickup', icon: Truck, color: 'orange' },
  { id: 'ev', icon: Zap, color: 'green' }
];

const popularBrands = [
  'toyota',
  'honda',
  'nissan',
  'ford',
  'byd',
  'mazda',
  'volkswagen',
  'hyundai'
];

interface VehicleQuickFilterProps {
  locale: string;
}

export function VehicleQuickFilter({ locale }: VehicleQuickFilterProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
      {/* Category Quick Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Car className="w-4 h-4" />
          {t('filters.category')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = currentCategory === category.id;
            
            return (
              <Link
                key={category.id}
                href={`/${locale}/vehicles?category=${category.id}`}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
                  ${isActive 
                    ? `bg-${category.color}-500/20 border-${category.color}-500/50 text-${category.color}-400` 
                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white'
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{t(`filters.${category.id}`)}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Brand Quick Filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">
          {t('filters.brand')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/vehicles?brand=all${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}`}
            className={`
              px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300
              ${currentBrand === 'all'
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white'
              }
            `}
          >
            {t('filters.all')}
          </Link>
          {popularBrands.map((brand) => {
            const isActive = currentBrand === brand;
            
            return (
              <Link
                key={brand}
                href={`/${locale}/vehicles?brand=${brand}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}`}
                className={`
                  px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all duration-300
                  ${isActive
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white'
                  }
                `}
              >
                {brand}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(currentCategory !== 'all' || currentBrand !== 'all') && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>{t('filters.noActive')}</span>
              {currentCategory !== 'all' && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                  {t(`filters.${currentCategory}`)}
                </span>
              )}
              {currentBrand !== 'all' && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full capitalize">
                  {currentBrand}
                </span>
              )}
            </div>
            <Link
              href={`/${locale}/vehicles`}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('vehicles.clearFilters')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
