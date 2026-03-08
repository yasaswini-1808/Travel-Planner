import React, { createContext, useContext, useState } from "react";

const TravelContext = createContext({
  preferredCountry: null,
  setPreferredCountry: () => {},
  selectedContinent: null,
  setSelectedContinent: () => {},
});

export function TravelProvider({ children }) {
  const [preferredCountry, setPreferredCountry] = useState(
    () => localStorage.getItem("preferredCountry") || null,
  );
  const [selectedContinent, setSelectedContinent] = useState(null);

  const updatePreferredCountry = (country) => {
    setPreferredCountry(country);
    if (country) {
      localStorage.setItem("preferredCountry", country);
    } else {
      localStorage.removeItem("preferredCountry");
    }
  };

  return (
    <TravelContext.Provider
      value={{
        preferredCountry,
        setPreferredCountry: updatePreferredCountry,
        selectedContinent,
        setSelectedContinent,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error("useTravelContext must be used within TravelProvider");
  }
  return context;
}
