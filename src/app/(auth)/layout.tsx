import GridShape from '@/components/common/GridShape'
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo'

import { ThemeProvider } from '@/context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
        </div>
      </ThemeProvider>
    </div>
  )
}
