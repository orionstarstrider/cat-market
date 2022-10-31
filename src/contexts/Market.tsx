import {createContext, useCallback, useMemo, useState} from 'react';
import type { FC } from "react";
import type { BreedStock, MarketsList, BreedsStockNormalized } from "../types";
import useFetch from "../utils/useFetch";
import { paths } from "../constants";

interface MarketState {
  currentMarket: string | null;
  markets: {
    loading: boolean;
    list: MarketsList | null;
  };
  currentMarketState: {
    loading: boolean,
    breeds: BreedsStockNormalized | null;
    totalDays: number;
    totalProfit: number;
  };
}

interface MarketContextValue extends MarketState{
  updateMarketState: (changes: Partial<MarketState>) => void;
}

const initialMarketState: MarketState = {
  currentMarket: null,
  markets: {
    loading: false,
    list: null,
  },
  currentMarketState: {
    loading: false,
    breeds: null,
    totalDays: 0,
    totalProfit: 0,
  },
}

export const MarketContext = createContext<MarketContextValue>({
  ...initialMarketState,
  updateMarketState: () => {},
});

const MarketProvider: FC = ({ children }) => {
  const [marketState, setMarketState] = useState<MarketState>(initialMarketState);

  const updateMarketState = useCallback((changes: Partial<MarketState>) => {
    setMarketState((prevState) => ({
      ...prevState,
      ...changes,
    }));
  }, [setMarketState]);

  const { loading: marketsLoading, data: markets } = useFetch<MarketsList>(paths.markets);

  const { loading: stockDaysLoading, data: stockDays } = useFetch<BreedStock[][]>(
    paths.getCatsByMarket(marketState.currentMarket),
    { skip: !marketState.currentMarket }
  );

  const { breeds, totalDays, totalProfit } = useMemo(() => {
    if (!stockDays || stockDays.length === 0) return {
      breeds: null,
      totalDays: 0,
      totalProfit: 0
    };

    const breeds = stockDays.reduce((breedsAcc, dayBreeds, dayIndex) => {
      dayBreeds.forEach(({ breed, buy, sell }) => {
        if (breedsAcc[breed]) {
          breedsAcc[breed].stockDays.push({ buy, sell });

          if (breedsAcc[breed].bestBuy.value > buy) {
            breedsAcc[breed].bestBuy = {
              day: dayIndex,
              value: buy,
            };
          }

          if (breedsAcc[breed].bestSell.value < sell) {
            breedsAcc[breed].bestSell = {
              day: dayIndex,
              value: sell,
            };
          }
        } else {
          breedsAcc[breed] = {
            bestBuy: {
              day: 0,
              value: buy,
            },
            bestSell: {
              day: 0,
              value: buy,
            },
            stockDays: [{
              buy,
              sell,
            }],
          }
        }
      });

      return breedsAcc;
    }, {} as BreedsStockNormalized);

    const totalDays = stockDays.length;
    const totalProfit = Object.values(breeds).reduce((total, { bestBuy, bestSell }) => {
      return total + bestSell.value - bestBuy.value
    }, 0);

    return { breeds, totalDays, totalProfit }
  }, [stockDays]);

  return (
    <MarketContext.Provider
      value={{
        ...marketState,
        markets: { loading: marketsLoading, list: markets },
        currentMarketState: {
          loading: stockDaysLoading,
          breeds,
          totalDays,
          totalProfit,
        },
        updateMarketState
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export default MarketProvider;
