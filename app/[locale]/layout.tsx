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
