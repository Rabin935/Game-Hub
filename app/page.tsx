import Image from "next/image";
import Link from "next/link";
import type { HubGame } from "@/types/game";

const games: HubGame[] = [
  {
    title: "Memory Flip Game",
    href: "/games/memory",
    image: "/games/memory-flip.svg",
    description: "Match every pair and clear the board as fast as you can.",
    ctaLabel: "Play",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_32%,_#e2e8f0_100%)]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10 lg:px-12">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium tracking-[0.2em] text-slate-600 uppercase backdrop-blur">
            Play. Challenge. Repeat.
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Game Hub
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Jump into quick browser games from one dashboard. Start with the
            memory challenge below, and grow the collection with routes like
            `/games/snake`, `/games/tictactoe`, and `/games/typing`.
          </p>
        </div>

        <section className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-35px_rgba(15,23,42,0.65)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,_#fef3c7,_#fde68a_30%,_#bfdbfe)]">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {game.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {game.description}
                  </p>
                </div>

                <span className="inline-flex shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-amber-500 group-hover:text-slate-950">
                  {game.ctaLabel}
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
