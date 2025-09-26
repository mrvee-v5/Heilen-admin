// /components/AlertWrapper.tsx
"use client";

import { useAlert } from "@/components/context/AlertContext";
import Alert from "./Alert";



export default function AlertWrapper() {
    const { alert } = useAlert();
    return (
        <>
            {alert.show && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-sm px-4">
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                </div>
            )}
        </>
    );
}