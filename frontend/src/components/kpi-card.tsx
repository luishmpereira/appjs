import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-4 rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
