import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
             {user?.avatar && (
               <AvatarImage src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/files/${user.avatar}`} />
             )}
             <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
             </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.name || "Usuário"}</span>
        </div>

        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
