export default function SnakeGamePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7,_#f8fafc_38%,_#dbeafe_100%)] px-6 py-12">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Game Hub
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Snake Game
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            The Snake game route is ready. You can build the playable board
            here next.
          </p>
        </div>

        <section className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Coming Soon
          </div>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This page is now live at `/games/snake`, so the homepage card can
            navigate here without a 404.
          </p>
        </section>
      </main>
    </div>
  );
}
