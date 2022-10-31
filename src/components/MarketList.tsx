import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import useMarketContext from "../utils/useMarketContext";
import Loading from "./Loading";

const MarketList = () => {
  const [listInitialised, setListInitialized] = useState(false);
  const { currentMarket, markets, updateMarketState } = useMarketContext();
  const { loading, list: marketList } = markets;

  useEffect(() => {
    if (marketList && !listInitialised) {
      setListInitialized(true);
      updateMarketState({ currentMarket: marketList[0] });
    }
  }, [marketList?.length]);

  if (loading) {
    return <Loading />;
  }

  if (marketList) {
    return (
      <Stack direction="row" spacing={2}>
        {marketList.map((market) => (
          <Button
            variant={`${currentMarket === market ? 'contained' : 'outlined'}`}
            onClick={() => updateMarketState({ currentMarket: market })}
            key={market}
          >
            {market}
          </Button>
        ))}
      </Stack>
    );
  }

  return <span>No markets found</span>;
}

export default MarketList;
