import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RolesTable } from "./RolesTable";
import { RoleDialog } from "./RoleDialog";
import { api } from "@/lib/axios";

interface Role {
  id: number;
  name: string;
  permissions: any[];
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const { data } = await api.get("/roles");
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este papel?")) return;

    try {
      await api.delete(`/roles/${id}`);
      setRoles(roles.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete role", error);
      alert("Falha ao deletar papel");
    }
  }

  function handleEdit(role: Role) {
    setSelectedRole(role);
    setIsDialogOpen(true);
  }

  function handleCreate() {
    setSelectedRole(null);
    setIsDialogOpen(true);
  }

  function handleSave() {
    setIsDialogOpen(false);
    fetchRoles();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Papéis</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Papel
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <RolesTable roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <RoleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        role={selectedRole}
        onSave={handleSave}
      />
    </div>
  );
}
