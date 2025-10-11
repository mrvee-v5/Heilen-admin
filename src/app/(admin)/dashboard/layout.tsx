"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Protect dashboard routes
  useEffect(() => {
    // Delay check until Zustand has rehydrated (so persisted state is available)
    const timer = setTimeout(() => {
      if (!token || !isAuthenticated) {
        router.replace("/login");
      } else {
        setCheckingAuth(false);
      }
    }, 200); // small delay to allow rehydration

    return () => clearTimeout(timer);
  }, [token, isAuthenticated, router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // Dynamic main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
