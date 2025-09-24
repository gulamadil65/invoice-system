

// import PullToRefresh from 'react-pull-to-refresh'
// import { useEffect, useState } from 'react'
// import { Invoice } from '../utils/storage'
// import { supabase } from '../utils/supabaseClient'

// export default function DailyReport() {
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [filtered, setFiltered] = useState<Invoice[]>([])
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
//   const [totals, setTotals] = useState({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 })

//   const fetchData = async () => {
//     const { data, error } = await supabase.from('invoices').select('*').eq('type', 'sale')
//     if (error) console.error('Error fetching invoices:', error)
//     else if (data) setInvoices(data as Invoice[])
//   }

//   useEffect(() => { fetchData() }, [])

//   useEffect(() => {
//     if (selectedDate) {
//       const filteredByDate = invoices.filter(inv => inv.date === selectedDate)
//       setFiltered(filteredByDate)
//       calculateTotals(filteredByDate)
//     } else {
//       setFiltered([])
//       setTotals({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 })
//     }
//   }, [selectedDate, invoices])

//   const calculateTotals = (data: Invoice[]) => {
//     let total = 0, cash = 0, gpay = 0, card = 0, ppay = 0, credit = 0
//     data.forEach(inv => {
//       total += inv.totalPaid
//       inv.payments?.forEach(p => {
//         const amt = parseFloat(p.amount || '0')
//         switch (p.mode.toUpperCase()) {
//           case 'CASH': cash += amt; break
//           case 'G PAY': gpay += amt; break
//           case 'CARD': card += amt; break
//           case 'P PAY': ppay += amt; break
//           case 'CREDIT': credit += amt; break
//         }
//       })
//     })
//     setTotals({ total, cash, gpay, card, ppay, credit })
//   }

//   return (
//     <PullToRefresh onRefresh={fetchData}>
//       <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
//         <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">📅 Daily Sales Report</h2>

//         <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-700 mb-1">Select Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           <button
//             onClick={() => {
//               setSelectedDate('')
//             }}
//             className="text-sm text-blue-500 underline self-end hover:text-blue-700"
//           >
//             Clear Date
//           </button>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-blue-100 p-4 rounded shadow-sm">Total Sale: ₹{totals.total.toFixed(2)}</div>
//           <div className="bg-green-100 p-4 rounded shadow-sm">Cash: ₹{totals.cash.toFixed(2)}</div>
//           <div className="bg-yellow-100 p-4 rounded shadow-sm">G PAY: ₹{totals.gpay.toFixed(2)}</div>
//           <div className="bg-purple-100 p-4 rounded shadow-sm">CARD: ₹{totals.card.toFixed(2)}</div>
//           <div className="bg-pink-100 p-4 rounded shadow-sm">P PAY: ₹{totals.ppay.toFixed(2)}</div>
//           <div className="bg-red-100 p-4 rounded shadow-sm">CREDIT: ₹{totals.credit.toFixed(2)}</div>
//         </div>

//         <div className="overflow-auto rounded-lg shadow-md">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-3 py-2 text-left text-sm font-medium">Bill No</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">Customer</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">Cash</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">G PAY</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">CARD</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">P PAY</th>
//                 <th className="px-3 py-2 text-left text-sm font-medium">CREDIT</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filtered.map((inv, idx) => {
//                 const payMap = { cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 }
//                 inv.payments?.forEach(p => {
//                   const amt = parseFloat(p.amount || '0')
//                   switch (p.mode.toUpperCase()) {
//                     case 'CASH': payMap.cash += amt; break
//                     case 'G PAY': payMap.gpay += amt; break
//                     case 'CARD': payMap.card += amt; break
//                     case 'P PAY': payMap.ppay += amt; break
//                     case 'CREDIT': payMap.credit += amt; break
//                   }
//                 })
//                 return (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-3 py-2">{inv.billNo}</td>
//                     <td className="px-3 py-2">{inv.customer}</td>
//                     <td className="px-3 py-2">₹{inv.totalPaid.toFixed(2)}</td>
//                     <td className="px-3 py-2">₹{payMap.cash.toFixed(2)}</td>
//                     <td className="px-3 py-2">₹{payMap.gpay.toFixed(2)}</td>
//                     <td className="px-3 py-2">₹{payMap.card.toFixed(2)}</td>
//                     <td className="px-3 py-2">₹{payMap.ppay.toFixed(2)}</td>
//                     <td className="px-3 py-2">₹{payMap.credit.toFixed(2)}</td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </PullToRefresh>
//   )
// }

'user client'

// import PullToRefresh from 'react-pull-to-refresh'
// import { useEffect, useState } from 'react'
// import { Invoice } from '../utils/storage'
// import { supabase } from '../utils/supabaseClient'

// export default function DailyReport() {
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [filtered, setFiltered] = useState<Invoice[]>([])
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
//   const [totals, setTotals] = useState({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 })

//   const [openingBalance, setOpeningBalance] = useState(0)
//   const [closingBalance, setClosingBalance] = useState(0)
//   const [cashInHand, setCashInHand] = useState(0)

//   // fetch invoices
//   const fetchData = async () => {
//     const { data, error } = await supabase.from('invoices').select('*').eq('type', 'sale')
//     if (error) console.error('Error fetching invoices:', error)
//     else if (data) setInvoices(data as Invoice[])
//   }

//   // fetch opening balance from previous day's closing
//   const fetchOpeningBalance = async (date: string) => {
//     const prevDay = new Date(date)
//     prevDay.setDate(prevDay.getDate() - 1)
//     const prevDayStr = prevDay.toISOString().split('T')[0]

//     const { data, error } = await supabase
//       .from('daily_reports')
//       .select('closing_balance')
//       .eq('date', prevDayStr)
//       .single()

//     if (error && error.code !== 'PGRST116') console.error('Error fetching opening balance:', error)
//     else if (data) setOpeningBalance(data.closing_balance || 0)
//     else setOpeningBalance(0)
//   }

//   useEffect(() => { fetchData() }, [])

//   useEffect(() => {
//         const testConnection = async () => {
//           const { error } = await supabase.from('daily_reports').select('*').limit(1);
//           if (error) {
//             console.error("❌ Supabase not connected:", error.message);
//           } else {
//             console.log("✅ Supabase connected.  daily_reports  table.");
//           }
//         };
  
//         testConnection();
//       }, []);

//   useEffect(() => {
//     if (selectedDate) {
//       fetchOpeningBalance(selectedDate)
//       const filteredByDate = invoices.filter(inv => inv.date === selectedDate)
//       setFiltered(filteredByDate)
//       calculateTotals(filteredByDate)
//     } else {
//       setFiltered([])
//       setTotals({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 })
//     }
//   }, [selectedDate, invoices])

//   const calculateTotals = (data: Invoice[]) => {
//     let total = 0, cash = 0, gpay = 0, card = 0, ppay = 0, credit = 0
//     data.forEach(inv => {
//       total += inv.totalPaid
//       inv.payments?.forEach(p => {
//         const amt = parseFloat(p.amount || '0')
//         switch (p.mode.toUpperCase()) {
//           case 'CASH': cash += amt; break
//           case 'G PAY': gpay += amt; break
//           case 'CARD': card += amt; break
//           case 'P PAY': ppay += amt; break
//           case 'CREDIT': credit += amt; break
//         }
//       })
//     })
//     setTotals({ total, cash, gpay, card, ppay, credit })
//   }

//   const saveDailyReport = async () => {
//     const { error } = await supabase.from('daily_reports').upsert({
//       date: selectedDate,
//       opening_balance: openingBalance,
//       closing_balance: closingBalance,
//       cash_in_hand: cashInHand,
//       cash: totals.cash,
//       gpay: totals.gpay,
//       card: totals.card,
//       ppay: totals.ppay,
//       credit: totals.credit,
//       total_sales: totals.total
//     }, { onConflict: 'date' })

//     if (error) console.error('Error saving daily report:', error)
//     else alert('Daily report saved successfully!')
//   }

//   return (
//     <PullToRefresh onRefresh={fetchData}>
//       <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
//         <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">📅 Daily Sales Report</h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="text-sm text-gray-700">Select Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="border border-gray-300 px-4 py-2 rounded-md w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Opening Balance</label>
//             <input
//               type="number"
//               value={openingBalance}
//               onChange={(e) => setOpeningBalance(Number(e.target.value))}
//               className="border border-gray-300 px-4 py-2 rounded-md w-full"
//               readOnly
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Closing Balance</label>
//             <input
//               type="number"
//               value={closingBalance}
//               onChange={(e) => setClosingBalance(Number(e.target.value))}
//               className="border border-gray-300 px-4 py-2 rounded-md w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Cash in Hand</label>
//             <input
//               type="number"
//               value={cashInHand}
//               onChange={(e) => setCashInHand(Number(e.target.value))}
//               className="border border-gray-300 px-4 py-2 rounded-md w-full"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-blue-100 p-4 rounded shadow-sm">Total Sale: ₹{totals.total.toFixed(2)}</div>
//           <div className="bg-green-100 p-4 rounded shadow-sm">Cash: ₹{totals.cash.toFixed(2)}</div>
//           <div className="bg-yellow-100 p-4 rounded shadow-sm">G PAY: ₹{totals.gpay.toFixed(2)}</div>
//           <div className="bg-purple-100 p-4 rounded shadow-sm">CARD: ₹{totals.card.toFixed(2)}</div>
//           <div className="bg-pink-100 p-4 rounded shadow-sm">P PAY: ₹{totals.ppay.toFixed(2)}</div>
//           <div className="bg-red-100 p-4 rounded shadow-sm">CREDIT: ₹{totals.credit.toFixed(2)}</div>
//         </div>

//         <div className="mb-6">
//           <button
//             onClick={saveDailyReport}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
//           >
//             Save Daily Report
//           </button>
//         </div>

        // <div className="overflow-auto rounded-lg shadow-md">
        //   <table className="min-w-full divide-y divide-gray-200">
        //     <thead className="bg-gray-100 text-gray-700">
        //       <tr>
        //         <th className="px-3 py-2 text-left text-sm font-medium">Bill No</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">Customer</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">Cash</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">G PAY</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">CARD</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">P PAY</th>
        //         <th className="px-3 py-2 text-left text-sm font-medium">CREDIT</th>
        //       </tr>
        //     </thead>
        //     <tbody className="divide-y divide-gray-100">
        //       {filtered.map((inv, idx) => {
        //         const payMap = { cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 }
        //         inv.payments?.forEach(p => {
        //           const amt = parseFloat(p.amount || '0')
        //           switch (p.mode.toUpperCase()) {
        //             case 'CASH': payMap.cash += amt; break
        //             case 'G PAY': payMap.gpay += amt; break
        //             case 'CARD': payMap.card += amt; break
        //             case 'P PAY': payMap.ppay += amt; break
        //             case 'CREDIT': payMap.credit += amt; break
        //           }
        //         })
        //         return (
        //           <tr key={idx} className="hover:bg-gray-50">
        //             <td className="px-3 py-2">{inv.billNo}</td>
        //             <td className="px-3 py-2">{inv.customer}</td>
        //             <td className="px-3 py-2">₹{inv.totalPaid.toFixed(2)}</td>
        //             <td className="px-3 py-2">₹{payMap.cash.toFixed(2)}</td>
        //             <td className="px-3 py-2">₹{payMap.gpay.toFixed(2)}</td>
        //             <td className="px-3 py-2">₹{payMap.card.toFixed(2)}</td>
        //             <td className="px-3 py-2">₹{payMap.ppay.toFixed(2)}</td>
        //             <td className="px-3 py-2">₹{payMap.credit.toFixed(2)}</td>
        //           </tr>
        //         )
        //       })}
        //     </tbody>
        //   </table>
        // </div>
//       </div>
//     </PullToRefresh>
//   )
// }


import PullToRefresh from 'react-pull-to-refresh'
import { useCallback, useEffect, useState } from 'react'
import { Invoice } from '../utils/storage'
import { supabase } from '../utils/supabaseClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



export default function DailyReport() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filtered, setFiltered] = useState<Invoice[]>([])
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [totals, setTotals] = useState({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 })

  const [openingBalance, setOpeningBalance] = useState(0)
  const [closingBalance, setClosingBalance] = useState(0)
  const [cashInHand, setCashInHand] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)

  const fetchData = async () => {
    const { data, error } = await supabase.from('invoices').select('*').eq('type', 'sale')
    if (error) console.error('Error fetching invoices:', error)
    else if (data) setInvoices(data as Invoice[])
  }

const fetchDailyReport = useCallback(async (date: string) => {
      const { data, error } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching daily report:', error)
    }

    if (data) {
      // Data exists → Edit mode
      setOpeningBalance(data.opening_balance || 0)
      setClosingBalance(data.closing_balance || 0)
      setCashInHand(data.cash_in_hand || 0)
      setTotals({
        total: data.total_sales || 0,
        cash: data.cash || 0,
        gpay: data.gpay || 0,
        card: data.card || 0,
        ppay: data.ppay || 0,
        credit: data.credit || 0
      })
      setIsEditMode(true)
    } else {
      // No data → New mode
      setIsEditMode(false)
      setClosingBalance(0)
      setCashInHand(0)
      fetchOpeningBalance(date) // get from prev day
    }
  }, []);

  const fetchOpeningBalance = async (date: string) => {
    const prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    const prevDayStr = prevDay.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_reports')
      .select('closing_balance')
      .eq('date', prevDayStr)
      .single()

    if (error && error.code !== 'PGRST116') console.error('Error fetching opening balance:', error)
    else if (data) setOpeningBalance(data.closing_balance || 0)
    else setOpeningBalance(0)
  }

  useEffect(() => { fetchData() }, [])

  


useEffect(() => {
  if (selectedDate) {
    fetchDailyReport(selectedDate);
    const filteredByDate = invoices.filter(inv => inv.date === selectedDate);
    setFiltered(filteredByDate);
    calculateTotals(filteredByDate);
  } else {
    setFiltered([]);
    setTotals({ total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 });
  }
}, [selectedDate, invoices, fetchDailyReport]);


  const calculateTotals = (data: Invoice[]) => {
    let total = 0, cash = 0, gpay = 0, card = 0, ppay = 0, credit = 0
    data.forEach(inv => {
      total += inv.totalPaid
      inv.payments?.forEach(p => {
        const amt = parseFloat(p.amount || '0')
        switch (p.mode.toUpperCase()) {
          case 'CASH': cash += amt; break
          case 'G PAY': gpay += amt; break
          case 'CARD': card += amt; break
          case 'P PAY': ppay += amt; break
          case 'CREDIT': credit += amt; break
        }
      })
    })
    setTotals({ total, cash, gpay, card, ppay, credit })
  }

  const saveDailyReport = async () => {
    const { error } = await supabase.from('daily_reports').upsert({
      date: selectedDate,
      opening_balance: openingBalance,
      closing_balance: closingBalance,
      cash_in_hand: cashInHand,
      cash: totals.cash,
      gpay: totals.gpay,
      card: totals.card,
      ppay: totals.ppay,
      credit: totals.credit,
      total_sales: totals.total
    }, { onConflict: 'date' })

    if (error) console.error('Error saving daily report:', error)
    else 
  // alert(isEditMode ? 'Daily report updated successfully!' : 'Daily report saved successfully!')
        toast.success(isEditMode ? 'Daily report updated successfully!' : 'Daily report saved successfully!') 
    setIsEditMode(true)
  }

  return (
    <PullToRefresh onRefresh={fetchData}>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">📅 Daily Sales Report</h2>

      <ToastContainer
        position="top-center" // still needed for internal logic
        autoClose={3000}
        closeOnClick
        draggable
        hideProgressBar
        newestOnTop
        pauseOnHover
        pauseOnFocusLoss
      toastClassName="!rounded-full !bg-white !text-black !text-sm !px-4 !py-2 shadow-lg transition-opacity duration-300"
      bodyClassName="flex items-center justify-center"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-700">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Opening Balance</label>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(Number(e.target.value))}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Closing Balance</label>
            <input
              type="number"
              value={closingBalance}
              onChange={(e) => setClosingBalance(Number(e.target.value))}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Cash in Hand</label>
            <input
              type="number"
              value={cashInHand}
              onChange={(e) => setCashInHand(Number(e.target.value))}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow-sm">Total Sale: ₹{totals.total.toFixed(2)}</div>
          <div className="bg-green-100 p-4 rounded shadow-sm">Cash: ₹{totals.cash.toFixed(2)}</div>
          <div className="bg-yellow-100 p-4 rounded shadow-sm">G PAY: ₹{totals.gpay.toFixed(2)}</div>
          <div className="bg-purple-100 p-4 rounded shadow-sm">CARD: ₹{totals.card.toFixed(2)}</div>
          <div className="bg-pink-100 p-4 rounded shadow-sm">P PAY: ₹{totals.ppay.toFixed(2)}</div>
          <div className="bg-red-100 p-4 rounded shadow-sm">CREDIT: ₹{totals.credit.toFixed(2)}</div>
        </div>

        <div className="mb-6">
          <button
            onClick={saveDailyReport}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {isEditMode ? 'Edit Daily Report' : 'Save Daily Report'}
          </button>
        </div>
          <div className="overflow-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium">Bill No</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Customer</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Cash</th>
                <th className="px-3 py-2 text-left text-sm font-medium">G PAY</th>
                <th className="px-3 py-2 text-left text-sm font-medium">CARD</th>
                <th className="px-3 py-2 text-left text-sm font-medium">P PAY</th>
                <th className="px-3 py-2 text-left text-sm font-medium">CREDIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv, idx) => {
                const payMap = { cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 }
                inv.payments?.forEach(p => {
                  const amt = parseFloat(p.amount || '0')
                  switch (p.mode.toUpperCase()) {
                    case 'CASH': payMap.cash += amt; break
                    case 'G PAY': payMap.gpay += amt; break
                    case 'CARD': payMap.card += amt; break
                    case 'P PAY': payMap.ppay += amt; break
                    case 'CREDIT': payMap.credit += amt; break
                  }
                })
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{inv.billNo}</td>
                    <td className="px-3 py-2">{inv.customer}</td>
                    <td className="px-3 py-2">₹{inv.totalPaid.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{payMap.cash.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{payMap.gpay.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{payMap.card.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{payMap.ppay.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{payMap.credit.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PullToRefresh>
  )
}
