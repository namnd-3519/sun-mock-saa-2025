"use client";

// Live board error state: the kudos feed could not be loaded on the server.
export default function KudosError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main role="alert" className="mx-auto flex min-h-[60vh] w-full max-w-[1152px] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xl font-bold text-white">Không tải được Kudos. Vui lòng thử lại. / Could not load Kudos.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded border border-brand-border px-6 py-3 text-base font-bold text-brand-accent hover:bg-brand-accent/10"
      >
        Thử lại / Retry
      </button>
    </main>
  );
}
