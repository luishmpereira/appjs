import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

export default function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}
