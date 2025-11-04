'use client'

import { InfinitySpin } from 'react-loader-spinner'

export default function GlobalLoading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <InfinitySpin
        width="200"
        color="#C06A4D" // customize color
      />
    </div>
  )
}
