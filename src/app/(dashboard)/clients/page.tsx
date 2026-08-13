import { prisma } from "@/lib/prisma";
import { createClient, updateClient, deleteClient } from "./actions";
import { auth } from "@/app/auth/auth";
import Link from "next/link";

const ALLOWED_ROLES_FOR_CLIENTS = ["ADMIN", "MANAGER"];

export default async function ClientsPage() {
    const session = await auth();
    const userRole = session?.user?.role ?? null;

    if (!userRole || !ALLOWED_ROLES_FOR_CLIENTS.includes(userRole)) {
        return (
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-semibold text-white">Клиенты</h1>
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

    const clients = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold text-white">Клиенты</h1>

            <form action={createClient} className="mb-8 flex flex-wrap gap-3">
                <input
                    name="name"
                    placeholder="ФИО"
                    className="w-70 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <input
                    name="phone"
                    placeholder="Телефон"
                    className="w-35 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <input
                    name="address"
                    placeholder="Адрес"
                    className="w-64 rounded bg-panel2 px-3 py-2 text-white placeholder:text-gray-400 outline-none"
                />
                <button className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white">
                    Добавить
                </button>
            </form>

            <div className="space-y-3">
                {clients.map((c) => (
                    <div
                        key={c.id}
                        className="flex flex-col gap-3 rounded bg-panel p-4 md:flex-row md:items-center md:justify-between"
                    >
                        <form action={updateClient} className="flex flex-wrap gap-3">
                            <input type="hidden" name="id" value={c.id} />

                            <input
                                name="name"
                                defaultValue={c.name}
                                className="w-70 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />
                            <input
                                name="phone"
                                defaultValue={c.phone}
                                className="w-35 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />
                            <input
                                name="address"
                                defaultValue={c.address}
                                className="w-64 rounded bg-panel2 px-3 py-2 text-white outline-none"
                            />

                            <button className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
                                Сохранить
                            </button>
                        </form>

                        <form action={deleteClient}>
                            <input type="hidden" name="id" value={c.id} />
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