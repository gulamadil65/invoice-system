'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';


type Invoice = {
  id: string;
  billNo: number;
  customer: string;
  grandTotal: number;
  date: string;
};

type Payment = {
  id: string;
  vendor: string;
  paymentAmount: string;
  paymentDate: string;
  paymentType: string;
  reference: string;
  purchaseDate: string;
};

type VendorSummary = {
  vendor: string;
  totalPurchase: number;
  totalPayment: number;
  balance: number;
};

type VendorHistory = {
  billNo: number;
  purchaseDate: string;
  billAmount: number;
  paidAmount: number;
  balance: number;
  paymentDates: string;
  paymentType: string;
  reference: string;
};


export default function PaymentsPage() {
  const [vendors, setVendors] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentInputs, setPaymentInputs] = useState<Payment[]>([]);
  const [vendorSummary, setVendorSummary] = useState<VendorSummary[]>([]);
  const [vendorHistory, setVendorHistory] = useState<VendorHistory[]>([]);
  const [showDetails, setShowDetails] = useState(false);


  const [isConnected, setIsConnected] = useState<boolean | null>(null);


useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase.from("payments").select("*").limit(1);

      if (error) {
        console.error("❌ Supabase not connected:", error.message);
        setIsConnected(false);
      } else {
        console.log("✅ Supabase connected.");
        setIsConnected(true);
      }
    };

    testConnection();
  }, []);

    

  useEffect(() => {
    fetchVendors();
    fetchVendorSummaries();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      fetchVendorHistory(selectedVendor);
      fetchInvoicesForVendor(selectedVendor);
    } else {
      setInvoices([]);
      setPaymentInputs([]);
    }
  }, [selectedVendor]);

  const fetchVendorHistory = async (vendor: string) => {
  const { data: bills } = await supabase
    .from('invoices')
    .select('billNo, date, grandTotal')
    .eq('type', 'purchase')
    .eq('customer', vendor);

  const { data: payments } = await supabase
    .from('payments')
    .select('purchaseDate, paymentAmount, paymentDate, paymentType, reference')
    .eq('vendor', vendor);

  const history: VendorHistory[] = [];

  (bills || []).forEach((bill) => {
    const matchedPayments = (payments || []).filter((p) => p.purchaseDate === bill.date);
    const totalPaid = matchedPayments.reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0);
    const balance = bill.grandTotal - totalPaid;

    if (matchedPayments.length === 0) {
      history.push({
        billNo: bill.billNo,
        purchaseDate: bill.date,
        billAmount: bill.grandTotal,
        paidAmount: 0,
        balance,
        paymentDates: '',
        paymentType: '',
        reference: '',
      });
    } else {
      matchedPayments.forEach((p) => {
        history.push({
          billNo: bill.billNo,
          purchaseDate: bill.date,
          billAmount: bill.grandTotal,
          paidAmount: parseFloat(p.paymentAmount),
          balance: bill.grandTotal - totalPaid,
          paymentDates: p.paymentDate,
          paymentType: p.paymentType,
          reference: p.reference,
        });
      });
    }
  });

  setVendorHistory(history);
};



  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('customer')
      .eq('type', 'purchase');

    if (!error && data) {
      const uniqueVendors = Array.from(new Set(data.map((d) => d.customer)));
      setVendors(uniqueVendors);
    }
  };

  const fetchInvoicesForVendor = async (vendor: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('type', 'purchase')
      .eq('customer', vendor);

    if (!error && data) {
      setInvoices(data);
      setPaymentInputs(
        data.map((inv) => ({
          id: uuidv4(),
          billNo: inv.billNo,
          vendor,
          purchaseDate: inv.date,
          paymentAmount: '',
          paymentDate: '',
          paymentType: '',
          reference: '',
        }))
      );
    }
  };

  const handleInputChange = (index: number, field: keyof Payment, value: string) => {
    const updated = [...paymentInputs];
    updated[index][field] = value;
    setPaymentInputs(updated);
  };

  // const savePayments = async () => {
  //   const filtered = paymentInputs.filter((p) => p.paymentAmount && p.paymentDate);
  //   const { error } = await supabase.from('payments').insert(filtered);
  //   if (error) {
  //     alert('Error saving payments');
  //   } else {
  //     alert('Payments saved!');
  //     setSelectedVendor('');
  //     fetchVendorSummaries();
  //   }
  // };


const savePayments = async () => {
  const validData = paymentInputs
    .filter((p) => p.paymentAmount && p.paymentDate)
    .map((p) => ({
      id: p.id,
      vendor: p.vendor.trim(),
      purchaseDate: p.purchaseDate,
      paymentAmount: parseFloat(p.paymentAmount),
      paymentDate: p.paymentDate,
      paymentType: p.paymentType.trim() || null,
      reference: p.reference.trim() || null,
    }));

  console.log("Sending payments to Supabase:", validData);

  const { error } = await supabase.from('payments').insert(validData);
  if (error) {
    console.error("Supabase insert error:", error);
    alert("Failed to save payments.");
  } else {
    alert("Payments saved!");
    setSelectedVendor('');
    fetchVendorSummaries();
  }
};


  const fetchVendorSummaries = async () => {
    const { data: invoicesData } = await supabase
      .from('invoices')
      .select('customer, grandTotal')
      .eq('type', 'purchase');

    const { data: paymentsData } = await supabase
      .from('payments')
      .select('vendor, paymentAmount');

    if (!invoicesData || !paymentsData) return;

    const vendorMap: Record<string, VendorSummary> = {};

    invoicesData.forEach((inv) => {
      if (!vendorMap[inv.customer]) {
        vendorMap[inv.customer] = {
          vendor: inv.customer,
          totalPurchase: 0,
          totalPayment: 0,
          balance: 0,
        };
      }
      vendorMap[inv.customer].totalPurchase += inv.grandTotal;
    });

    paymentsData.forEach((pay) => {
      if (!vendorMap[pay.vendor]) {
        vendorMap[pay.vendor] = {
          vendor: pay.vendor,
          totalPurchase: 0,
          totalPayment: 0,
          balance: 0,
        };
      }
      vendorMap[pay.vendor].totalPayment += parseFloat(pay.paymentAmount);
    });

    const summaryList = Object.values(vendorMap).map((v) => ({
      ...v,
      balance: v.totalPurchase - v.totalPayment,
    }));

    setVendorSummary(summaryList);
  };



const downloadPDF = () => {
  if (vendorHistory.length === 0 || !selectedVendor) {
    alert("No data to download.");
    return;
  }

  const doc = new jsPDF();
  const marginLeft = 10;
  const rowHeight = 8;
  const colWidths = [20, 30, 25, 20, 20, 30, 20, 30]; 
  let yPos = 20;

  // Title
  doc.setFontSize(16);
  doc.text(`${selectedVendor} - Vendor Ledger`, marginLeft, yPos);
  yPos += 10;

  // Headers
  const headers = [
    'Bill No',
    'Purchase Date',
    'Bill Amount',
    'Paid',
    'Balance',
    'Payment Date',
    'Type',
    'Reference',
  ];

  // Draw header background
  // Header - plain white, black text
    doc.setFontSize(12);

doc.setTextColor(0, 0, 0); // black text
let xPos = marginLeft;

headers.forEach((header, i) => {
  // Draw plain border cell
  doc.rect(xPos, yPos, colWidths[i], rowHeight); // no fill
  doc.text(header, xPos + 1, yPos + 5);
  xPos += colWidths[i];
});
yPos += rowHeight;


  // Rows
 vendorHistory.forEach((entry) => {
  xPos = marginLeft;
  const rowData = [
    String(entry.billNo || ''),
    entry.purchaseDate || '',
    `${entry.billAmount.toFixed(2)}`,
    `${entry.paidAmount.toFixed(2)}`,
    `${entry.balance.toFixed(2)}`,
    entry.paymentDates || '',
    entry.paymentType || '',
    entry.reference || '',
  ];

  rowData.forEach((cell, i) => {
    doc.rect(xPos, yPos, colWidths[i], rowHeight); // border only
    doc.text(cell, xPos + 1, yPos + 5);
    xPos += colWidths[i];
  });


    // Add new page if reaching bottom
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Save PDF
  doc.save(`${selectedVendor}-ledger.pdf`);
};


  return (
     <div className="max-w-screen-xl mx-auto p-6 bg-gradient-to-br from-white via-blue-50 to-white rounded-xl shadow-lg text-gray-900">

       <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          isConnected === null
            ? "bg-gray-400 animate-pulse"
            : isConnected
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />
      <span className="text-sm">
        {isConnected === null
          ? "Checking connection..."
          : isConnected
          ? " "
          : "Check Your Network"}
      </span>
    </div>
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8 drop-shadow">Payment</h1>

      {/* Vendor Selection */}
      <select
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="">Select Vendor</option>
        {vendors.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      {/* Payment Entry Table */}
      {invoices.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">{selectedVendor} Payments</h2>
          <table className="min-w-full mb-4 border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Bill No</th>
                <th className="border p-2">Purchase Date</th>
                <th className="border p-2">Bill Amount</th>
                <th className="border p-2">Payment Amount</th>
                <th className="border p-2">Payment Date</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Reference</th>
              </tr>
            </thead>
            <tbody>
              {paymentInputs.map((p, i) => (
                <tr key={p.id}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{invoices[i]?.billNo}</td>
                  <td className="border p-2">{p.purchaseDate}</td>
                  <td className="border p-2">{invoices[i]?.grandTotal.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      value={p.paymentAmount}
                      onChange={(e) => handleInputChange(i, 'paymentAmount', e.target.value)}
                      className="w-full border p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="date"
                      value={p.paymentDate}
                      onChange={(e) => handleInputChange(i, 'paymentDate', e.target.value)}
                      className="w-full border p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      value={p.paymentType}
                      onChange={(e) => handleInputChange(i, 'paymentType', e.target.value)}
                      className="w-full border p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      value={p.reference}
                      onChange={(e) => handleInputChange(i, 'reference', e.target.value)}
                      className="w-full border p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={savePayments}
            className="bg-green-600 text-white px-4 py-2 rounded mb-6"
          >
            Save Payments
          </button>
        </>
      )}

      {vendorHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">{selectedVendor} Payment History</h2>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Bill No</th>
                <th className="border p-2">Purchase Date</th>
                <th className="border p-2">Bill Amount</th>
                <th className="border p-2">Payment Date</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Balance</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Reference</th>
              </tr>
            </thead>
            <tbody>
              {vendorHistory.map((entry, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{entry.billNo}</td>
                  <td className="border p-2">{entry.purchaseDate}</td>
                  <td className="border p-2">₹{entry.billAmount.toFixed(2)}</td>
                  <td className="border p-2">{entry.paymentDates}</td>
                  <td className="border p-2 text-green-700">₹{entry.paidAmount.toFixed(2)}</td>
                  <td className="border p-2 text-red-600">₹{entry.balance.toFixed(2)}</td>
                  <td className="border p-2">{entry.paymentType}</td>
                  <td className="border p-2">{entry.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-6 mb-4"
      >
        {showDetails ? 'Hide Details' : 'More Details'}
      </button>

      {vendorHistory.length > 0 && (
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Download PDF
        </button>
      )}



      {/* Vendor Summary */}
      {vendorHistory.length > 0 && showDetails && (
  <div className="mt-4">
    
    {/* table here */}
    <h2 className="text-lg font-semibold mt-6 mb-2">Vendor Summary</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Total Purchase</th>
            <th className="border p-2">Total Payment</th>
            <th className="border p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {vendorSummary.map((v) => (
            <tr key={v.vendor}>
              <td className="border p-2">{v.vendor}</td>
              <td className="border p-2">₹{v.totalPurchase.toFixed(2)}</td>
              <td className="border p-2">₹{v.totalPayment.toFixed(2)}</td>
              <td className="border p-2 font-semibold">
                ₹{v.balance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
)}

      
    </div>
  );
}

