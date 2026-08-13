import { prisma } from "@/lib/prisma";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { auth } from "../../auth/auth";
import Link from "next/link";

const ALLOWED_ROLES_FOR_PRODUCTS = ["ADMIN", "SALES"];

export default async function ProductsPage() {
    const session = await auth();
    const userRole = session?.user?.role ?? null;

    if (!userRole || !ALLOWED_ROLES_FOR_PRODUCTS.includes(userRole)) {
        return (
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-semibold text-white">Товары</h1>
                <div className="rounded bg-red-600 px-4 py-3 text-white">
                    <div className="mb-2">
                        У вас недостаточно прав, войдите с другой ролью.
                    </div>
                    <Link href="/login" className="underline hover:text-gray-200">
                        Перейти на страницу входа
                    </Link>
                </div>
            </div>
        );
    }

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold text-white">Товары</h1>

            <form action={createProduct} className="mb-8 flex flex-wrap gap-3">
                <input
                    name="name"
                    placeholder="Название"
                    className="w-80 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Цена"
                    className="w-40 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <input
                    name="stock"
                    type="number"
                    placeholder="Остаток"
                    className="w-40 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <button className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white">
                    Добавить
                </button>
            </form>

            <div className="space-y-3">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="flex flex-col gap-3 rounded bg-panel p-4 md:flex-row md:items-center md:justify-between"
                    >
                        <form action={updateProduct} className="flex flex-wrap gap-3">
                            <input type="hidden" name="id" value={p.id} />

                            <input
                                name="name"
                                defaultValue={p.name}
                                className="w-80 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={p.price}
                                className="w-40 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />
                            <input
                                name="stock"
                                type="number"
                                defaultValue={p.stock}
                                className="w-40 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />

                            <button className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
                                Сохранить
                            </button>
                        </form>

                        <form action={deleteProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <button className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white">
                                Удалить
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}