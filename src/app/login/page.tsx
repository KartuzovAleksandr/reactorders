"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
        });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="mx-auto mt-20 flex w-full max-w-sm flex-col gap-4 rounded bg-panel p-6"
        >
            <h1 className="text-xl text-white">Login</h1>

            <input
                className="rounded bg-panel2 px-3 py-2 text-white outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
            />

            <input
                className="rounded bg-panel2 px-3 py-2 text-white outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />

            <button className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
                Sign in
            </button>
            <div className="flex text-center text-gray-600 w-full">
                Если не знаете никаких аккаунтов - см. readme.md, если нажмете Назад будете Гостем без прав
            </div>
        </form>
    );
}