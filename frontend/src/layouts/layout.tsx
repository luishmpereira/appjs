import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function Layout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 min-h-screen bg-gray-50">
        <Topbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
