import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

interface Role {
  id: number;
  name: string;
  permissions: any[];
}

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSave: () => void;
}

export function RoleDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: RoleDialogProps) {
  const [name, setName] = useState("");
  const [permissionsStr, setPermissionsStr] = useState("[]");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissionsStr(JSON.stringify(role.permissions, null, 2));
    } else {
      setName("");
      setPermissionsStr(`[
  {
    "action": "read",
    "subject": "User"
  }
]`);
    }
    setError("");
  }, [role, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let permissions = [];
    try {
      permissions = JSON.parse(permissionsStr);
    } catch (e) {
      setError("Invalid JSON for permissions");
      return;
    }

    try {
      const url = role ? `/roles/${role.id}` : "/roles";
      const method = role ? "put" : "post";

      await api[method](url, { name, permissions });

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save role");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{role ? "Editar Papel" : "Adicionar Papel"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="permissions">Permissões (JSON)</Label>
            <textarea
              id="permissions"
              className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              value={permissionsStr}
              onChange={(e) => setPermissionsStr(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Use o formato CASL JSON. Exemplo: {`[{"action": "read", "subject": "all"}]`}
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
