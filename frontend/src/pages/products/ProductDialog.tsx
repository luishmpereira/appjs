import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/store/productStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
}

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSave: () => void;
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductDialogProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { saveProduct } = useProductStore();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
        } else {
            setName('');
            setPrice(0);
            setDescription('');
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            await saveProduct({ id: product?.id, name, price, description });
            onSave();
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao salvar produto");
        } finally {
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Produto</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        <Label htmlFor="price">Preço</Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <DialogFooter>
                        <Button type="submit">Salvar alterações</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>);
}
