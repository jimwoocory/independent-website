// next-intl request configuration for v3.x
// Note: For next-intl v3, this must export a FUNCTION, not an object
// In v3.11.0, we don't need to return locale explicitly - middleware handles it

export default function getRequestConfig() {
  return {
    locales: ['en', 'zh', 'ar', 'es', 'pt', 'fr', 'ru', 'ja'],
    defaultLocale: 'zh',
    localePrefix: 'always',
  };
}