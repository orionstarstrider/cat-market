export const paths = {
  markets: 'cat-markets',
  getCatsByMarket: (market: string | null) => market ? `cat-market/${encodeURIComponent(market)}` : '',
} as const;
