import type { MemoryCardData } from "@/types/game";

type MemoryCardProps = {
  card: MemoryCardData;
  isFlipped: boolean;
  isDisabled: boolean;
  onClick: (cardId: number) => void;
};

export function MemoryCard({
  card,
  isFlipped,
  isDisabled,
  onClick,
}: MemoryCardProps) {
  return (
    <button
      type="button"
      aria-label={isFlipped ? card.label : "Reveal card"}
      disabled={isDisabled}
      onClick={() => onClick(card.id)}
      className="group relative aspect-[3/4] w-full cursor-pointer rounded-[1.35rem] [perspective:1000px] disabled:cursor-not-allowed"
    >
      <span
        className={`relative block h-full w-full rounded-[1.35rem] transition duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <span className="absolute inset-0 flex items-center justify-center rounded-[1.35rem] border border-slate-700/10 bg-[linear-gradient(145deg,_#0f172a,_#1e293b)] text-3xl font-black text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.9)] [backface-visibility:hidden]">
          ?
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-[1.35rem] border bg-white text-4xl shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            card.matched
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200"
          }`}
        >
          {card.symbol}
        </span>
      </span>
    </button>
  );
}
