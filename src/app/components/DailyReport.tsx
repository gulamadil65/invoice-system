

"use client";

import { useCallback, useEffect, useState } from "react";
import { Invoice } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyReport() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [totals, setTotals] = useState({
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
  });

  const [openingBalance, setOpeningBalance] = useState<string>("");
  const [closingBalance, setClosingBalance] = useState<string>("");
  const [cashInHand, setCashInHand] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [expenses, setExpenses] = useState<string>("");
  const [showExpenses, setShowExpenses] = useState(false);


  const fetchData = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("type", "sale");
    if (error) console.error("Error fetching invoices:", error);
    else if (data) setInvoices(data as Invoice[]);
  };

  const fetchDailyReport = useCallback(async (date: string) => {
    const { data, error } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching daily report:", error);
    }

    if (data) {
      setOpeningBalance(data.opening_balance?.toString() || "");
      setClosingBalance(data.closing_balance?.toString() || "");
      setCashInHand(data.cash_in_hand?.toString() || "");
      setTotals({
        total: data.total_sales || 0,
        cash: data.cash || 0,
        gpayHyder: data.gpay_hyder || 0,
        pnbBox: data.pnb_box || 0,
        ppay: data.ppay || 0,
        gpaySohail: data.gpay_sohail || 0,
        gpayAdil: data.gpay_adil || 0,
        bank: data.bank || 0,
        card: data.card || 0,
        credit: data.credit || 0,
        
      });
      setExpenses(data.expenses || "");
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setClosingBalance("");
      setCashInHand("");
      fetchOpeningBalance(date);
    }
  }, []);

  const fetchOpeningBalance = async (date: string) => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = prevDay.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_reports")
      .select("closing_balance")
      .eq("date", prevDayStr)
      .single();

    if (error && error.code !== "PGRST116")
      console.error("Error fetching opening balance:", error);
    else if (data) setOpeningBalance(data.closing_balance?.toString() || "");
    else setOpeningBalance("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyReport(selectedDate);
      const filteredByDate = invoices.filter(
        (inv) => inv.date === selectedDate
      );
      setFiltered(filteredByDate);
      calculateTotals(filteredByDate);
    } else {
      setFiltered([]);
      setTotals({
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
      });
    }
  }, [selectedDate, invoices, fetchDailyReport]);

  const calculateTotals = (data: Invoice[]) => {
    let total = 0,
      cash = 0,
      gpayHyder = 0,
      pnbBox = 0,
      ppay = 0,
      gpaySohail = 0,
      gpayAdil = 0,
      bank = 0,
      card = 0,
      credit = 0;

    data.forEach((inv) => {
      total += inv.totalPaid;
      inv.payments?.forEach((p) => {
        const amt = parseFloat(p.amount || "0");
        switch (p.mode.toUpperCase()) {
          case "CASH":
            cash += amt;
            break;
          case "G PAY HYDER":
            gpayHyder += amt;
            break;
          case "PNB BOX":
            pnbBox += amt;
            break;
          case "P PAY":
            ppay += amt;
            break;
          case "G PAY SOHAIL":
            gpaySohail += amt;
            break;
          case "G PAY ADIL":
            gpayAdil += amt;
            break;
          case "BANK":
            bank += amt;
            break;
          case "CARD":
            card += amt;
            break;
          case "CREDIT":
            credit += amt;
            break;
        }
      });
    });
    setTotals({
      total,
      cash,
      gpayHyder,
      pnbBox,
      ppay,
      gpaySohail,
      gpayAdil,
      bank,
      card,
      credit,
    });
  };

  const saveDailyReport = async () => {
    const { error } = await supabase.from("daily_reports").upsert(
      {
        date: selectedDate,
        opening_balance: openingBalance ? Number(openingBalance) : 0,
        closing_balance: closingBalance ? Number(closingBalance) : 0,
        cash_in_hand: cashInHand ? Number(cashInHand) : 0,
        total_sales: totals.total,
        cash: totals.cash,
        gpay_hyder: totals.gpayHyder,
        pnb_box: totals.pnbBox,
        ppay: totals.ppay,
        gpay_sohail: totals.gpaySohail,
        gpay_adil: totals.gpayAdil,
        bank: totals.bank,
        card: totals.card,
        credit: totals.credit,
        expenses,
      },
      { onConflict: "date" }
    );

    if (error) console.error("Error saving daily report:", error);
    else
      toast.success(
        isEditMode
          ? "Daily report updated successfully!"
          : "Daily report saved successfully!"
      );
    setIsEditMode(true);
  };

  // Build a unique set of payment modes for the selected day
const paymentModes = Array.from(
  new Set(
    filtered.flatMap(inv =>
      inv.payments?.map(p => p.mode.toUpperCase()) || []
    )
  )
);


  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
         Daily Sales Report
      </h2>

      <ToastContainer
        position="top-center"
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
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {/* Input Section */}
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
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            readOnly
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Closing Balance</label>
          <input
            type="number"
            value={closingBalance}
            onChange={(e) => setClosingBalance(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Cash in Hand</label>
          <input
            type="number"
            value={cashInHand}
            onChange={(e) => setCashInHand(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* Totals Summary */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
  {Object.entries({
    "Total Sale": totals.total,
    Cash: totals.cash,
    "G PAY Hyder": totals.gpayHyder,
    "PNB Box": totals.pnbBox,
    "P PAY": totals.ppay,
    "G PAY Sohail": totals.gpaySohail,
    "G PAY Adil": totals.gpayAdil,
    Bank: totals.bank,
    Card: totals.card,
    Credit: totals.credit,
  }).map(([label, value]) =>
    value > 0 ? (
      <div key={label} className="bg-blue-100 p-4 rounded shadow-sm">
        {label}: ₹{value.toFixed(2)}
      </div>
    ) : null
  )}
</div>


      {/* Save Button */}
      <div className="mb-6">
        <button
          onClick={saveDailyReport}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {isEditMode ? "Update Daily Report" : "Save Daily Report"} 
        </button>
        {/*expense buton*/}
         <button
          onClick={() => setShowExpenses(!showExpenses)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-2"
        >
          {showExpenses ? "Close Expenses" : "Expenses"}
        </button>
      </div>
      
      {showExpenses && (
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Expenses Note</label>
          <textarea
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your expenses here..."
          />
        </div>
      )}


      {/* Table */}
   <div className="overflow-auto rounded-lg shadow-md">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-3 py-2 text-left text-sm font-medium">Bill No</th>
        <th className="px-3 py-2 text-left text-sm font-medium">Customer</th>
        <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
        {paymentModes.map((mode) => (
          <th key={mode} className="px-3 py-2 text-left text-sm font-medium">
            {mode}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {filtered.map((inv, idx) => {
        // Build a map of payments for this invoice
        const payMap: Record<string, number> = {};
        inv.payments?.forEach((p) => {
          const amt = parseFloat(p.amount || "0");
          const mode = p.mode.toUpperCase();
          payMap[mode] = (payMap[mode] || 0) + amt;
        });

        return (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-3 py-2">{inv.billNo}</td>
            <td className="px-3 py-2">{inv.customer}</td>
            <td className="px-3 py-2">₹{inv.totalPaid.toFixed(2)}</td>
            {paymentModes.map((mode) => (
              <td key={mode} className="px-3 py-2">
                ₹{(payMap[mode] || 0).toFixed(2)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
    </div>
  );
}
