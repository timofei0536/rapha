"use client";

import { createContext, useContext } from "react";
import { GeneralDefaults } from "@/lib/general-defaults";

const GeneralContext = createContext(GeneralDefaults);

export function GeneralProvider({ value, children }) {
  const resolved = value ?? GeneralDefaults;
  return (
    <GeneralContext.Provider value={resolved}>
      {children}
    </GeneralContext.Provider>
  );
}

export function useGeneral() {
  return useContext(GeneralContext);
}
