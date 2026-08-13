import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import React from "react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-bg text-white">
            <Sidebar />
            <main className="flex-1">
                <Topbar />
                {children}
            </main>
        </div>
    );
}