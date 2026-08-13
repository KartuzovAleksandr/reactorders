import { prisma } from "@/lib/prisma";
import { OrdersClient } from "./OrdersClient";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            client: true,
            user: true,
            items: { include: { product: true } },
        },
    });

    const clients = await prisma.client.findMany({
        orderBy: { name: "asc" },
    });

    const products = await prisma.product.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <OrdersClient
            clients={clients}
            products={products.map((p) => ({
                id: p.id,
                name: p.name,
                price: Number(p.price),
            }))}
            orders={orders}
        />
    );
}