import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";

export function Provider({ children }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  );
}
