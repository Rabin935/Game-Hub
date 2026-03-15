export type HubGame = {
  title: string;
  href: string;
  image: string;
  description: string;
  ctaLabel: string;
};

export type MemoryCardData = {
  id: number;
  pairId: number;
  symbol: string;
  label: string;
  matched: boolean;
};
