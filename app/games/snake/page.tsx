"use client";

import { useState } from "react";
import { SnakeGame } from "@/components/SnakeGame";
import type { SnakeGameMode } from "@/types/game";

const gameModes: Array<{
  mode: SnakeGameMode;
  title: string;
  description: string;
}> = [
  {
    mode: "free",
    title: "Free Mode",
    description: "Play endlessly and chase your best survival score.",
  },
  {
    mode: "levels",
    title: "Levels Mode",
    description: "Progress through structured stages with rising difficulty.",
  },
];

export default function SnakeGamePage() {
  const [selectedMode, setSelectedMode] = useState<SnakeGameMode>("free");

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
            Pick a game mode to launch the Snake board.
          </p>
        </div>

        <section className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          {gameModes.map((gameMode) => {
            const isActive = selectedMode === gameMode.mode;

            return (
              <button
                key={gameMode.mode}
                type="button"
                onClick={() => setSelectedMode(gameMode.mode)}
                className={`rounded-[1.75rem] border p-6 text-left shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 ${
                  isActive
                    ? "border-emerald-400 bg-emerald-50 text-slate-900"
                    : "border-white/70 bg-white/85 text-slate-700"
                }`}
              >
                <p className="text-lg font-black">{gameMode.title}</p>
                <p className="mt-2 text-sm leading-6 text-inherit/80">
                  {gameMode.description}
                </p>
              </button>
            );
          })}
        </section>

        <SnakeGame mode={selectedMode} />
      </main>
    </div>
  );
}
