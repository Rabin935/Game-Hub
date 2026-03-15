import type { SnakeGameMode } from "@/types/game";

type SnakeGameProps = {
  mode: SnakeGameMode;
};

const modeContent: Record<
  SnakeGameMode,
  { badge: string; title: string; description: string; accent: string }
> = {
  free: {
    badge: "Free Mode",
    title: "Endless Snake Run",
    description:
      "Move freely, collect food, and keep the snake alive for as long as you can.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  levels: {
    badge: "Levels Mode",
    title: "Stage-Based Snake Challenge",
    description:
      "Take on level goals with a more guided progression and steadily rising pressure.",
    accent: "bg-sky-100 text-sky-700",
  },
};

export function SnakeGame({ mode }: SnakeGameProps) {
  const content = modeContent[mode];

  return (
    <section className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-5">
        <div>
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${content.accent}`}
          >
            {content.badge}
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            {content.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {content.description}
          </p>
        </div>

        <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,_#0f172a,_#1e293b)] p-5 text-white shadow-inner">
          <div className="grid aspect-square w-full place-items-center rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,_#111827,_#0f172a)]">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Snake Board
              </p>
              <p className="mt-3 text-lg font-bold">{content.badge} selected</p>
              <p className="mt-2 text-sm text-slate-300">
                This component is now ready for the playable Snake logic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
