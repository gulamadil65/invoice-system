// 'use client'

// import React, { lazy, Suspense, useState } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import Sidebar from './components/Slidebar'

// const LazyInvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'))
// const LazySaleList = lazy(() => import('./components/SaleList'))
// const LazyPurchaseList = lazy(() => import('./components/PurchaseList'))
// const LazyInventoryList = lazy(() => import('./components/InventoryList'))
// const LazySetting = lazy(() => import('./components/setting'))
// const LazyDailyReport = lazy(() => import('./components/DailyReport'))

// function ContentView({ view }: { view: string }) {
//   return (
//     <Suspense fallback={<div>Loading content...</div>}>
//       {view === 'invoice' && <LazyInvoiceGenerator />}
//       {view === 'sales' && <LazySaleList />}
//       {view === 'purchases' && <LazyPurchaseList />}
//       {view === 'inventory' && <LazyInventoryList />}
//       {view === 'setting' && <LazySetting />}
//       {view === 'daily' && <LazyDailyReport />}
//     </Suspense>
//   )
// }

// export default function ClientHome() {
//   const searchParams = useSearchParams()
//   const view = searchParams.get('view') || 'invoice'
//   const router = useRouter()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
//   const handleNavigation = (view: string) => router.push(`?view=${view}`)

//   return (
//     <div className="relative">
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       <div className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
//         <nav className="mb-6 flex gap-4 ml-8">
//           <Button onClick={() => handleNavigation('invoice')}>Invoice</Button>
//           <Button onClick={() => handleNavigation('sales')}>Sales List</Button>
//         </nav>

//         <ContentView view={view} />
//       </div>
//     </div>
//   )
// }
