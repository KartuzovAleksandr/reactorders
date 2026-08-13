import Link from "next/link";

export default function Sidebar() {
    const items = [
        { href: "/dashboard", label: "Главная" },
        { href: "/clients", label: "Клиенты" },
        { href: "/products", label: "Товары" },
        { href: "/orders", label: "Заказы" },
        { href: "/login", label: "Вход" }
    ];

    return (
        <aside className="w-64 min-h-screen bg-panel p-4">
            <div className="text-xl font-bold mb-6">Orders App</div>
            <nav className="space-y-2">
                {items.map(i => (
                    <Link key={i.href} href={i.href} className="block p-3 rounded bg-panel2 hover:bg-slate-600">
                        {i.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}