import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOperationStore } from "@/store/operationStore";
import { useProductStore } from "@/store/productStore";
import { useMovementStore } from "@/store/movementStore";

interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
}


interface MovementLine {
    id: string;
    movementId: number;
    productId: number;
    quantity: number;
    price: number;
}

interface Movement {
    id: number;
    operationId: number;
    createdById: number;
    updatedById: number;
    createdAt: Date;
    updatedAt: Date;
    lines: MovementLine[];
}

export function StockForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { operations, fetchOperations } = useOperationStore();
    const { products, fetchProducts } = useProductStore();
    const { getMovement } = useMovementStore();
    const [error, setError] = useState();
    const [movement, setMovement] = useState<Movement | undefined>(undefined);
    const [selectedOperationId, setSelectedOperationId] = useState<string>("");
    const [movementDate, setMovementDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [quantity, setQuantity] = useState<string>("1");
    const [lines, setLines] = useState<MovementLine[]>([]);

    useEffect(() => {
        fetchOperations(1);
        fetchProducts();
    }, []);

    useEffect(() => {
        async function loadMovement() {
            if (id) {
                const movement = await getMovement(parseInt(id));
                if (movement) {
                    setMovement(movement);
                    setSelectedOperationId(movement.operationId.toString());
                    setMovementDate(movement.createdAt.toISOString().split('T')[0]);
                    setLines(movement.lines);
                }
            }
        }
        loadMovement();
    }, [id, navigate]);

    // Handlers
    const handleAddLine = (product: Product) => {
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) return;
        
        setLines([...lines, {
            productId: product.id,
            price: product.price,
            
            quantity: qty,
            movementId: movement?.id || 0,
            id: movement?.id ? `${movement.id}-${lines.length + 1}` : `${lines.length + 1}`
        }]);
        
        // Reset
        setSearchQuery("");
        setQuantity("1");
    };

    const handleRemoveLine = (index: number) => {
        const newLines = [...lines];
        newLines.splice(index, 1);
        setLines(newLines);
    };

    const handleSave = async () => {
        if (!selectedOperationId) {
            alert("Selecione uma operação");
            return;
        }
        if (lines.length === 0) {
            alert("Adicione pelo menos um produto");
            return;
        }
        if (!user) {
            alert("Usuário não autenticado");
            return;
        }

        const operation = operations.find(op => op.id.toString() === selectedOperationId);
        if (!operation) return;

        const payload = {
            movementDate: new Date(movementDate),
            operationId: parseInt(selectedOperationId),
            updatedBy: user.id,
            createdBy: id ? undefined : user.id,
            lines: lines.map(l => ({
                productId: l.productId,
                quantity: l.quantity
            }))
        };

        try {
            if (id) {
                await api.put(`/movements/${id}`, payload);
                alert("Rascunho atualizado com sucesso!");
            } else {
                await api.post("/movements", payload);
                alert("Rascunho salvo com sucesso!");
            }
            navigate("/inventory/stock");
        } catch (error: any) {
            console.error(error);
            alert("Erro ao salvar rascunho: " + (error.response?.data?.error || error.message));
            setError(error.response?.data?.error || error.message);
        }
    };

    const handleConfirm = async () => {
        if (!selectedOperationId) {
            alert("Selecione uma operação");
            return;
        }
        if (lines.length === 0) {
            alert("Adicione pelo menos um produto");
            return;
        }
        if (!user) {
            alert("Usuário não autenticado");
            return;
        }

        const operation = operations.find(op => op.id.toString() === selectedOperationId);
        if (!operation) return;

        const payload = {
            movementDate: new Date(movementDate),
            movementType: operation.operationType,
            status: "CONFIRMED",
            operationId: parseInt(selectedOperationId),
            updatedBy: user.id,
            createdBy: id ? undefined : user.id, // Only send on create
            lines: lines.map(l => ({
                productId: l.productId,
                quantity: l.quantity
            }))
        };

        try {
            if (id) {
                await api.put(`/movements/${id}`, payload);
                alert("Movimento atualizado com sucesso!");
            } else {
                await api.post("/movements", payload);
                alert("Movimento criado com sucesso!");
            }
            navigate("/inventory/stock");
        } catch (error: any) {
            console.error(error);
            alert("Erro ao salvar movimento: " + (error.response?.data?.error || error.message));
        }
    };

    const filteredProducts = searchQuery 
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{id ? "Editar Movimentação" : "Nova Movimentação"}</h1>
                <Button variant="outline" onClick={() => navigate("/inventory/stock")}>
                    Cancelar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Header Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Movimento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Operação</label>
                            <Select value={selectedOperationId} onValueChange={setSelectedOperationId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma operação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {operations.map(op => (
                                        <SelectItem key={op.id} value={op.id.toString()}>
                                            {op.operationCode} - {op.name} ({op.operationType})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data</label>
                            <Input 
                                type="date" 
                                value={movementDate} 
                                onChange={(e) => setMovementDate(e.target.value)} 
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Product Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Produtos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Input 
                                    placeholder="Buscar produto..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && filteredProducts.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-popover border rounded-md shadow-md z-50 mt-1 max-h-60 overflow-auto">
                                        {filteredProducts.map(product => (
                                            <div 
                                                key={product.id}
                                                className="p-2 hover:bg-accent cursor-pointer text-sm"
                                                onClick={() => handleAddLine(product)}
                                            >
                                                {product.name} (Estoque: 0)
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchQuery && filteredProducts.length === 0 && (
                                    <div className="absolute top-full left-0 w-full bg-popover border rounded-md shadow-md z-50 mt-1 p-2 text-sm text-muted-foreground">
                                        Nenhum produto encontrado
                                    </div>
                                )}
                            </div>
                            <Input 
                                type="number" 
                                className="w-24" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Digite o nome do produto e clique para adicionar.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Itens do Movimento</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="w-[100px]">Qtd</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lines.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Nenhum item adicionado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lines.map((line, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{line.id}</TableCell>
                                        <TableCell>{line.quantity}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleRemoveLine(index)}
                                            >
                                                Remover
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleSave}>
                    Salvar Rascunho
                </Button>
                <Button onClick={handleConfirm}>
                    {id ? "Salvar Alterações" : "Confirmar Movimento"}
                </Button>
            </div>
            <div>
                <p style={{ whiteSpace: "break-spaces" }}>{error}</p>
            </div>
        </div>
    )
}
