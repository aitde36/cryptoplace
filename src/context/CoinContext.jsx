import { createContext, useEffect, useState } from "react";

const CoinContext = createContext();

const CoinContextProvider = (props) => {
  // Load currency from localStorage or default to USD
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem("currency");
    return savedCurrency
      ? JSON.parse(savedCurrency)
      : { name: "usd", symbol: "$" };
  });

  const [allCoin, setAllCoin] = useState([]);

  const fetchAllCoin = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-5fBKfiPAbGGAhKnMHsYTpAGS"
        }
      };

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        options
      );

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }

      const data = await response.json();
      setAllCoin(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  // Fetch coins when currency name changes
  useEffect(() => {
    fetchAllCoin();
  }, [currency.name]);

  // Save currency to localStorage on every change
  useEffect(() => {
    localStorage.setItem("currency", JSON.stringify(currency));
  }, [currency]);

  const ContextValue = {
    allCoin,
    currency,
    setCurrency
  };

  return (
    <CoinContext.Provider value={ContextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export { CoinContext };
export default CoinContextProvider;
