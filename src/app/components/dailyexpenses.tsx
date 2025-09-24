// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { supabase } from '../utils/supabaseClient';
// import { Invoice } from '../utils/storage';

// type ExpenseItem = {
//   category: string;
//   amount: number;
// };

// export default function DailyExpenses() {
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [expenses, setExpenses] = useState<ExpenseItem[]>([{ category: '', amount: 0 }]);
//   // const [paymentsMade, setPaymentsMade] = useState<number>(0);
//   const [openingBalance, setOpeningBalance] = useState<number>(0);

//   const totalSales = invoices.reduce((sum, inv) => sum + inv.totalPaid, 0);
//   const paymentsReceived = totalSales;

//   const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
//   // const closingBalance = openingBalance + paymentsReceived - paymentsMade - expensesTotal;
// const closingBalance = openingBalance + paymentsReceived - expensesTotal;


//   const fetchSales = useCallback(async () => {
//   const { data, error } = await supabase
//     .from('invoices')
//     .select('*')
//     .eq('type', 'sale')
//     .eq('date', selectedDate);

//   if (!error && data) {
//     setInvoices(data);
//   } else {
//     setInvoices([]);
//   }
// }, [selectedDate]);

// useEffect(() => {
//   fetchSales();
// }, [fetchSales]);

//  const handleExpenseChange = (index: number, field: 'category' | 'amount', value: string) => {
//   const updated = [...expenses];
//   updated[index] = {
//     ...updated[index],
//     [field]: field === 'amount' ? parseFloat(value) || 0 : value
//   };
//   setExpenses(updated);
// };

//   const addExpense = () => {
//     setExpenses([...expenses, { category: '', amount: 0 }]);
//   };

//   const removeExpense = (index: number) => {
//     setExpenses(expenses.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold text-center text-blue-600">📊 Daily Expenses & Payments</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <label>
//           Date:
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="border rounded px-3 py-2 w-full"
//           />
//         </label>
//         <label>
//           Opening Balance:
//           <input
//             type="number"
//             value={openingBalance}
//             onChange={(e) => setOpeningBalance(parseFloat(e.target.value))}
//             className="border rounded px-3 py-2 w-full"
//           />
//         </label>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-lg">
//         <div className="bg-blue-100 p-4 rounded">Total Sales: ₹{totalSales.toFixed(2)}</div>
//         <div className="bg-green-100 p-4 rounded">Payments Received: ₹{paymentsReceived.toFixed(2)}</div>
//         {/* <div className="bg-yellow-100 p-4 rounded">Payments Made: ₹{paymentsMade.toFixed(2)}</div> */}
//         <div className="bg-pink-100 p-4 rounded">Expenses Total: ₹{expensesTotal.toFixed(2)}</div>
//         <div className="bg-purple-100 p-4 rounded font-bold">Closing Balance: ₹{closingBalance.toFixed(2)}</div>
//       </div>

//       <h3 className="text-lg font-semibold">Expenses</h3>
//       {expenses.map((expense, index) => (
//         <div key={index} className="flex gap-2 mb-2">
//           <input
//             type="text"
//             placeholder="Category"
//             value={expense.category}
//             onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
//             className="border px-3 py-2 rounded w-full"
//           />
//           <input
//             type="number"
//             placeholder="Amount"
//             value={expense.amount}
//             onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
//             className="border px-3 py-2 rounded w-40"
//           />
//           {index > 0 && (
//             <button
//               onClick={() => removeExpense(index)}
//               className="text-red-600 hover:underline"
//             >
//               Remove
//             </button>
//           )}
//         </div>
//       ))}

//       <button onClick={addExpense} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//         + Add Expense
//       </button>

//       {/* <div className="mt-6">
//         <label>
//           Payments Made (e.g. supplier, rent):
//           <input
//             type="number"
//             value={paymentsMade}
//             onChange={(e) => setPaymentsMade(parseFloat(e.target.value))}
//             className="border rounded px-3 py-2 w-full"
//           />
//         </label>
//       </div> */}
//     </div>
//   );
// }
// pages/payments.tsx
// pages/payments.tsx
// pages/payments.tsx
// pages/payments.tsx
// pages/payments.tsx
// pages/payments.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf'

interface Invoice {
  id: string
  customer: string
  billNo: string
  date: string
  grandTotal: number
  totalPaid: number
  type: string
}


type PaymentEntry = {
  billId: string
  amount: number
  paymentDate: string
  paymentType: string
  reference: string
}



export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [vendors, setVendors] = useState<string[]>([])
  // const [payments, setPayments] = useState<{ billId: string, amount: number }[]>([])
  // const [advancePayments, setAdvancePayments] = useState<AdvancePayment[]>([])
  // const [paymentHistory, setPaymentHistory] = useState<AdvancePayment[]>([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [payments, setPayments] = useState<PaymentEntry[]>([])

  const updatePayment = (billId: string, field: keyof PaymentEntry, value: string) => {
  setPayments(prev => {
    const existing = prev.find(p => p.billId === billId)
    if (existing) {
      return prev.map(p =>
        p.billId === billId ? { ...p, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : p
      )
    } else {
      return [...prev, {
        billId,
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentType: '',
        reference: '',
        [field]: field === 'amount' ? parseFloat(value) || 0 : value
      }]
    }
  })
}


  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('type', 'purchase')

      if (error) return console.error('Error:', error)

      setInvoices(data)
      const uniqueVendors = [...new Set(data.map(inv => inv.customer))]
      setVendors(uniqueVendors)
    }

    fetchInvoices()
  }, [])

  // useEffect(() => {
  //   if (!selectedVendor) return
  //   const fetchHistory = async () => {
  //     const { data, error } = await supabase
  //       .from('advance_payments')
  //       .select('*')
  //       .eq('vendor', selectedVendor)

  //     if (error) return console.error('History error:', error)
  //     setPaymentHistory(data || [])
  //   }

  //   fetchHistory()
  // }, [selectedVendor])

  const filteredInvoices = invoices.filter(inv => {
    const matchVendor = inv.customer === selectedVendor
    const matchDate = (!fromDate || inv.date >= fromDate) && (!toDate || inv.date <= toDate)
    return matchVendor && matchDate
  })

  // const handlePaymentInput = (billId: string, value: string) => {
  //   const amount = parseFloat(value)
  //   setPayments(prev =>
  //     prev.some(p => p.billId === billId)
  //       ? prev.map(p => p.billId === billId ? { ...p, amount } : p)
  //       : [...prev, { billId, amount }]
  //   )
  // }

  // const handleAdvancePaymentChange = (value: string) => {
  //   const amount = parseFloat(value)
  //   const date = new Date().toISOString().split('T')[0]

  //   setAdvancePayments(prev => {
  //     const existing = prev.find(p => p.vendor === selectedVendor)
  //     if (existing) {
  //       return prev.map(p => p.vendor === selectedVendor ? { ...p, amount, date } : p)
  //     }
  //     return [...prev, { vendor: selectedVendor, amount, date }]
  //   })
  // }

  // const handleSavePayments = async () => {
  //   for (const p of payments) {
  //     const invoice = invoices.find(i => i.id === p.billId)
  //     if (!invoice) continue

  //     const updatedTotalPaid = (invoice.totalPaid || 0) + p.amount

  //     await supabase
  //       .from('invoices')
  //       .update({ totalPaid: updatedTotalPaid })
  //       .eq('id', p.billId)
  //   }

  //   for (const adv of advancePayments) {
  //     await supabase.from('advance_payments').insert(adv)
  //   }

  //   alert('Payments recorded!')
  // }

  const handleSavePayments = async () => {
  for (const p of payments) {
    const invoice = invoices.find(i => i.id === p.billId)
    if (!invoice || p.amount <= 0) continue

    const updatedTotalPaid = (invoice.totalPaid || 0) + p.amount

    // Update invoice totalPaid
    await supabase
      .from('invoices')
      .update({ totalPaid: updatedTotalPaid })
      .eq('id', p.billId)

    // Insert into payment history
    await supabase.from('advance_payments').insert({
      bill_id: p.billId,
      amount: p.amount,
      payment_date: p.paymentDate,
      payment_type: p.paymentType,
      reference: p.reference,
      vendor: selectedVendor
    })
  }

  alert('Payments recorded successfully!')
}



  const getUnpaidVendors = () => {
    const unpaid: Record<string, number> = {}
    invoices.forEach(inv => {
      const pending = inv.grandTotal - (inv.totalPaid || 0)
      if (pending > 0) {
        unpaid[inv.customer] = (unpaid[inv.customer] || 0) + pending
      }
    })
    return Object.entries(unpaid)
  }

  const generatePDF = () => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text('Shop Name: My Business Store', 15, 15);
  doc.setFontSize(12);
  doc.text('Address: 123 Market Street, City, State - ZIP', 15, 22);
  doc.text('Phone: +91-9876543210', 15, 29);

  doc.setFontSize(14);
  doc.text(`Vendor Ledger: ${selectedVendor}`, 15, 38);

  // Table
  const headers = ['Bill No', 'Date', 'Total (INR)', 'Paid (INR)', 'Pending (INR)'];
  const colWidths = [30, 40, 35, 35, 40];
  const startX = 10;
  let y = 48;

  // Draw header row
  headers.forEach((header, i) => {
    doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], 8);
    doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, y + 6);
  });

  y += 8;

  // Draw invoice rows
  filteredInvoices.forEach((inv) => {
    const values = [
      String(inv.billNo),
      String(inv.date),
      `${inv.grandTotal.toFixed(2)} INR`,
      `${(inv.totalPaid || 0).toFixed(2)} INR`,
      `${(inv.grandTotal - (inv.totalPaid || 0)).toFixed(2)} INR`,
    ];

    values.forEach((val, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.rect(x, y, colWidths[i], 8);
      doc.text(val, x + 2, y + 6);
    });

    y += 8;
  });

  // Advance Payments
  y += 10;
  doc.setFontSize(13);
  doc.text('Advance Payment History', 15, y);
  doc.setFontSize(11);
  // paymentHistory.forEach((p) => {
  //   y += 6;
  //   doc.text(`${p.amount.toFixed(2)} INR on ${p.date.split('T')[0]}`, 15, y);
  // });

  doc.save(`${selectedVendor}_ledger.pdf`);
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Payments & Vendor Ledger</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedVendor}
          onChange={e => setSelectedVendor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border p-2 rounded"
        />

        <Button onClick={generatePDF} className="bg-purple-600 text-white">
          Download PDF Ledger
        </Button>
      </div>

      {/* {selectedVendor && (
        <div className="mb-6">
          <label className="font-semibold mr-2">Advance Payment:</label>
          <input
            type="number"
            placeholder="Amount"
            onChange={e => handleAdvancePaymentChange(e.target.value)}
            className="border p-2 rounded w-48"
          />
        </div>
      )} */}

      {filteredInvoices.length > 0 && (
        <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Bill No</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Pending</th>
              <th className="border p-2">New Payment</th>
              <th className="border p-2">Purchase Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Reference</th>


            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id}>
                <td className="border p-2">{inv.billNo}</td>
                <td className="border p-2">{inv.date}</td>
                <td className="border p-2">₹{inv.grandTotal.toFixed(2)}</td>
                <td className="border p-2">₹{inv.totalPaid?.toFixed(2) || 0}</td>
                <td className="border p-2 text-red-600">
                  ₹{(inv.grandTotal - (inv.totalPaid || 0)).toFixed(2)}
                </td>
                {/* <td className="border p-2">
                  <input
                    type="number"
                    className="border px-2 py-1 w-24 rounded"
                    onChange={e => handlePaymentInput(inv.id, e.target.value)}
                  />
                </td> */}
                <td className="border p-2">
                  <input
                    type="number"
                    className="border px-2 py-1 w-24 rounded"
                    onChange={(e) => updatePayment(inv.id, 'amount', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="date"
                    className="border px-2 py-1 w-36 rounded"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updatePayment(inv.id, 'paymentDate', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <select
                    className="border px-2 py-1 w-32 rounded"
                    onChange={(e) => updatePayment(inv.id, 'paymentType', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="cash">Cash</option>
                    <option value="gpay">GPay</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="border px-2 py-1 w-32 rounded"
                    placeholder="Reference"
                    onChange={(e) => updatePayment(inv.id, 'reference', e.target.value)}
                  />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button onClick={handleSavePayments} className="bg-green-600 text-white">
        Save Payments
      </Button>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-red-700 mb-2">Unpaid Vendor Summary</h3>
        <ul className="list-disc pl-6">
          {getUnpaidVendors().map(([vendor, pending]) => (
            <li key={vendor} className="mb-1">
              {vendor}: <span className="font-bold text-red-600">₹{pending.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* {paymentHistory.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Advance Payment History</h3>
          <ul className="list-disc pl-6">
            {paymentHistory.map((p, i) => (
              <li key={i}>
                ₹{p.amount.toFixed(2)} on {p.date}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  )
}
