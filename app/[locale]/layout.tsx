import "../globals.css";
import {notFound} from "next/navigation";
import {CustomTranslationsProvider} from "@/components/CustomTranslationsProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // 验证语言是否支持，提前拦截
  const supportedLocales = ['en', 'zh', 'ar', 'es', 'pt', 'fr', 'ru', 'ja'];
  if (!supportedLocales.includes(params.locale)) {
    notFound();
  }

  let messages;
  try {
    // Use a more robust way to load messages
    messages = (await import(`@/messages/${params.locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${params.locale}:`, error);
    notFound();
  }

  return (
    <CustomTranslationsProvider locale={params.locale} messages={messages}>
      {children}
    </CustomTranslationsProvider>
  );
}

