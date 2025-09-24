'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

export function SearchParamsWrapper({ children }: { children: (view: string) => React.ReactNode }) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'invoice'

  return <>{children(view)}</>
}
