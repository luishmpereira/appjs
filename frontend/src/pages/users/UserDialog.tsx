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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRoleStore } from "@/store/roleStore";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserDialogProps) {
  const { roles, fetchRoles } = useRoleStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("user");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setAvatar(user.avatar);
      setPassword(""); // Don't show password
    } else {
      setName("");
      setEmail("");
      setRole("user");
      setAvatar(undefined);
      setPassword("");
    }
    setError("");
  }, [user, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);
      try {
        const { data } = await api.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        setAvatar(data.key);
      } catch (err) {
        console.error("Upload failed", err);
        setError("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const url = user ? `/users/${user.id}` : "/users";
      const method = user ? "put" : "post";

      const body: any = { name, email, role, avatar };
      if (password) body.password = password;

      await api[method](url, body);

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                     {avatar ? (
                       <AvatarImage src={avatar.startsWith('http') ? avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/files/${avatar}`} />
                     ) : (
                       <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
                     )}
                </Avatar>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="avatar">Carregar Imagem</Label>
                    <Input id="avatar" type="file" onChange={handleFileChange} disabled={uploading} />
                </div>
            </div>
          </div>

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
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Papel</Label>
            <Select
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? "Senha (deixe em branco para manter)" : "Senha"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
            />
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
