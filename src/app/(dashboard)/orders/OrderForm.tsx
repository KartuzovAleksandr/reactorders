"use client";

import { createOrder } from "./actions";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { RootState } from "@/store/store";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";

export default function OrderForm({
                                      clients,
                                  }: {
    clients: { id: string; name: string }[];
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
        <form
            action={handleSubmit}
            className="mb-8 space-y-4 rounded bg-panel p-4"
        >
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
    );
}