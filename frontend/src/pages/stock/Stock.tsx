import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Movement {
    id: number;
    stockMovementCode: string;
    movementDate: string;
    movementType: "IN" | "OUT";
    status: "DRAFT" | "CONFIRMED";
    operationId: number;
    createdAt: string;
}

export function Stock() {
    const navigate = useNavigate();
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMovements();
    }, []);

    const loadMovements = async () => {
        try {
            const { data } = await api.get("/movements");
            setMovements(data);
        } catch (error) {
            console.error("Error loading movements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta movimentação?")) return;

        try {
            await api.delete(`/movements/${id}`);
            await loadMovements();
        } catch (error: any) {
            alert("Erro ao excluir: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Movimentação de Estoque</h1>
                <Button onClick={() => navigate("/inventory/stock/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Movimentação
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                                </TableRow>
                            ) : movements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Nenhuma movimentação encontrada</TableCell>
                                </TableRow>
                            ) : (
                                movements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>{movement.stockMovementCode}</TableCell>
                                        <TableCell>{new Date(movement.movementDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                movement.movementType === 'IN' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {movement.movementType === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                movement.status === 'DRAFT' 
                                                    ? 'bg-gray-100 text-gray-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {movement.status === 'DRAFT' ? 'RASCUNHO' : 'CONFIRMADO'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(movement.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/inventory/stock/${movement.id}`)}>
                                                    <Pencil />
                                                </Button>
                                                <Button variant="ghost" className="text-red-500 hover:text-red-600" size="sm" onClick={() => handleDelete(movement.id)}>
                                                    <Trash2 />
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
