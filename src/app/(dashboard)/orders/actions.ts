"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth/auth";

export async function createOrder(formData: FormData) {
    const session = await auth();

    const clientId = String(formData.get("clientId") || "");
    const userId = session?.user?.id;
    const total = Number(formData.get("total") || 0);

    const productIds = formData.getAll("productId") as string[];
    const quantities = formData.getAll("quantity") as string[];
    const prices = formData.getAll("price") as string[];

    // Проверка авторизации
    if (!userId) {
        throw new Error("AUTH_REQUIRED");
    }

    if (!clientId || productIds.length === 0) {
        throw new Error("Missing order data");
    }

    if (
        productIds.length !== quantities.length ||
        productIds.length !== prices.length
    ) {
        throw new Error("Invalid cart data");
    }

    await prisma.order.create({
        data: {
            clientId,
            userId,
            total,
            status: "NEW",
            items: {
                create: productIds.map((productId, i) => ({
                    productId,
                    quantity: Number(quantities[i] || 0),
                    price: Number(prices[i] || 0),
                })),
            },
        },
    });

    revalidatePath("/orders");
}

export async function deleteOrder(orderId: string) {
    await prisma.order.delete({
        where: { id: orderId },
    });

    revalidatePath("/orders");
}