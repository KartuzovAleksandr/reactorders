"use client";

import { deleteOrder } from "./actions";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
    return (
        <form action={() => deleteOrder(orderId)}>
            <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
                Удалить
            </button>
        </form>
    );
}