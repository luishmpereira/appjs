import { Home, BarChart3, Settings, Users, Shield, PackageOpen, ShoppingCart, PercentCircle, Contact } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <nav className="space-y-4">
        <SidebarItem icon={<Home />} label="Dashboard" to="/" />
        <SidebarItem icon={<BarChart3 />} label="Relatórios" to="/reports" />
        <SidebarItem icon={<ShoppingCart />} label="Caixa" to="/checkout" />
        <SidebarItem icon={<PercentCircle />} label="Vendas" to="/sales" />
        <SidebarItem icon={<Contact />} label="Contatos" to="/contacts" />
        {user?.role === "admin" && (
          <>
            <SidebarItem icon={<PackageOpen />} label="Inventário" to="/inventory" />
            <SidebarItem icon={<Users />} label="Usuários" to="/users" />
            <SidebarItem icon={<Shield />} label="Papéis" to="/roles" />
          </>
        )}
        <SidebarItem icon={<Settings />} label="Configurações" to="/settings" />
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
