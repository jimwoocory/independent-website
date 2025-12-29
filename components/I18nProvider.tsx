'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import initI18n from '../i18n.init';

interface I18nProviderProps {
  children: ReactNode;
  locale: string;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    // 初始化i18next实例
    const init = async () => {
      const instance = await initI18n(locale);
      setI18nInstance(instance);
    };

    init();
  }, [locale]);

  if (!i18nInstance) {
    return null; // 或返回加载状态
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
