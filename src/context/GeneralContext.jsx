"use client";

import { createContext, useContext } from "react";

const EMPTY_GENERAL = {};

const GeneralContext = createContext(EMPTY_GENERAL);

export function GeneralProvider({ value, children }) {
  const resolved = value ?? EMPTY_GENERAL;
  return (
    <GeneralContext.Provider value={resolved}>
      {children}
    </GeneralContext.Provider>
  );
}

export function useGeneral() {
  return useContext(GeneralContext);
}
