import type { Locale } from "@/dictionaries";
import { getDictionary } from "@/dictionaries";
import ClientPage from "@/components/ClientPage";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (["tr", "en", "de", "ru"].includes(lang) ? lang : "tr") as Locale;
  const dict = await getDictionary(locale);

  return <ClientPage dict={dict} lang={locale} />;
}
