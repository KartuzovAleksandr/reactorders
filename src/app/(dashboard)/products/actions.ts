"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth/auth";

const ALLOWED_ROLES_FOR_PRODUCTS = ["ADMIN", "SALES"];

export async function createProduct(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_PRODUCTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const name = String(formData.get("name") || "");
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);

    await prisma.product.create({
        data: { name, price, stock },
    });

    revalidatePath("/products");
}

export async function updateProduct(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_PRODUCTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);

    await prisma.product.update({
        where: { id },
        data: { name, price, stock },
    });

    revalidatePath("/products");
}

export async function deleteProduct(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_PRODUCTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const id = String(formData.get("id") || "");

    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/products");
}