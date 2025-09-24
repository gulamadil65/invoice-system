// // Slidebar.tsx
// import React from 'react'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'

// const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
//   return (
//     <>
//       <Button
//         variant="outline"
//         onClick={toggleSidebar}
//         className="fixed top-10 left-4 z-50"
//       >
//         {isSidebarOpen ? '|||' : '...'}
//       </Button>

//       <div
//         className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-6 transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <h2 className="text-xl font-semibold mb-6 text-white">Dashboard</h2>
//         <nav className="space-y-4">
//           <div>
//             <Link href="?view=invoice&type=sale">
//               <Button variant="secondary" className="w-full">New Invoice</Button>
//             </Link>
//           </div>
//           <div>
//             <Link href="?view=invoice&type=purchase">
//               <Button variant="secondary" className="w-full">New Purchase Invoice</Button>
//             </Link>
//           </div>
//           <div>
//             <Link href="?view=sales">
//               <Button variant="secondary" className="w-full">Sales Invoice List</Button>
//             </Link>
//           </div>
//           <div>
//             <Link href="?view=purchases">
//               <Button variant="secondary" className="w-full">Purchases List</Button>
//             </Link>
//           </div>
//           <div>
//             <Link href="?view=inventory">
//               <Button variant="secondary" className="w-full">Inventory List</Button>
//             </Link>
//           </div>
//           <div>
//             <Link href="?view=setting">
//               <Button variant="secondary" className="w-full">PDF Settings</Button>
//             </Link>
//           </div>
//           <div>
//           <Link href="?view=daily">
//           <Button variant="secondary" className="w-full">Daily Report</Button>
//           </Link>

//           </div>
//         </nav>
//       </div>
//     </>
//   )
// }

// export default Sidebar


'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ChevronUp, ChevronDown } from 'lucide-react'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  const router = useRouter()

  const handleNavigation = (href: string) => {
    toggleSidebar()
    // Triggering navigation
    router.push(href)
  }

  return (
    <>
      <Button
        onClick={toggleSidebar}
        className={`fixed top-10 left-4 z-50 px-4 py-2 rounded-lg text-sm font-bold 
          bg-gradient-to-br from-purple-600 to-blue-500 
          text-white shadow-lg shadow-blue-500/40 
          hover:shadow-pink-500/40 hover:scale-105 
          transition-all duration-300 ease-in-out border border-white/20`}
      >
        {isSidebarOpen ? '⨯' : '☰'}
      </Button>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-6 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-xl font-semibold mb-6 text-white">Dashboard</h2>
        <nav className="space-y-4">
          <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=invoice&type=sale')}>
            New Invoice
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=invoice&type=purchase')}>
            New Purchase Invoice
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=sales')}>
            Sales Invoice List
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=purchases')}>
            Purchases List
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=inventory')}>
            Inventory List
          </Button>
         

           {/* Options Collapsible */}
          <div>
            <Button
              variant="secondary"
              className="w-full flex justify-between items-center"
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            >
              Options {isOptionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>

            {isOptionsOpen && (
              <div className="mt-2 ml-4 space-y-2">
                <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=daily')}>
                  Daily Report
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=month')}>
                  Monthly Report
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=expense')}>
                  Payment
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => handleNavigation('?view=setting')}>
                  PDF Setting
                </Button>
              </div>
            )}
          </div>
          
        </nav> 
      </div>
    </>
  )
}

export default Sidebar
