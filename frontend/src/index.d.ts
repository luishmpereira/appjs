interface User {
  id: number;
  name: string;
  email: string;
  role: string | { name: string; permissions?: any[] }; // Adapt as needed
  avatar?: string;
}

interface Operation {
    id: number;
    name: string;
    operationCode: string;
    changeInventory: boolean;
    hasFinance: boolean;
    operationType: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
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

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}
