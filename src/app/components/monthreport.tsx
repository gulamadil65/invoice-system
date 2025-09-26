
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function MonthlyReport() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [totalsByDate, setTotalsByDate] = useState<{
      [date: string]: {
    total: number
    cash: number
    gpayHyder: number
    pnbBox: number
    ppay: number
    gpaySohail: number
    gpayAdil: number
    bank: number
    card: number
    credit: number
    }
  }>({})
  const [grandTotal, setGrandTotal] = useState({
     total: 0,
  cash: 0,
  gpayHyder: 0,
  pnbBox: 0,
  ppay: 0,
  gpaySohail: 0,
  gpayAdil: 0,
  bank: 0,
  card: 0,
  credit: 0,
  })

  useEffect(() => {
    if (!fromDate || !toDate) return

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('daily_reports')
        .select('date, total_sales, cash_in_hand,gpay_hyder, pnb_box, ppay,gpay_sohail, gpay_adil, bank, card, credit')
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
          cash: day.cash_in_hand || 0,
          gpayHyder: day.gpay_hyder || 0,
          pnbBox: day.pnb_box || 0,
          ppay: day.ppay || 0,
          gpaySohail: day.gpay_sohail || 0,
          gpayAdil: day.gpay_adil || 0,
          bank: day.bank || 0,
          card: day.card || 0,
          credit: day.credit || 0,
        }
      })

      setTotalsByDate(totals)

      // Calculate grand totals
      const grand = { total: 0, cash: 0, gpayHyder: 0, pnbBox: 0,
      ppay: 0, gpaySohail: 0, gpayAdil: 0,
      bank: 0, card: 0, credit: 0 }
      Object.values(totals).forEach(day => {
        grand.total += day.total
        grand.cash += day.cash
        grand.gpayHyder += day.gpayHyder
        grand.pnbBox += day.pnbBox
        grand.ppay += day.ppay
        grand.gpaySohail += day.gpaySohail
        grand.gpayAdil += day.gpayAdil
        grand.bank += day.bank
        grand.card += day.card
        grand.credit += day.credit
      })
      setGrandTotal(grand)
    }

    fetchData()
  }, [fromDate, toDate])

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Monthly Report</h2>

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
        <div className="bg-yellow-100 p-4 rounded">GPay Hyder: ₹{grandTotal.gpayHyder.toFixed(2)}</div>
        <div className="bg-orange-100 p-4 rounded">PNB Box: ₹{grandTotal.pnbBox.toFixed(2)}</div>
        <div className="bg-pink-200 p-4 rounded">GPay Sohail: ₹{grandTotal.gpaySohail.toFixed(2)}</div>
        <div className="bg-teal-100 p-4 rounded">GPay Adil: ₹{grandTotal.gpayAdil.toFixed(2)}</div>
        <div className="bg-indigo-100 p-4 rounded">Bank: ₹{grandTotal.bank.toFixed(2)}</div>
        <div className="bg-pink-100 p-4 rounded">P PAY: ₹{grandTotal.ppay.toFixed(2)}</div>
        <div className="bg-purple-100 p-4 rounded">CARD: ₹{grandTotal.card.toFixed(2)}</div>
        <div className="bg-red-100 p-4 rounded">CREDIT: ₹{grandTotal.credit.toFixed(2)}</div>
        
      </div>
      {/* table */}
   <div className="overflow-auto rounded-lg shadow-md">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-100 text-gray-700">
          <tr className="bg-gray-200">
            <th className="px-3 py-2 text-left text-sm font-medium">Date</th>
            <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
            <th className="px-3 py-2 text-left text-sm font-medium">Cash in Hand</th>
            <th className="px-3 py-2 text-left text-sm font-medium">GPay Hyder</th>
            <th className="px-3 py-2 text-left text-sm font-medium">PNB Box</th>
            <th className="px-3 py-2 text-left text-sm font-medium">P PAY</th>
            <th className="px-3 py-2 text-left text-sm font-medium">GPay Sohail</th>
            <th className="px-3 py-2 text-left text-sm font-medium">GPay Adil</th>
            <th className="px-3 py-2 text-left text-sm font-medium">Bank</th>
            <th className="px-3 py-2 text-left text-sm font-medium">Card</th>
            <th className="px-3 py-2 text-left text-sm font-medium">Credit</th>
 
          </tr>
        </thead>
    <tbody className="divide-y divide-gray-100">
          {Object.entries(totalsByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, total], idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-2">{date}</td>
                <td className="px-3 py-2">₹{total.total.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.cash.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.gpayHyder.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.pnbBox.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.ppay.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.gpaySohail.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.gpayAdil.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.bank.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.card.toFixed(2)}</td>
                <td className="px-3 py-2">₹{total.credit.toFixed(2)}</td>

              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

