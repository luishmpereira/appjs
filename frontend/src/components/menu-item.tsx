import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MenuItemProps {
    label: string;
    subtitle?: string;
    path: string;
}

export function MenuItem({ label, subtitle, path }: MenuItemProps) {

    return (
        <Link to={path}><Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-start gap-4">
                <div className="grow">
                    <CardTitle className="text-base">{label}</CardTitle>
                    {subtitle && <CardDescription className="text-sm">{subtitle}</CardDescription>}
                </div>
            </CardHeader>

        </Card>
        </Link>
    );
}
