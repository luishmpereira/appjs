import { MenuItem } from "@/components/menu-item";

export function Inventory() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <MenuItem label="Produtos" subtitle="Gerenciar cadastros" path="/inventory/products" />
                <MenuItem label="Estoque" subtitle="Gerenciar estoque" path="/inventory/stock" />
                <MenuItem label="Operações" subtitle="Configurar operações" path="/inventory/operations" />
            </div>
        </div>
    );
}