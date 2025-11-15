import { useState } from "react";
import { NavigationContext } from "./navigation-context";

export default function NavigationProvider({ children }) {
  const [activePage, setActivePage] = useState("dashboard");

  function navigate(page) {
    setActivePage(page);
  }

  return (
    <NavigationContext.Provider value={{ activePage, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}
