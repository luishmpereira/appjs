import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/layout";

import Dashboard from "@/pages/Dashboard";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
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
