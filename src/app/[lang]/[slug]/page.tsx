import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { airportRoutes, getPoint } from "@/lib/routes";
import type { Locale } from "@/dictionaries";
import { getDictionary } from "@/dictionaries";
import RoutePageClient from "@/components/RoutePageClient";

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of ["tr", "en", "de", "ru"]) {
    for (const route of airportRoutes) {
      params.push({ lang, slug: route.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = airportRoutes.find((r) => r.slug === slug);
  if (!route) return {};
  const from = getPoint(route.from);
  const to = getPoint(route.to);
  if (!from || !to) return {};

  return {
    title: `${from.name} → ${to.name} Transfer | Antalya VIP Transfer`,
    description: `${from.name} - ${to.name} arası VIP transfer hizmeti. ${route.km} km, ~${route.min} dakika. Sabit fiyat ₺${route.price}. Mercedes araçlar, profesyonel sürücüler.`,
  };
}

export default async function RoutePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = (["tr", "en", "de", "ru"].includes(lang) ? lang : "tr") as Locale;
  const dict = await getDictionary(locale);
  const route = airportRoutes.find((r) => r.slug === slug);

  if (!route) notFound();

  const from = getPoint(route.from);
  const to = getPoint(route.to);

  if (!from || !to) notFound();

  return <RoutePageClient route={route} from={from} to={to} dict={dict} lang={locale} />;
}
