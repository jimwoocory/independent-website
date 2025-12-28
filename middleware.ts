// Middleware for next-intl locale resolution
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // List of all supported locales
  locales: ['en', 'zh', 'ar', 'es', 'pt', 'fr', 'ru', 'ja'],
  // Default locale to use if no locale is detected
  defaultLocale: 'zh',
  // Always use locale prefix in URLs
  localePrefix: 'always',
});

// Apply middleware only to public routes
// Admin routes are handled separately

export const config = {
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico).*)'],
};