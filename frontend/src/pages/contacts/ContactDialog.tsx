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
import type { Contact } from "@/store/contactStore";
import { useContactStore } from "@/store/contactStore";
import { useUserStore } from "@/store/userStore";

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact: Contact | null;
    onSave: () => void;
}

export function ContactDialog({
    open,
    onOpenChange,
    contact,
    onSave,
}: ContactDialogProps) {
    const { createContact, updateContact } = useContactStore();
    const { users, fetchUsers } = useUserStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [sellerId, setSellerId] = useState<string>("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setEmail(contact.email);
            setPhone(contact.phone);
            setSellerId(contact.sellerId ? String(contact.sellerId) : "");
        } else {
            setName("");
            setEmail("");
            setPhone("");
            setSellerId("");
        }
        setError("");
    }, [contact, open]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = {
                name,
                email,
                phone,
                sellerId: sellerId ? Number(sellerId) : undefined
            };

            if (contact) {
                await updateContact(contact.id, data);
            } else {
                await createContact(data);
            }

            onSave();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to save contact");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{contact ? "Editar Contato" : "Adicionar Contato"}</DialogTitle>
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
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seller">Vendedor</Label>
                        <Select
                            value={sellerId}
                            onValueChange={setSellerId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um vendedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar alterações'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
