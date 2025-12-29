// i18n配置文件
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// 支持的语言列表
export const locales = ['en', 'zh', 'ar', 'es', 'pt', 'fr', 'ru', 'ja'];

// 默认语言
export const defaultLocale = 'zh';

// 初始化i18next
const initI18n = async (lng: string) => {
  const i18nInstance = i18next.createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string) => import(`./messages/${language}.json`)
      )
    )
    .init({
      lng,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: 'translation',
      fallbackNS: 'translation',
      ns: ['translation'],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18nInstance;
};

export default initI18n;
