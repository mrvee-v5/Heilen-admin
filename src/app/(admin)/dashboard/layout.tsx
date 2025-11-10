'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import AppHeader from '@/layout/AppHeader'
import AppSidebar from '@/layout/AppSidebar'
import Backdrop from '@/layout/Backdrop'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token || !isAuthenticated) {
        router.replace('/login')
      } else {
        setCheckingAuth(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [token, isAuthenticated, router])

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    )
  }

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]'

  return (
    <div className="min-h-screen xl:flex overflow-x-hidden">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} flex flex-col h-screen overflow-hidden`}
      >
        {/* Fixed Header */}
        <div className="shrink-0">
          <AppHeader />
        </div>

        {/* Scrollable Page Content (vertical only) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
