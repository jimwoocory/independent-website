'use client';

import { useTranslations } from '@/lib/translations';
import { TrendingUp, Globe, Package, Users, DollarSign, Truck, Star, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

const statsData = [
  { 
    id: 'vehicles_shipped', 
    value: 15234, 
    suffix: '+',
    icon: Package, 
    color: 'blue',
    trend: '+12%'
  },
  { 
    id: 'countries_served', 
    value: 52, 
    suffix: '',
    icon: Globe, 
    color: 'green',
    trend: '+3'
  },
  { 
    id: 'active_customers', 
    value: 4890, 
    suffix: '+',
    icon: Users, 
    color: 'purple',
    trend: '+18%'
  },
  { 
    id: 'avg_rating', 
    value: 4.9, 
    suffix: '/5.0',
    icon: Star, 
    color: 'yellow',
    trend: '+0.1'
  },
  { 
    id: 'shipments_month', 
    value: 342, 
    suffix: '',
    icon: Truck, 
    color: 'indigo',
    trend: '+8%'
  },
  { 
    id: 'total_value', 
    value: 125, 
    suffix: 'M',
    icon: DollarSign, 
    color: 'emerald',
    trend: '+22%'
  },
  { 
    id: 'repeat_rate', 
    value: 87, 
    suffix: '%',
    icon: TrendingUp, 
    color: 'pink',
    trend: '+5%'
  },
  { 
    id: 'certifications', 
    value: 15, 
    suffix: '+',
    icon: Award, 
    color: 'orange',
    trend: '+2'
  }
];

export function StatsDashboard() {
  const t = useTranslations('stats');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    // 数字动画效果
    statsData.forEach((stat) => {
      let current = 0;
      const increment = stat.value / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        setAnimatedValues((prev) => ({ ...prev, [stat.id]: current }));
      }, 30);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const displayValue = animatedValues[stat.id] || 0;
        const formattedValue = stat.id === 'avg_rating' 
          ? displayValue.toFixed(1) 
          : Math.floor(displayValue).toLocaleString();

        return (
          <div
            key={stat.id}
            className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* 背景装饰 */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
            
            {/* 内容 */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-500/10 rounded-xl group-hover:bg-${stat.color}-500/20 transition-colors`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                {stat.trend && (
                  <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </span>
                )}
              </div>
              
              <div className="text-3xl font-bold text-white mb-1">
                {formattedValue}
                <span className={`text-${stat.color}-400 text-xl`}>{stat.suffix}</span>
              </div>
              
              <div className="text-sm text-slate-400">
                {t(stat.id)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
