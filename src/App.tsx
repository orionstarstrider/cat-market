import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import MarketProvider from "./contexts/Market";
import MarketList from "./components/MarketList";
import Layout from "./components/Layout";
import CurrentMarket from "./components/CurrentMarket";
import "./App.css";

function App() {
  return (
    <>
      <CssBaseline />
      <SnackbarProvider
        dense
        maxSnack={3}
      >
        <MarketProvider>
          <Layout>
            <MarketList />
            <CurrentMarket />
          </Layout>
        </MarketProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;
