import { useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import useMarketContext from "../utils/useMarketContext";
import Loading from "./Loading";

interface MarketValueProps extends TypographyProps {
  bestBuy?: boolean;
  bestSell?: boolean;
}

const MarketValue = styled(Typography, {
  shouldForwardProp(propName: PropertyKey): propName is keyof MarketValueProps {
    return propName !== 'bestBuy' && propName !== 'bestSell';
  }
})<MarketValueProps>(({ bestBuy, bestSell }) => {
  if (bestBuy) {
    return {
      color: 'green',
      fontWeight: 600,
    }
  }

  if (bestSell) {
    return {
      color: 'red',
      fontWeight: 600,
    }
  }
});

const CurrentMarket = () => {
  const { currentMarketState } = useMarketContext();
  const { loading, breeds, totalDays, totalProfit } = currentMarketState;
  const days = useMemo(() => {
    const daysArray: string[] = [];

    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(`${i}`)
    }

    return daysArray;
  }, [totalDays]);

  if (loading) {
    return <Loading />;
  }

  if (!breeds) {
    return <Typography>No data was found</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Breed</TableCell>
              {days.map((day) => (
                <TableCell key={day}>{`Day ${day}`}</TableCell>
              ))}
              <TableCell>Profit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(breeds).map(([breed, { stockDays, bestBuy, bestSell }]) => (
              <TableRow key={`breed_${breed}`}>
                <TableCell>{breed}</TableCell>
                {stockDays.map(({ buy, sell }, dayIndex) => (
                  <TableCell key={`${breed}_day_${dayIndex}`}>
                    <MarketValue bestBuy={ dayIndex === bestBuy.day }>
                      {`Buy $${buy}`}
                    </MarketValue>
                    <MarketValue bestSell={ dayIndex === bestSell.day }>
                      {`Sell $${sell}`}
                    </MarketValue>
                  </TableCell>
                ))}
                <TableCell>
                  <Typography fontWeight={600}>
                    {`$${bestSell.value - bestBuy.value}`}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5">{`Total profit: $${totalProfit}`}</Typography>
    </>
  );
};

export default CurrentMarket;
