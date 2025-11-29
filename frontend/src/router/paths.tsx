interface Path {
    path: string;
    label?: string;
}

export const paths: Path[] = [
    {
        path: "/",
        label: "Dashboard",
    },
    {
        path: "/roles",
        label: "Papéis",
    },
    {
        path: "/inventory",
        label: "Inventário",
    },
    {
        path: "/inventory/products",
        label: "Produtos",
    },
    {
        path: "/inventory/stock",
        label: "Estoque",
    },
    {
        path: "/users",
        label: "Usuários",
    },
    {
        path: "/inventory/operations",
        label: "Operações",
    },
    {
        path: "/inventory/operations/new",
        label: "Nova Operação",
    },
    {
        path: "/checkout",
        label: "Caixa",
    },
    {
        path: "/sales",
        label: "Vendas",
    }
];
