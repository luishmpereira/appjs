import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OperationForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        operationCode: "",
        operationType: "IN",
        changeInventory: false,
        hasFinance: false
    });

    useEffect(() => {
        if (id) {
            api.get(`/operations/${id}`)
                .then(res => setFormData(res.data))
                .catch(error => {
                    console.error(error);
                    alert("Erro ao carregar operação");
                    navigate("/inventory/operations");
                });
        }
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (id) {
                await api.put(`/operations/${id}`, formData);
                alert("Operação atualizada com sucesso!");
            } else {
                await api.post("/operations", formData);
                alert("Operação criada com sucesso!");
            }
            navigate("/inventory/operations");
        } catch (error: any) {
            console.error(error);
            alert("Erro ao salvar operação: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{id ? "Editar Operação" : "Nova Operação"}</h1>
                <Button variant="outline" onClick={() => navigate("/inventory/operations")}>
                    Cancelar
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-160">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Código</label>
                    <Input
                        value={formData.operationCode}
                        onChange={e => setFormData({ ...formData, operationCode: e.target.value })}
                        placeholder="Ex: CMP, VND"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Compra de Mercadoria"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select
                        value={formData.operationType}
                        onValueChange={value => setFormData({ ...formData, operationType: value as "IN" | "OUT" })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IN">Entrada</SelectItem>
                            <SelectItem value="OUT">Saída</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="changeInventory"
                        checked={formData.changeInventory}
                        onChange={e => setFormData({ ...formData, changeInventory: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="changeInventory" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Movimenta Estoque?
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="hasFinance"
                        checked={formData.hasFinance}
                        onChange={e => setFormData({ ...formData, hasFinance: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="hasFinance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Gera Financeiro?
                    </label>
                </div>

                <Button type="submit">
                    {id ? "Salvar Alterações" : "Criar Operação"}
                </Button>
            </form>
        </div>
    );
}
