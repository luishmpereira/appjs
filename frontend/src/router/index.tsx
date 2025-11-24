import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/layout";

import Dashboard from "@/pages/Dashboard";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import Users from "@/pages/users/Users";
import Roles from "@/pages/roles/Roles";
import Login from "@/pages/auth/Login";
import SetupAdmin from "@/pages/auth/SetupAdmin";
import { Products } from "@/pages/products/Products";

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
                path: "products",
                element: <Products />,
            },
            {
                path: "reports",
                element: <Reports />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
]);
