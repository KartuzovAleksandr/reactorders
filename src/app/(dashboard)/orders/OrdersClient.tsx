"use client";

import { createOrder, deleteOrder } from "./actions";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { RootState } from "@/store/store";
import { removeFromCart, updateQuantity, addToCart } from "@/store/cartSlice";

type Client = { id: string; name: string };
type Product = { id: string; name: string; price: number };
type Order = {
    id: string;
    client?: { name: string } | null;
    user?: { name: string } | null;
    userId: string;
    status: string;
    total: number;
    items: {
        id: string;
        quantity: number;
        price: number;
        product?: { name: string } | null;
    }[];
};

export function OrdersClient({
                                 clients,
                                 products,
                                 orders,
                             }: {
    clients: Client[];
    products: Product[];
    orders: Order[];
}) {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.cart.items);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const hasItems = items.length > 0;

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setError(null);

        try {
            await createOrder(formData);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Ошибка при создании заказа";

            if (message === "AUTH_REQUIRED") {
                setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
                return;
            }

            setError(message);
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold text-white">Заказы</h1>

            {/* Выбор товаров (корзина) */}
            <div className="mb-8 rounded bg-panel p-4">
                <h2 className="mb-4 text-xl font-semibold text-white">Товары</h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => {
                        const inCart = items.find((i) => i.id === p.id);
                        return (
                            <div
                                key={p.id}
                                className="flex items-center justify-between rounded bg-panel2 p-3 text-white"
                            >
                                <div>
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-sm text-gray-300">
                                        {Math.round(p.price)} ₽
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {inCart ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(
                                                        updateQuantity({
                                                            id: p.id,
                                                            quantity: inCart.quantity - 1,
                                                        })
                                                    )
                                                }
                                                className="rounded bg-panel px-2 py-1 text-white"
                                            >
                                                −
                                            </button>
                                            <div className="w-10 text-center">{inCart.quantity}</div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(
                                                        updateQuantity({
                                                            id: p.id,
                                                            quantity: inCart.quantity + 1,
                                                        })
                                                    )
                                                }
                                                className="rounded bg-panel px-2 py-1 text-white"
                                            >
                                                +
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch(
                                                    addToCart({
                                                        id: p.id,
                                                        name: p.name,
                                                        price: p.price,
                                                    })
                                                )
                                            }
                                            className="rounded bg-blue-600 px-3 py-1 text-white"
                                        >
                                            В корзину
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Форма заказа */}
            <form
                action={handleSubmit}
                className="mb-8 space-y-4 rounded bg-panel p-4"
            >
                <h2 className="text-xl font-semibold text-white">Оформление заказа</h2>

                {error && (
                    <div className="rounded bg-red-600 px-4 py-3 text-white">
                        <div className="mb-2">{error}</div>
                        {error.includes("не авторизованы") && (
                            <Link href="/login" className="underline hover:text-gray-200">
                                Перейти на страницу входа
                            </Link>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <select
                        name="clientId"
                        className="w-64 rounded bg-panel2 px-3 py-2 text-white outline-none"
                        defaultValue=""
                        required
                    >
                        <option value="" disabled className="text-black">
                            Клиент
                        </option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id} className="text-black">
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="total"
                        type="number"
                        step="1"
                        value={Math.round(total)}
                        readOnly
                        className="w-40 rounded bg-panel2 px-3 py-2 text-white outline-none"
                    />
                </div>

                <div className="space-y-2">
                    {!hasItems ? (
                        <div className="text-gray-400">Корзина пуста</div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex items-center gap-3 text-white"
                            >
                                <div className="w-64">{item.name}</div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(
                                                updateQuantity({
                                                    id: item.id,
                                                    quantity: item.quantity - 1,
                                                })
                                            )
                                        }
                                        className="rounded bg-panel2 px-2 py-1 text-white"
                                    >
                                        −
                                    </button>
                                    <div className="w-16 text-center">{item.quantity}</div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(
                                                updateQuantity({
                                                    id: item.id,
                                                    quantity: item.quantity + 1,
                                                })
                                            )
                                        }
                                        className="rounded bg-panel2 px-2 py-1 text-white"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="w-24">× {item.quantity}</div>
                                <div className="w-40">{Math.round(item.price)}</div>

                                <button
                                    type="button"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="ml-auto rounded bg-red-600 px-3 py-1 text-white"
                                >
                                    Удалить
                                </button>

                                <input type="hidden" name="productId" value={item.id} />
                                <input type="hidden" name="quantity" value={item.quantity} />
                                <input type="hidden" name="price" value={item.price} />
                            </div>
                        ))
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!hasItems}
                    className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Добавить заказ
                </button>
            </form>

            {/* Список созданных заказов */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">Существующие заказы</h2>

                {orders.map((o) => (
                    <div key={o.id} className="rounded bg-panel p-4 text-white">
                        <div className="mb-2 flex flex-wrap gap-4">
                            <div>Клиент: {o.client?.name}</div>
                            <div>Пользователь: {o.user?.name || o.userId}</div>
                            <div>Статус: {o.status}</div>
                            <div>Сумма: {Math.round(o.total)}</div>

                            <form action={() => deleteOrder(o.id)}>
                                <button
                                    type="submit"
                                    className="rounded bg-red-600 px-3 py-1 text-white"
                                >
                                    Удалить
                                </button>
                            </form>
                        </div>

                        <div className="space-y-1 text-sm text-gray-300">
                            {o.items.map((item) => (
                                <div key={item.id}>
                                    {item.product?.name} — {item.quantity} ×{" "}
                                    {Math.round(item.price)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}