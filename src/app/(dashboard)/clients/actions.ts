"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth/auth";

const ALLOWED_ROLES_FOR_CLIENTS = ["ADMIN", "MANAGER"];

export async function createClient(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_CLIENTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");

    await prisma.client.create({
        data: { name, phone, address },
    });

    revalidatePath("/clients");
}

export async function updateClient(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_CLIENTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");

    await prisma.client.update({
        where: { id },
        data: { name, phone, address },
    });

    revalidatePath("/clients");
}

export async function deleteClient(formData: FormData) {
    const session = await auth();
    const userRole = session?.user?.role;

    if (!session?.user?.id || !userRole || !ALLOWED_ROLES_FOR_CLIENTS.includes(userRole)) {
        throw new Error("FORBIDDEN");
    }

    const id = String(formData.get("id") || "");

    await prisma.client.delete({
        where: { id },
    });

    revalidatePath("/clients");
}