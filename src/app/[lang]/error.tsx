"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-center px-6">
        <p className="text-4xl font-semibold text-text mb-4">Bir şeyler ters gitti</p>
        <p className="text-sm text-secondary mb-8">Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.</p>
        <button onClick={reset} className="btn-primary px-6 py-2.5 rounded-full">
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
