import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactsTable } from "./ContactsTable";
import { ContactDialog } from "./ContactDialog";
import { useContactStore } from "@/store/contactStore";
import type { Contact } from "@/store/contactStore";
import { Pagination } from "@/components/ui/pagination-controls";

export default function Contacts() {
    const { contacts, loading, fetchContacts, deleteContact, page, totalPages } = useContactStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    function handlePageChange(newPage: number) {
        fetchContacts(newPage);
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja deletar este contato?")) return;

        try {
            await deleteContact(id);
        } catch (error) {
            console.error("Failed to delete contact", error);
        }
    }

    function handleEdit(contact: Contact) {
        setSelectedContact(contact);
        setIsDialogOpen(true);
    }

    function handleCreate() {
        setSelectedContact(null);
        setIsDialogOpen(true);
    }

    function handleSave() {
        setIsDialogOpen(false);
        fetchContacts();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contatos</h1>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Contato
                </Button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <ContactsTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}

            <ContactDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                contact={selectedContact}
                onSave={handleSave}
            />
        </div>
    );
}
