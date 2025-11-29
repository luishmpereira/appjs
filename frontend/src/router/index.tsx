import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/layout";

import Dashboard from "@/pages/Dashboard";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import Users from "@/pages/users/Users";
import Roles from "@/pages/roles/Roles";
import Login from "@/pages/auth/Login";
import SetupAdmin from "@/pages/auth/SetupAdmin";
import { Inventory } from "@/pages/inventory";
import { Products } from "@/pages/products/Products";
import { Stock } from "@/pages/stock/Stock";
import { StockForm } from "@/pages/stock/StockForm";

import { Operations } from "@/pages/operations/Operations";
import { OperationForm } from "@/pages/operations/OperationForm";
import { Checkout } from "@/pages/checkout/Checout";
import { Sales } from "@/pages/sales/Sales";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/setup",
        element: <SetupAdmin />
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "roles",
                element: <Roles />,
            },
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "inventory",
                element: <Inventory />,
            },
            {
                path: "reports",
                element: <Reports />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "inventory/products",
                element: <Products />,
            },
            {
                path: "/inventory/stock",
                element: <Stock />,
            },
            {
                path: "/inventory/stock/new",
                element: <StockForm />,
            },
            {
                path: "/inventory/stock/:id",
                element: <StockForm />,
            },
            {
                path: "/inventory/operations",
                element: <Operations />,
            },
            {
                path: "/inventory/operations/new",
                element: <OperationForm />,
            },
            {
                path: "/inventory/operations/:id",
                element: <OperationForm />,
            },
            {
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/sales",
                element: <Sales />,
            }
        ],
    },
]);
