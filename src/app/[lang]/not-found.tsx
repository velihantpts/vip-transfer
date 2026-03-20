import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-center px-6">
        <p className="text-6xl font-semibold text-text mb-4">404</p>
        <h1 className="text-xl font-semibold text-text mb-2">Sayfa Bulunamadı</h1>
        <p className="text-sm text-secondary mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/tr" className="btn-primary px-6 py-2.5 rounded-full inline-block">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
