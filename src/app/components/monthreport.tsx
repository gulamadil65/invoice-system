// import { useEffect, useState } from 'react'
// import { Invoice } from '../utils/storage'
// import { supabase } from '../utils/supabaseClient'

// export default function MonthlyReport() {
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [type, setType] = useState<'sale' | 'purchase'>('sale')
//   const [fromDate, setFromDate] = useState('')
//   const [toDate, setToDate] = useState('')

//   const [grandTotal, setGrandTotal] = useState({
//   total: 0,
//   cash: 0,
//   gpay: 0,
//   card: 0,
//   ppay: 0,
//   credit: 0,
// })


//   const [totalsByDate, setTotalsByDate] = useState<{
//     [date: string]: {
//       total: number
//       cash: number
//       gpay: number
//       card: number
//       ppay: number
//       credit: number
//     }
//   }>({})

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase
//         .from('invoices')
//         .select('*')
//         .eq('type', type)

//       if (error) {
//         console.error('Error fetching invoices:', error)
//       } else {
//         setInvoices(data as Invoice[])
//       }
//     }

//     fetchData()
//   }, [type])

//   useEffect(() => {
//     if (!fromDate || !toDate) return

//     const filteredData = invoices.filter((inv) => {
//       return inv.date >= fromDate && inv.date <= toDate
//     })

//     const totals: typeof totalsByDate = {}


        

//     filteredData.forEach((inv) => {
//       if (!totals[inv.date]) {
//         totals[inv.date] = {
//           total: 0,
//           cash: 0,
//           gpay: 0,
//           card: 0,
//           ppay: 0,
//           credit: 0,
//         }
//       }

//       totals[inv.date].total += inv.totalPaid

//       inv.payments?.forEach((p) => {
//         const amt = parseFloat(p.amount || '0')
//         switch (p.mode.toUpperCase()) {
//           case 'CASH': totals[inv.date].cash += amt; break
//           case 'G PAY': totals[inv.date].gpay += amt; break
//           case 'CARD': totals[inv.date].card += amt; break
//           case 'P PAY': totals[inv.date].ppay += amt; break
//           case 'CREDIT': totals[inv.date].credit += amt; break
//         }
//       })
//     })

//     setTotalsByDate(totals)
//     const grand = {
//         total: 0,
//         cash: 0,
//         gpay: 0,
//         card: 0,
//         ppay: 0,
//         credit: 0
//       }

//       Object.values(totals).forEach(day => {
//         grand.total += day.total
//         grand.cash += day.cash
//         grand.gpay += day.gpay
//         grand.card += day.card
//         grand.ppay += day.ppay
//         grand.credit += day.credit
//       })

//       setGrandTotal(grand)

//   }, [fromDate, toDate, invoices])

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Monthly Report</h2>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div>
//           <label className="block mb-1">From Date:</label>
//           <input
//             type="date"
//             className="border p-2 w-full"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block mb-1">To Date:</label>
//           <input
//             type="date"
//             className="border p-2 w-full"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Type:</label>
//           <select
//             className="border p-2 w-full"
//             value={type}
//             onChange={(e) => setType(e.target.value as 'sale' | 'purchase')}
//           >
//             <option value="sale">Sale</option>
//             <option value="purchase">Purchase</option>
//           </select>
//         </div>
//       </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//       <div className="bg-blue-100 p-4 rounded">Total: ₹{grandTotal.total.toFixed(2)}</div>
//       <div className="bg-green-100 p-4 rounded">Cash: ₹{grandTotal.cash.toFixed(2)}</div>
//       <div className="bg-yellow-100 p-4 rounded">G PAY: ₹{grandTotal.gpay.toFixed(2)}</div>
//       <div className="bg-purple-100 p-4 rounded">CARD: ₹{grandTotal.card.toFixed(2)}</div>
//       <div className="bg-pink-100 p-4 rounded">P PAY: ₹{grandTotal.ppay.toFixed(2)}</div>
//       <div className="bg-red-100 p-4 rounded">CREDIT: ₹{grandTotal.credit.toFixed(2)}</div>
//       </div>


//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Total</th>
//             <th className="border p-2">Cash</th>
//             <th className="border p-2">G PAY</th>
//             <th className="border p-2">CARD</th>
//             <th className="border p-2">P PAY</th>
//             <th className="border p-2">CREDIT</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(totalsByDate)
//             .sort(([a], [b]) => a.localeCompare(b))
//             .map(([date, total], idx) => (
//               <tr key={idx}>
//                 <td className="border p-2">{date}</td>
//                 <td className="border p-2">₹{total.total.toFixed(2)}</td>
//                 <td className="border p-2">₹{total.cash.toFixed(2)}</td>
//                 <td className="border p-2">₹{total.gpay.toFixed(2)}</td>
//                 <td className="border p-2">₹{total.card.toFixed(2)}</td>
//                 <td className="border p-2">₹{total.ppay.toFixed(2)}</td>
//                 <td className="border p-2">₹{total.credit.toFixed(2)}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function MonthlyReport() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [totalsByDate, setTotalsByDate] = useState<{
    [date: string]: {
      total: number
      cash: number
      gpay: number
      card: number
      ppay: number
      credit: number
    }
  }>({})
  const [grandTotal, setGrandTotal] = useState({
    total: 0,
    cash: 0,
    gpay: 0,
    card: 0,
    ppay: 0,
    credit: 0
  })

  useEffect(() => {
    if (!fromDate || !toDate) return

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('daily_reports')
        .select('date, total_sales, cash_in_hand, gpay, card, ppay, credit')
        .gte('date', fromDate)
        .lte('date', toDate)

      if (error) {
        console.error('Error fetching daily reports:', error)
        return
      }

      const totals: typeof totalsByDate = {}
      data?.forEach((day) => {
        totals[day.date] = {
          total: day.total_sales || 0,
          cash: day.cash_in_hand || 0, // ✅ Now using cash_in_hand
          gpay: day.gpay || 0,
          card: day.card || 0,
          ppay: day.ppay || 0,
          credit: day.credit || 0
        }
      })

      setTotalsByDate(totals)

      // Calculate grand totals
      const grand = { total: 0, cash: 0, gpay: 0, card: 0, ppay: 0, credit: 0 }
      Object.values(totals).forEach(day => {
        grand.total += day.total
        grand.cash += day.cash
        grand.gpay += day.gpay
        grand.card += day.card
        grand.ppay += day.ppay
        grand.credit += day.credit
      })
      setGrandTotal(grand)
    }

    fetchData()
  }, [fromDate, toDate])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-1">From Date:</label>
          <input type="date" className="border p-2 w-full" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">To Date:</label>
          <input type="date" className="border p-2 w-full" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">Total: ₹{grandTotal.total.toFixed(2)}</div>
        <div className="bg-green-100 p-4 rounded">Cash in Hand: ₹{grandTotal.cash.toFixed(2)}</div>
        <div className="bg-yellow-100 p-4 rounded">G PAY: ₹{grandTotal.gpay.toFixed(2)}</div>
        <div className="bg-purple-100 p-4 rounded">CARD: ₹{grandTotal.card.toFixed(2)}</div>
        <div className="bg-pink-100 p-4 rounded">P PAY: ₹{grandTotal.ppay.toFixed(2)}</div>
        <div className="bg-red-100 p-4 rounded">CREDIT: ₹{grandTotal.credit.toFixed(2)}</div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Cash in Hand</th>
            <th className="border p-2">G PAY</th>
            <th className="border p-2">CARD</th>
            <th className="border p-2">P PAY</th>
            <th className="border p-2">CREDIT</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(totalsByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, total], idx) => (
              <tr key={idx}>
                <td className="border p-2">{date}</td>
                <td className="border p-2">₹{total.total.toFixed(2)}</td>
                <td className="border p-2">₹{total.cash.toFixed(2)}</td>
                <td className="border p-2">₹{total.gpay.toFixed(2)}</td>
                <td className="border p-2">₹{total.card.toFixed(2)}</td>
                <td className="border p-2">₹{total.ppay.toFixed(2)}</td>
                <td className="border p-2">₹{total.credit.toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

