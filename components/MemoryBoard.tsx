"use client";

import { useEffect, useState } from "react";
import { MemoryCard } from "@/components/MemoryCard";
import { shuffleArray } from "@/lib/shuffle";
import type { MemoryCardData } from "@/types/game";

const baseCards = [
  { pairId: 1, image: "/file.svg", label: "File card" },
  { pairId: 2, image: "/globe.svg", label: "Globe card" },
  { pairId: 3, image: "/window.svg", label: "Window card" },
  { pairId: 4, image: "/next.svg", label: "Next.js card" },
  { pairId: 5, image: "/vercel.svg", label: "Vercel card" },
  { pairId: 6, image: "/games/memory-flip.svg", label: "Memory card" },
];

function createCards(): MemoryCardData[] {
  const deck = baseCards.flatMap((card) => [
    {
      id: card.pairId * 2 - 1,
      pairId: card.pairId,
      image: card.image,
      label: card.label,
      matched: false,
    },
    {
      id: card.pairId * 2,
      pairId: card.pairId,
      image: card.image,
      label: card.label,
      matched: false,
    },
  ]);

  return shuffleArray(deck);
}

export function MemoryBoard() {
  const [cards, setCards] = useState<MemoryCardData[]>(() => createCards());
  const [firstChoice, setFirstChoice] = useState<number | null>(null);
  const [secondChoice, setSecondChoice] = useState<number | null>(null);
  const [turns, setTurns] = useState(0);

  const firstCard = cards.find((card) => card.id === firstChoice) ?? null;
  const secondCard = cards.find((card) => card.id === secondChoice) ?? null;
  const matchedPairs = cards.filter((card) => card.matched).length / 2;
  const hasWon = matchedPairs === baseCards.length;
  const isResolving = secondChoice !== null;

  function resetBoard() {
    setCards(createCards());
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(0);
  }

  function handleSelect(cardId: number) {
    if (isResolving) {
      return;
    }

    const selectedCard = cards.find((card) => card.id === cardId);

    if (!selectedCard || selectedCard.matched || cardId === firstChoice) {
      return;
    }

    if (firstChoice === null) {
      setFirstChoice(cardId);
      return;
    }

    if (secondChoice === null) {
      setSecondChoice(cardId);
    }
  }

  useEffect(() => {
    if (!firstCard || !secondCard) {
      return;
    }

    const isMatch = firstCard.pairId === secondCard.pairId;

    const timeout = window.setTimeout(() => {
      if (isMatch) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.pairId === firstCard.pairId
              ? { ...card, matched: true }
              : card
          )
        );
      }

      setFirstChoice(null);
      setSecondChoice(null);
      setTurns((currentTurns) => currentTurns + 1);
    }, isMatch ? 450 : 900);

    return () => window.clearTimeout(timeout);
  }, [firstCard, secondCard]);

  return (
    <section className="w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Turns
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">{turns}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Matched
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {matchedPairs}/{baseCards.length}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetBoard}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Restart Game
        </button>
      </div>

      <div className="mt-6 min-h-14">
        {hasWon ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            You matched every card in {turns} turns. Nice work.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Pick two cards to reveal a matching pair.
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 justify-items-center gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const flipped =
            card.matched || card.id === firstChoice || card.id === secondChoice;

          return (
            <MemoryCard
              key={card.id}
              card={card}
              flipped={flipped}
              handleClick={() => handleSelect(card.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
