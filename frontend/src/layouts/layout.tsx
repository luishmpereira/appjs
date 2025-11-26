import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useAuth } from "@/hooks/useAuth";
import NavigationHeader from "@/components/navigation-header";
import { AbilityContext } from "@/components/Can";
import { defineAbilitiesFor } from "@/lib/ability";

export function Layout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  const ability = defineAbilitiesFor(user);

  return (
    <AbilityContext.Provider value={ability}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <Topbar />
          <main className="p-6">
            <NavigationHeader />
            <Outlet />
          </main>
        </div>
      </div>
    </AbilityContext.Provider>
  );
}
