import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(
            state,
            action: PayloadAction<{ id: string; name: string; price: number }>
        ) {
            const found = state.items.find((i) => i.id === action.payload.id);
            if (found) {
                found.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },

        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },

        // Новый экшен: установка количества (в т.ч. 0 для удаления)
        updateQuantity(
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (!item) return;

            const qty = Math.max(0, Math.floor(action.payload.quantity));

            if (qty === 0) {
                state.items = state.items.filter((i) => i.id !== item.id);
            } else {
                item.quantity = qty;
            }
        },

        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;