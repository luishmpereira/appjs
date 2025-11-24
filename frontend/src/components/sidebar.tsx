import { Home, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <nav className="space-y-4">
        <SidebarItem icon={<Home />} label="Dashboard" to="/" />
        <SidebarItem icon={<BarChart3 />} label="Reports" to="/reports" />
        <SidebarItem icon={<Settings />} label="Settings" to="/settings" />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
         ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
