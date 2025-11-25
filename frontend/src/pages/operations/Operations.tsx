import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Operation {
    id: number;
    name: string;
    operationCode: string;
    operationType: "IN" | "OUT";
    changeInventory: boolean;
    hasFinance: boolean;
    createdAt: string;
}

export function Operations() {
    const navigate = useNavigate();
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOperations();
    }, []);

    const loadOperations = async () => {
        try {
            const { data } = await api.get("/operations");
            setOperations(data);
        } catch (error) {
            console.error("Error loading operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta operação?")) return;

        try {
            await api.delete(`/operations/${id}`);
            await loadOperations();
        } catch (error: any) {
            alert("Erro ao excluir: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Operações</h1>
                <Button onClick={() => navigate("/inventory/operations/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Operação
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Movimenta Estoque?</TableHead>
                            <TableHead>Gera Financeiro?</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                            </TableRow>
                        ) : operations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Nenhuma operação encontrada</TableCell>
                            </TableRow>
                        ) : (
                            operations.map((operation) => (
                                <TableRow key={operation.id}>
                                    <TableCell>{operation.operationCode}</TableCell>
                                    <TableCell>{operation.name}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${operation.operationType === 'IN'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {operation.operationType === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{operation.changeInventory ? 'Sim' : 'Não'}</TableCell>
                                    <TableCell>{operation.hasFinance ? 'Sim' : 'Não'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => navigate(`/inventory/operations/${operation.id}`)}
                                            ><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost"
                                                size="icon-sm"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleDelete(operation.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
