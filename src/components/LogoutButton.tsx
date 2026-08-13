"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded bg-red-600 px-4 py-2 text-white"
        >
            Logout
        </button>
    );
}