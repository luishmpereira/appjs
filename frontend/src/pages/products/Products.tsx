import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "./ProductsTable";
import { useEffect, useState } from "react";
import { ProductDialog } from "./ProductDialog";
import { useProductStore } from "@/store/productStore";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
}

export function Products() {
    const { products, fetchProducts, deleteProduct, loading } = useProductStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    function handleCreate() {
        setSelectedProduct(null);
        setIsDialogOpen(true);
    }

    function handleEdit(product: Product) {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
        try {
            await deleteProduct(id);
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                </Button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <ProductsTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete} />
            )}
            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedProduct}
                onSave={() => { }}
            />
        </div>
    )
}
