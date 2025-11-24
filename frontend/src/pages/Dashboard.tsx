import { KpiCard } from "@/components/kpi-card";
import { Users, ShoppingBag, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard title="Users" value="2,340" icon={<Users />} />
      <KpiCard title="Sales" value="452" icon={<ShoppingBag />} />
      <KpiCard title="Revenue" value="$12,430" icon={<DollarSign />} />
    </div>
  );
}
