import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductsTable } from "./ProductsTable";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { ProductDialog } from "./ProductDialog";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
}

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data } = await api.get("/products");
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                </Button>
            </div>

            {false ? (
                <p>Carregando...</p>
            ) : (
                <ProductsTable products={products} onEdit={() => { }} onDelete={handleDelete} />
            )}

            {/* <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
                onSave={handleSave}
            /> */}
            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedProduct}
                onSave={() => { }}
            />
        </div>
    )
}
