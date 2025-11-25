import { Link, useLocation } from "react-router-dom";
import { paths } from "@/router/paths";
import { ChevronRight } from "lucide-react";

export default function NavigationHeader() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, idx) => {
    const path = "/" + segments.slice(0, idx + 1).join("/");
    const crumb = paths.find(p => p.path === path);

    return {
      label: crumb?.label || segment,
      path: path,
    };
  });

  return (
    <nav className="mb-5">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.path}>
          {idx > 0 && <ChevronRight className="inline-block mx-2" size={12} />}
          <Link to={crumb.path}>
            <span className="text-sm font-medium text-gray-500">{crumb.label}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}