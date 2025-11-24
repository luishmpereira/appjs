import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable } from "./UsersTable";
import { UserDialog } from "./UserDialog";
import { useUserStore } from "@/store/userStore";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Users() {
  const { users, loading, fetchUsers, deleteUser } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      await deleteUser(id);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  function handleCreate() {
    setSelectedUser(null);
    setIsDialogOpen(true);
  }

  function handleSave() {
    setIsDialogOpen(false);
    fetchUsers();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
}
