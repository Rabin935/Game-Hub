import Image from "next/image";
import type { MemoryCardData } from "@/types/game";

type MemoryCardProps = {
  card: MemoryCardData;
  flipped: boolean;
  handleClick: () => void;
};

export function MemoryCard({ card, flipped, handleClick }: MemoryCardProps) {
  return (
    <button
      type="button"
      aria-label={flipped ? card.label : "Reveal card"}
      aria-pressed={flipped}
      onClick={handleClick}
      className="group relative h-28 w-20 cursor-pointer rounded-[1.35rem] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:h-36 sm:w-24 [perspective:1000px]"
    >
      <span
        className={`relative block h-full w-full rounded-[1.35rem] transition duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <span className="absolute inset-0 flex items-center justify-center rounded-[1.35rem] border border-slate-700/10 bg-[linear-gradient(145deg,_#0f172a,_#1e293b)] text-2xl font-black text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.9)] sm:text-3xl [backface-visibility:hidden]">
          ?
        </span>
        <span
          className={`absolute inset-0 overflow-hidden rounded-[1.35rem] border bg-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            card.matched
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200"
          }`}
        >
          <div className="relative h-full w-full bg-[linear-gradient(180deg,_#ffffff,_#eff6ff)] p-4">
            <Image
              src={card.image}
              alt={card.label}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-contain p-4"
            />
          </div>
        </span>
      </span>
    </button>
  );
}
