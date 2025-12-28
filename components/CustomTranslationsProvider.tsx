'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useTranslations as useNextTranslations } from 'next-intl';

interface CustomTranslationsProviderProps {
  children: ReactNode;
  messages: any;
  locale: string;
  timeZone?: string;
}

export function CustomTranslationsProvider({
  children,
  messages,
  locale,
  timeZone
}: CustomTranslationsProviderProps) {
  // 直接使用原始的 messages 对象，不使用 Proxy
  // next-intl v3 不支持 Proxy 对象作为 messages
  
  return (
    <NextIntlClientProvider 
      messages={messages} 
      locale={locale} 
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}

// 导出增强的翻译钩子，添加错误处理
export function useTranslations(namespace?: string) {
  try {
    const t = useNextTranslations(namespace);
    
    // 返回一个增强的翻译函数，处理缺失的键
    return (key: string, options?: any) => {
      try {
        const result = t(key, options);
        return result;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Translation key "${key}"${namespace ? ` in namespace "${namespace}"` : ''} not found. ` +
            `This may cause unexpected behavior in production.`
          );
        }
        // 生产环境下返回键名作为降级
        return key;
      }
    };
  } catch (error) {
    // 如果无法获取翻译上下文（比如在服务器组件中意外使用），返回一个降级函数
    return (key: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Translation context not available. Using fallback key: "${key}". ` +
          `Make sure you're using this hook in a client component wrapped by CustomTranslationsProvider.`
        );
      }
      return key;
    };
  }
}
