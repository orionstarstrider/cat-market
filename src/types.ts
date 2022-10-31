export type MarketsList = string[];

export type BreedStock = {
  breed: string,
  buy: number,
  sell: number,
};

export type BreedsStockNormalized = Record<string, {
  stockDays: { buy: number, sell: number }[],
  bestBuy: { day: number, value: number };
  bestSell: { day: number, value: number };
}>;
