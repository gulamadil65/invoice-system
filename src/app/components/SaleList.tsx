// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {   getInvoices, Invoice, PDFData } from '../utils/storage'
// import { ConfirmationDialog } from './confirmation-dialog'
// import { downloadPDF } from '../utils/pdfGenerator'
// // import { sharePDF } from '../utils/pdfGenerator'; // Update import
// import { Loader } from './loader'
// import {  FaTrash, FaDownload } from 'react-icons/fa';
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { supabase } from '../utils/supabaseClient' // make sure the path is correct
// import { deleteInvoiceOnline } from '../utils/onlineStorage';
// // import { toast } from 'react-toastify'
// import {  } from '../utils/onlineStorage'
// import * as XLSX from 'xlsx'
// import { Filesystem, Directory} from '@capacitor/filesystem';






// export default function SalesList() {
//   const router = useRouter()
//   const [sales, setSales] = useState<Invoice[]>([])
//   const [filteredSales, setFilteredSales] = useState<Invoice[]>([])
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')

// const [selectedDate, setSelectedDate] = useState(() => {
//   const today = new Date();
//   return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
// });


//   // useEffect(() => {
//   //   const fetchSales = async () => {
//   //     const allInvoices = getInvoices()
//   //     const salesInvoices = (await allInvoices).filter(invoice => invoice.type === 'sale')
//   //     setSales(salesInvoices)
//   //     setFilteredSales(salesInvoices)
//   //     setIsLoading(false)
//   //   }

//   //   fetchSales()
//   // }, [])

   

//   useEffect(() => {
//     const fetchSales = async () => {
//       setIsLoading(true)
//       try {
//         const { data, error } = await supabase
//           .from('invoices')
//           .select('*')
//           .eq('type', 'sale')
//           .order('billNo', { ascending: false })
//         if (error) {
//           throw error
//         }
  
//         setSales(data || [])
//         setFilteredSales(data || [])
//       } catch (err) {
//         console.error('Failed to fetch sales from Supabase:', err)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     if (!navigator.onLine) {
//       const localInvoices = getInvoices()
//       const salesInvoices = localInvoices.filter(invoice => invoice.type === 'sale')

//       setSales(salesInvoices)
//       setFilteredSales(salesInvoices)
//       return
//     }
    
  
//     fetchSales()
//   }, [])

//   // 1. On mount: Fetch all 'sale' invoices and set both sales & filteredSales
// useEffect(() => {
//   const fetchSales = async () => {
//     setIsLoading(true)
//     try {
//       const { data, error } = await supabase
//         .from('invoices')
//         .select('*')
//         .eq('type', 'sale')
//         .order('billNo', { ascending: false })

//       if (error) throw error

//       setSales(data || [])
//       setFilteredSales(data || [])
//     } catch (err) {
//       console.error('Failed to fetch sales from Supabase:', err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!navigator.onLine) {
//     const localInvoices = getInvoices()
//     const salesInvoices = localInvoices.filter(invoice => invoice.type === 'sale')
//     setSales(salesInvoices)
//     setFilteredSales(salesInvoices)
//     return
//   }

//   fetchSales()
// }, [])

// // 2. On search term change: filter locally
// useEffect(() => {
//   const delay = setTimeout(() => {
//     const filtered = sales.filter((sale) => {
//       const matchesSearch =
//         sale.billNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sale.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sale.phone1?.includes(searchTerm) ||
//         sale.phone2?.includes(searchTerm) ||
//         sale.transport?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDate = selectedDate
//         ? sale.date === selectedDate
//         : true;

//       return matchesSearch && matchesDate;
//     });

//     setFilteredSales(filtered);
//   }, 300);

//   return () => clearTimeout(delay);
// }, [searchTerm, selectedDate, sales]);


// // useEffect(() => {
// //   const delay = setTimeout(() => {

// //    const filtered = sales.filter(sale =>
// //   sale.billNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
// //   sale.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //   sale.phone1?.includes(searchTerm) ||
// //   sale.phone2?.includes(searchTerm)
// // )

// //     setFilteredSales(filtered)
// //   }, 300)

// //   return () => clearTimeout(delay)
// // }, [searchTerm, sales])

  
  

// // useEffect(() => {
// //   const fetchSales = async () => {
// //     const allInvoices = getInvoices()
// //     const salesInvoices = (await allInvoices)
// //       .filter(invoice => invoice.type === 'sale')
// //       .sort((a, b) => {
// //         const billA = isNaN(Number(a.billNo)) ? a.billNo : Number(a.billNo)
// //         const billB = isNaN(Number(b.billNo)) ? b.billNo : Number(b.billNo)
// //         return billB > billA ? 1 : -1
// //       })

// //     setSales(salesInvoices)
// //     setFilteredSales(salesInvoices)
// //     setIsLoading(false)
// //   }

// //   fetchSales()
// // }, [])

//   // useEffect(() => {
//   //   const filtered = sales.filter(sale => 
//   //     sale.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     (sale.phone1 && sale.phone1.includes(searchTerm)) ||
//   //     (sale.phone2 && sale.phone2.includes(searchTerm))
//   //   )
//   //   setFilteredSales(filtered)
//   // }, [searchTerm, sales])

//   const handleEdit = (id: string) => {
//     router.push(`/?id=${id}&type=sale`)
//   }

//   // const handleDelete = (id: string) => {
//   //   setDeleteId(id)
//   //   setSales(prevSales => prevSales.filter(sale => sale.id !== id))
//   // }


// // const confirmDelete = async () => {
// //   if (deleteId) {
// //     try {
// //       await deleteInvoiceOnline(deleteId)
// //       const updatedSales = sales.filter(sale => sale.id !== deleteId)
// //       setSales(updatedSales)
// //       setFilteredSales(updatedSales)
// //       toast.success('Invoice deleted.')
// //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
// //     } catch (err) {
// //       toast.error('Failed to delete invoice.')
// //     } finally {
// //       setDeleteId(null)
// //     }
// //   }
// // }

//   // const cancelDelete = () => {
//   //   setDeleteId(null)
//   // }

//   const getBusinessProfile = async (): Promise<PDFData> => {
//     const data = localStorage.getItem('businessProfile');
//     if (!data) throw new Error("Business profile is missing!");
//     return JSON.parse(data) as PDFData;
//   };
    

//   // const handleDownloadPDF = async (sale: Invoice) => {
//   //   try {
//   //     const message = await downloadPDF(sale);
//   //     alert(message);
//   //   } catch (error) {
//   //     console.error('Error downloading:', error);
//   //     alert('Error downloading the invoice. Please try again.');
//   //   }
//   // }
    

//   if (isLoading) {
//     return <Loader />
//   }

//   // const handleSharePDF = async (sale: Invoice) => {
//   //   try {
//   //     const message = await sharePDF(sale);
//   //     alert(message);
//   //   } catch (error) {
//   //     console.error('Error sharing PDF:', error);
//   //     alert('Error sharing the invoice. Please try again.');
//   //   }
//   // };





// // const downloadExcel = () => {
// //   const worksheetData = filteredSales.map((sale: Invoice, index: number) => {
// //     const itemsFormatted = sale.items.map((item, idx) => {
// //       return `${idx + 1}. ${item.particulars} (HSN: ${item.hsn}, Qty: ${item.qty}, Price: ${item.price}, Amount: ₹${item.amount.toFixed(2)})`;
// //     }).join('\n');

// //     return {
// //       Index: index + 1,
// //       BillNo: sale.billNo,
// //       Date: sale.date,
// //       Customer: sale.customer,
// //       Phone1: sale.phone1,
// //       Phone2: sale.phone2,
// //       Address: sale.address,
// //       GSTNo: sale.gstNo,
// //       Transport: sale.transport,
// //       GrandTotal: sale.grandTotal.toFixed(2),
// //       Items: itemsFormatted,
// //     };
// //   });

// //   const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// //   const workbook = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');

// //   XLSX.writeFile(workbook, 'sales_list.xlsx');
// // };



// const downloadExcel = async () => {
//   try {
//     const worksheetData = filteredSales.map((sale: Invoice, index: number) => {
//       const itemsFormatted = sale.items.map((item, idx) => {
//         return `${idx + 1}. ${item.particulars} (HSN: ${item.hsn}, Qty: ${item.qty}, Price: ${item.price}, Amount: ₹${item.amount.toFixed(2)})`;
//       }).join('\n');

//       return {
//         Index: index + 1,
//         BillNo: sale.billNo,
//         Date: sale.date,
//         Customer: sale.customer,
//         Phone1: sale.phone1,
//         Phone2: sale.phone2,
//         Address: sale.address,
//         GSTNo: sale.gstNo,
//         Transport: sale.transport,
//         GrandTotal: sale.grandTotal.toFixed(2),
//         Items: itemsFormatted,
//       };
//     });

//     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');

//     const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

//     await Filesystem.writeFile({
//       path: 'sales_list.xlsx',
//       data: base64,
//       directory: Directory.Documents,
//     });

//     alert('Excel file saved to Documents folder');
//   } catch (error) {
//     console.error('Error saving Excel:', error);
//     alert('Failed to save Excel file.');
//   }
// };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Sales List</h1>
//       <Button 
//   onClick={downloadExcel} 
//   className="mb-4 bg-green-600 text-white hover:bg-green-700"
// >
//   Download Excel
// </Button>

//     {/* <button
//   onClick={async () => {
//     try {
//       const count = await syncOfflineInvoices()
//       toast.success(`${count} offline invoices synced to Supabase.`)
//     } catch (err) {
//       console.error('Sync error:', err)
//       toast.error('Failed to sync invoices.')
//     }
//   }}
//   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// >
//   Sync Offline Invoices
// </button> */}
//       <div className="flex justify-end space-x-2">
//                   <Link href="?view=invoice&type=sale">
//                     <Button variant="destructive" className="w-full">New Sales Invoice</Button>
//                   </Link>
//                 </div>
//       <div className="mb-4">

//    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
//   {/* Search Input (3/4 width) */}
//   <div className="md:col-span-3">
//     <input
//       type="text"
//       placeholder="Search by Name, Transport, Bill No, Phone1, Phone2"
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>

//   {/* Date Input (1/4 width) */}
//   <div className="flex items-center gap-2">
//     <input
//       type="date"
//       value={selectedDate}
//       onChange={(e) => setSelectedDate(e.target.value)}
//       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//     {/* Clear Date Button */}
//     <button
//       onClick={() => setSelectedDate('')}
//       className="text-sm text-blue-600 hover:underline"
//     >
//       Clear Date
//     </button>
//   </div>
// </div>

// {/* Clear All Button */}
// <div className="mb-4">
//   <button
//     onClick={() => {
//       setSearchTerm('');
//       setSelectedDate('');
//     }}
//     className="text-sm text-red-600 hover:underline"
//   >
//     Clear All Filters
//   </button>
// </div>


//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="border border-gray-300 p-2">Bill No</th>
//               <th className="border border-gray-300 p-2">Date</th>
//               <th className="border border-gray-300 p-2">Customer</th>
//               <th className="border border-gray-300 p-2">Phone 1</th>
//               <th className="border border-gray-300 p-2">Phone 2</th>
//               <th className="border border-gray-300 p-2">Address</th>
//               <th className="border border-gray-300 p-2">GST No</th>
//               <th className="border border-gray-300 p-2">Transport</th>
//               <th className="border border-gray-300 p-2">Grand Total</th>
//               <th className="border border-gray-300 p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//           {filteredSales.map((sale) => (
//               <tr key={sale.id}
//               className="cursor-pointer hover:bg-gray-100 transition"
//               onClick={() => handleEdit(sale.id)}>
//                 <td className="border border-gray-300 p-2">{sale.billNo}</td>
//                 <td className="border border-gray-300 p-2">{sale.date}</td>
//                 <td className="border border-gray-300 p-2">{sale.customer}</td>
//                 <td className="border border-gray-300 p-2">{sale.phone1 ?? ''}</td>
//                 <td className="border border-gray-300 p-2">{sale.phone2 ?? ''}</td>
//                 <td className="border border-gray-300 p-2">{sale.address}</td>
//                 <td className="border border-gray-300 p-2">{sale.gstNo}</td>
//                 <td className="border border-gray-300 p-2">{sale.transport}</td>
//                 <td className="border border-gray-300 p-2">{sale.grandTotal.toFixed(2)}</td>
//                 <td className="border border-gray-300 p-2 flex space-x-2">
//                   {/* this is edit button */}
//                   {/* <button 
//                   onClick={() => handleEdit(sale.id)}
//                   className="flex items-center space-x-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
//                     <FaEdit className="w-4 h-4" />
//                   </button>
//                  */}
//                   {/* this is delete button */}
//                   {/* <button 
//                   onClick={() => handleDelete(sale.id)}
//                   className="flex items-center space-x-2 p-2 bg-red-700 text-white rounded hover:bg-red-800">
//                     <FaTrash className="w-4 h-4" />
//                   </button> */}

//                   <Button
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent row click
//                     setDeleteId(sale.id!);
//                   }}
//                   variant="destructive"
//                   size="icon"
//                   className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded hover:bg-indigo-600"
//                 >
//                 <FaTrash className="w-4 h-4"/>
//                 </Button>

                 
//                   {/* this is download button */}
//                   {/* <button
//                      onClick={() => downloadPDF(sale)}
//                   className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-purple-600">
//                   <FaDownload className="w-4 h-4" />
//                 </button> */}

//                <button
//                   onClick={async (e) => {
//                     e.stopPropagation();
//                     const businessProfile = await getBusinessProfile(); // make sure this exists
//                     try {
//                       const message = await downloadPDF(sale, businessProfile);
//                       alert(message);
//                     } catch (err) {
//                       console.error("Error downloading:", err);
//                       alert("Failed to download invoice.");
//                     }
//                   }}
//                   className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-purple-600"
//                 >
//                   <FaDownload className="w-4 h-4" />
//                 </button>



//                 {/* <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent row click
//                     handleSharePDF(sale);
//                   }}
//                   className="flex items-center space-x-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
//                 >
//                 <FaShareAlt className="w-4 h-4"/>
//                 </button> */}

//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <ConfirmationDialog
//   isOpen={deleteId !== null}
//   onClose={() => setDeleteId(null)}
//   onConfirm={async () => {
//     if (deleteId) {
//       // await supabase.from('invoice').delete().eq('id', deleteId);
//       await deleteInvoiceOnline(deleteId)
//       setSales(prev => prev.filter(sale => sale.id !== deleteId));
//       setDeleteId(null);
//     }
//   }}
//   title="Confirm Deletion"
//   description="Are you sure you want to delete this item? This action cannot be undone."
// />
//     </div>
//   )
// }


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getInvoices, Invoice, PDFData } from '../utils/storage';
import { ConfirmationDialog } from './confirmation-dialog';
import { downloadPDF } from '../utils/pdfGenerator';
import { Loader } from './loader';
import { FaTrash, FaDownload } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '../utils/supabaseClient';
import { deleteInvoiceOnline } from '../utils/onlineStorage';
import * as XLSX from 'xlsx';
import { Filesystem, Directory } from '@capacitor/filesystem';

export default function SalesList() {
  const router = useRouter();
  const [sales, setSales] = useState<Invoice[]>([]);
  const [filteredSales, setFilteredSales] = useState<Invoice[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [isConnected, setIsConnected] = useState<boolean | null>(null);


useEffect(() => {
    const testConnection = async () => {
        const { error } = await supabase.from('invoices').select('*').eq('type', 'sale');

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
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('invoices').select('*').eq('type', 'sale').order('billNo', { ascending: false });
        if (error) throw error;
        setSales(data || []);
        setFilteredSales(data || []);
      } catch (err) {
        console.error('Failed to fetch sales:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!navigator.onLine) {
      const localInvoices = getInvoices();
      const salesInvoices = localInvoices.filter(invoice => invoice.type === 'sale');
      setSales(salesInvoices);
      setFilteredSales(salesInvoices);
    } else {
      fetchSales();
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const filtered = sales.filter(sale => {
        const matchesSearch = sale.billNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.phone1?.includes(searchTerm) ||
          sale.phone2?.includes(searchTerm) ||
          sale.transport?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? sale.date === selectedDate : true;
        return matchesSearch && matchesDate;
      });
      setFilteredSales(filtered);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedDate, sales]);

  const handleEdit = (id: string) => router.push(`/?id=${id}&type=sale`);

  const getBusinessProfile = async (): Promise<PDFData> => {
    const data = localStorage.getItem('businessProfile');
    if (!data) throw new Error("Business profile missing!");
    return JSON.parse(data) as PDFData;
  };

  const downloadExcel = async () => {
    try {
      const worksheetData = filteredSales.map((sale, index) => ({
        Index: index + 1,
        BillNo: sale.billNo,
        Date: sale.date,
        Customer: sale.customer,
        Phone1: sale.phone1,
        Phone2: sale.phone2,
        Address: sale.address,
        GSTNo: sale.gstNo,
        Transport: sale.transport,
        GrandTotal: sale.grandTotal.toFixed(2),
        Items: sale.items.map((item, idx) => `${idx + 1}. ${item.particulars} (HSN: ${item.hsn}, Qty: ${item.qty}, Price: ${item.price}, Amt: ₹${item.amount.toFixed(2)})`).join('\n'),
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
      const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      await Filesystem.writeFile({ path: 'sales_list.xlsx', data: base64, directory: Directory.Documents });
      alert('Excel saved to Documents folder');
    } catch (err) {
      console.error('Excel save error:', err);
      alert('Failed to save Excel');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-gray-900 bg-white rounded-xl shadow-lg">
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
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Sales List</h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Bill, Name, Phone, Transport"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <Button onClick={downloadExcel} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Download Excel
        </Button>

        <Link href="?view=invoice&type=sale">
          <Button variant="destructive" className="px-4 py-2 rounded shadow">
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedDate('');
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['Bill', 'Date', 'Customer', 'Phone1', 'Phone2', 'Address', 'GST', 'Transport', 'Total', 'Actions'].map((head, i) => (
                <th key={i} className="px-3 py-2 text-sm font-semibold text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-100 transition cursor-pointer" onClick={() => handleEdit(sale.id)}>
                <td className="px-3 py-2">{sale.billNo}</td>
                <td className="px-3 py-2">{sale.date}</td>
                <td className="px-3 py-2">{sale.customer}</td>
                <td className="px-3 py-2">{sale.phone1}</td>
                <td className="px-3 py-2">{sale.phone2}</td>
                <td className="px-3 py-2">{sale.address}</td>
                <td className="px-3 py-2">{sale.gstNo}</td>
                <td className="px-3 py-2">{sale.transport}</td>
                <td className="px-3 py-2">₹{sale.grandTotal.toFixed(2)}</td>
                <td className="px-3 py-2 flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(sale.id!);
                    }}
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                  >
                    <FaTrash />
                  </Button>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const profile = await getBusinessProfile();
                      try {
                        const message = await downloadPDF(sale, profile);
                        alert(message);
                      } catch (err) {
                        console.error("PDF download error:", err);
                        alert("Failed to download");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full text-sm"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteInvoiceOnline(deleteId);
            setSales(prev => prev.filter(s => s.id !== deleteId));
            setDeleteId(null);
          }
        }}
        title="Delete Sale"
        description="Are you sure you want to delete this invoice?"
      />
    </div>
  );
}
