// // app/page.tsx
// import React, { Suspense } from 'react'

// // Dynamically import the client component
// const ClientHome = React.lazy(() => import('./ClientHome'))

// export default function HomePage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ClientHome />
//     </Suspense>
//   )
// }





// 'use client'

// import React, { Suspense, lazy, useState } from 'react'
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

// export default function Home() {
//   const searchParams = useSearchParams()
//   const view = searchParams.get('view') || 'invoice'
//   const router = useRouter()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

//   const handleNavigation = (view: string) => {
//     // Use replace if you don’t want to add to browser history
//     router.push(`?view=${view}`)
//   }

//   return (
//     <div className="relative">
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       <div
//         className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
//           isSidebarOpen ? 'ml-64' : 'ml-0'
//         }`}
//       >
//         <nav className="mb-6 flex gap-4 ml-8">
//           <Button onClick={() => handleNavigation('invoice')}>Invoice</Button>
//           <Button onClick={() => handleNavigation('sales')}>Sales List</Button>
//           {/* <Button onClick={() => handleNavigation('purchases')}>Purchases List</Button>
//           <Button onClick={() => handleNavigation('inventory')}>Inventory List</Button>
//           <Button onClick={() => handleNavigation('setting')}>Settings</Button>
//           <Button onClick={() => handleNavigation('daily')}>Daily Report</Button> */}
//         </nav>

//         <ContentView view={view} />
//       </div>
//     </div>
//   )
// }

'use client'

import React, { Suspense, lazy, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Sidebar from './components/Slidebar'  // Import Sidebar
import { Loader } from './components/loader'

const LazyInvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'))
const LazySaleList = lazy(() => import('./components/SaleList'))
const LazyPurchaseList = lazy(() => import('./components/PurchaseList'))
const LazyInventoryList = lazy(() => import('./components/InventoryList'))
const LazySetting = lazy(() => import('./components/setting'))
const LazyDailyReport = lazy(() => import('./components/DailyReport'))
const LazyMonthReport = lazy(() => import('./components/monthreport'))
const LazyDailyExpense = lazy(() => import('./components/payments'))



function ContentView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'invoice'

  return (
    <Suspense fallback={<div>Loading content...</div>}>
      {view === 'invoice' && <LazyInvoiceGenerator />}
      {view === 'sales' && <LazySaleList />}
      {view === 'purchases' && <LazyPurchaseList />}
      {view === 'inventory' && <LazyInventoryList />}
      {view === 'setting' && <LazySetting />}
      {view === 'daily' && <LazyDailyReport />}
      {view === 'month' && <LazyMonthReport />}
      {view === 'expense' && <LazyDailyExpense/>}


    </Suspense>
  )
}

export default function Home() {
  // State for controlling sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <nav className="mb-6">
          <Button asChild className="mr-4 ml-8">
            <a href="?view=invoice">Invoice</a>
          </Button>
          <Button asChild className="mr-4">
            <a href="?view=sales">Sales List</a>
          </Button>
          {/* <Button asChild className="mr-4">
            <a href="?view=purchases">Purchases List</a>
          </Button>
          <Button asChild className="mr-4">
            <a href="?view=inventory">Inventory List</a>
          </Button> */}
        </nav>

        {/* Content */}
        {/* <Suspense fallback={<div>Loading page...</div>}> */}
        <Suspense fallback={<Loader />}>

          <ContentView />
        </Suspense>
      </div>
    </div>
  )
}


// 'use client'

// import React, { Suspense, lazy, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import Sidebar from './components/Slidebar'  // Import Sidebar

// const LazyInvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'))
// const LazySaleList = lazy(() => import('./components/SaleList'))
// const LazyPurchaseList = lazy(() => import('./components/PurchaseList'))
// const LazyInventoryList = lazy(() => import('./components/InventoryList'))
// const LazySetting = lazy(() => import('./components/setting'))
// const LazyDailyReport = lazy(() => import('./components/DailyReport'))



// export default function Home() {
//   const searchParams = useSearchParams()
//   const view = searchParams.get('view') || 'invoice'
  
//   // State for controlling sidebar visibility
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   // Function to toggle the sidebar visibility
//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev)
//   }

//   return (
//     <div className="relative">
//       {/* Sidebar */}
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Main content */}
//       <div
//         className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
//           isSidebarOpen ? 'ml-64' : 'ml-0'
//         }`}
//       >
//         <nav className="mb-6">
//           <Button asChild className="mr-4 ml-8">
//             <a href="?view=invoice">Invoice</a>
//           </Button>
//           <Button asChild className="mr-4">
//             <a href="?view=sales">Sales List</a>
//           </Button>
//           {/* <Button asChild className="mr-4">
//             <a href="?view=purchases">Purchases List</a>
//           </Button>
//           <Button asChild className="mr-4">
//             <a href="?view=inventory">Inventory List</a>
//           </Button> */}
//         </nav>

//         <Suspense fallback={<div>Loading...</div>}>
//           {view === 'invoice' && <LazyInvoiceGenerator />}
//           {view === 'sales' && <LazySaleList />}
//           {view === 'purchases' && <LazyPurchaseList />}
//           {view === 'inventory' && <LazyInventoryList />}
//           {view === 'setting' && <LazySetting />}
//           {view === 'daily' && <LazyDailyReport />}

//         </Suspense>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import React, { Suspense, lazy, useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { supabase } from '../lib/supabase'
// import { OnlineStatus } from './components/OnlineStatus'
// import { Auth } from './components/Auth'
// import { getCurrentUser } from './utils/supabaseClient'
// import { User } from '@supabase/supabase-js'



// const LazyInvoiceGenerator = lazy(() => import('./components/InvoiceGenerator'))
// const LazySaleList = lazy(() => import('./components/SaleList'))
// const LazyPurchaseList = lazy(() => import('./components/PurchaseList'))
// const LazyInventoryList = lazy(() => import('./components/InventoryList'))

// export default function Home() {
//   const searchParams = useSearchParams()
//   const view = searchParams.get('view') || 'invoice'
//   const [, setIsOnline] = useState(true)

//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const currentUser = await getCurrentUser()
//       setUser(currentUser)
//     }
//     fetchUser()
//   }, [])
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)

//     window.addEventListener('online', handleOnline)
//     window.addEventListener('offline', handleOffline)

//     const subscription = supabase
//       .channel('any')
//       .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
//         // Refresh data based on the changed table
//         if (payload.table === 'invoices') {
//           // Refresh invoices
//         } else if (payload.table === 'inventory') {
//           // Refresh inventory
//         }
//       })
//       .subscribe()

//     return () => {
//       window.removeEventListener('online', handleOnline)
//       window.removeEventListener('offline', handleOffline)
//       subscription.unsubscribe()
//     }
//   }, [])

//   return (
//     <div className="container mx-auto p-4">
//        {!user && <Auth />}
//       {user && (
//         <>

//       <nav className="mb-4 flex justify-between items-center">
//         <div>
//           <Button asChild className="mr-2">
//             <a href="?view=invoice">Invoice Generator</a>
//           </Button>
//           <Button asChild className="mr-2">
//             <a href="?view=sales">Sales List</a>
//           </Button>
//           <Button asChild className="mr-2">
//             <a href="?view=purchases">Purchases List</a>
//           </Button>
//           <Button asChild className="mr-2">
//             <a href="?view=inventory">Inventory List</a>
//           </Button>
//         </div>
//         <OnlineStatus />
//       </nav>

//       <Suspense fallback={<div>Loading...</div>}>
//         {view === 'invoice' && <LazyInvoiceGenerator />}
//         {view === 'sales' && <LazySaleList />}
//         {view === 'purchases' && <LazyPurchaseList />}
//         {view === 'inventory' && <LazyInventoryList />}
//       </Suspense>
//       </>
      
//       )}
//     </div>
//   )
// }



