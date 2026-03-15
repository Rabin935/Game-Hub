export type HubGame = {
  title: string;
  href: string;
  image: string;
  description: string;
  ctaLabel: string;
};

export type SnakeGameMode = "free" | "levels";

export type MemoryCardData = {
  id: number;
  pairId: number;
  image: string;
  label: string;
  matched: boolean;
};
