"use client";

import { signOut, useSession } from "next-auth/react";

export default function Topbar() {
    const { data } = useSession();

    return (
        <div className="flex items-center justify-between p-4 bg-panel border-b border-slate-700">
            <div />
            <div className="flex items-center gap-3">
                <span>{data?.user?.name || "Гость"}</span>
                <button className="cursor-pointer px-3 py-2 rounded bg-sky-500 text-black" onClick={() => signOut({ callbackUrl: "/login" })}>
                    Выйти
                </button>
            </div>
        </div>
    );
}