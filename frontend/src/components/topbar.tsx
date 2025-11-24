import { Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">
        <Search className="text-gray-500" size={18} />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <User className="text-gray-600" />
        <span className="font-medium">Admin</span>
      </div>
    </header>
  );
}
