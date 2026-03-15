"use client";

import { useEffect, useState } from "react";
import { MemoryCard } from "@/components/MemoryCard";
import { shuffleArray } from "@/lib/shuffle";
import type { MemoryCardData } from "@/types/game";

const memoryImages = [
  { pairId: 1, image: "/images/cat.png", label: "Cat card" },
  { pairId: 2, image: "/images/dog.png", label: "Dog card" },
  { pairId: 3, image: "/images/lion.png", label: "Lion card" },
  { pairId: 4, image: "/images/tiger.png", label: "Tiger card" },
  { pairId: 5, image: "/images/fox.png", label: "Fox card" },
  { pairId: 6, image: "/images/panda.png", label: "Panda card" },
];

function loadCards(): MemoryCardData[] {
  const duplicatedCards = memoryImages.flatMap((card) => [
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

  return shuffleArray(duplicatedCards);
}

export function MemoryBoard() {
  const [cards, setCards] = useState<MemoryCardData[]>(() => loadCards());
  const [firstChoice, setFirstChoice] = useState<number | null>(null);
  const [secondChoice, setSecondChoice] = useState<number | null>(null);
  const [turns, setTurns] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const firstCard = cards.find((card) => card.id === firstChoice) ?? null;
  const secondCard = cards.find((card) => card.id === secondChoice) ?? null;
  const matchedPairs = cards.filter((card) => card.matched).length / 2;
  const hasWon = matchedPairs === memoryImages.length;
  const isResolving = secondChoice !== null;

  function resetChoices() {
    setFirstChoice(null);
    setSecondChoice(null);
  }

  function resetBoard() {
    setCards(loadCards());
    resetChoices();
    setTurns(0);
    setElapsedSeconds(0);
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

    const isMatch = firstCard.image === secondCard.image;

    const timeout = window.setTimeout(() => {
      if (isMatch) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.image === firstCard.image
              ? { ...card, matched: true }
              : card
          )
        );
      }

      resetChoices();
      setTurns((currentTurns) => currentTurns + 1);
    }, isMatch ? 250 : 1000);

    return () => window.clearTimeout(timeout);
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (hasWon) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [hasWon]);

  return (
    <section className="w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-lg font-black text-slate-900">
              Time: {elapsedSeconds} seconds
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-lg font-black text-slate-900">Moves: {turns}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Matched
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {matchedPairs}/{memoryImages.length}
            </p>
          </div>
        </div>

        {!hasWon ? (
          <button
            type="button"
            onClick={resetBoard}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Restart Game
          </button>
        ) : null}
      </div>

      <div className="mt-6 min-h-14">
        {hasWon ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center text-emerald-800 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              {"\u{1F389} You Win!"}
            </h2>
            <p className="mt-2 text-base font-medium">Total moves: {turns}</p>
            <button
              type="button"
              onClick={resetBoard}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Restart Game
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Pick two cards to reveal a matching pair.
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-4 justify-items-center gap-2 sm:gap-4">
        {cards.map((card) => {
          const flipped =
            card.matched || card.id === firstChoice || card.id === secondChoice;

          return (
            <MemoryCard
              key={card.id}
              card={card}
              flipped={flipped}
              disabled={card.matched || isResolving || card.id === firstChoice}
              handleClick={() => handleSelect(card.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
