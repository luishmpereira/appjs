import { KpiCard } from "@/components/kpi-card";
import { Users, ShoppingBag, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard title="Usuários" value="2,340" icon={<Users />} />
      <KpiCard title="Vendas" value="452" icon={<ShoppingBag />} />
      <KpiCard title="Receita" value="R$ 12.430" icon={<DollarSign />} />
    </div>
  );
}
