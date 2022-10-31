import { useContext } from "react";
import { MarketContext } from "../contexts/Market";

const useMarketContext = () => useContext(MarketContext);

export default useMarketContext;
