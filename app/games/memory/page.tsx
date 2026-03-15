"use client";

import { MemoryBoard } from "@/components/MemoryBoard";

export default function MemoryGamePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_38%,_#e2e8f0_100%)] px-6 py-12">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Game Hub
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Memory Card Game
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Flip two cards at a time and match every pair to finish the board.
          </p>
        </div>

        <MemoryBoard />
      </main>
    </div>
  );
}
