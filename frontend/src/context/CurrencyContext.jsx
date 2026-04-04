import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const rates = {
    USD: { symbol: '$', rate: 1 },
    AED: { symbol: 'AED', rate: 3.67 },
    INR: { symbol: '₹', rate: 83.00 },
  };

  const formatPrice = (priceStr) => {
    if (!priceStr) return 'N/A';
    
    // Parse the numeric value from strings like "$12,500,000" or "12500000"
    const numericValue = parseFloat(priceStr.toString().replace(/[$,]/g, ''));
    if (isNaN(numericValue)) return priceStr;

    const { symbol, rate } = rates[currency];
    const convertedValue = numericValue * rate;

    // Formatting rules: 
    // - If it's USD, keep standard $12.5M format
    // - If it's AED, use the symbol at the end or front as preferred
    // - If it's INR, use standard Lac/Crore if possible but keep it simple for now
    
    if (convertedValue >= 1000000) {
      return `${symbol}${(convertedValue / 1000000).toFixed(1)}M`;
    } else if (convertedValue >= 1000) {
      return `${symbol}${(convertedValue / 1000).toFixed(0)}K`;
    }
    
    return `${symbol}${convertedValue.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
