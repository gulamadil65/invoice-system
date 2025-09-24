// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { getInvoices, deleteInvoice, Invoice } from '../utils/storage'
// import { ConfirmationDialog } from './confirmation-dialog'
// // import { downloadPDF } from '../utils/pdfGenerator'
// import { Loader } from './loader'
// import {  FaTrash } from 'react-icons/fa';
// import { supabase } from '../utils/supabaseClient' // make sure the path is correct
// // import { syncOfflineInvoices, deleteInvoiceOnline } from '../utils/onlineStorage';



// export default function PurchasesList() {
//   const router = useRouter()
//   const [purchases, setpurchases] = useState<Invoice[]>([])
//   const [filteredpurchases, setFilteredpurchases] = useState<Invoice[]>([])
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')

//   // useEffect(() => {
//   //   const fetchPurchases = () => {
//   //     const allInvoices = getInvoices()
//   //     const purchasesInvoices = allInvoices.filter(invoice => invoice.type === 'purchase')
//   //     setpurchases(purchasesInvoices)
//   //     setFilteredpurchases(purchasesInvoices)
//   //     // setIsLoading(false)
//   //   }

//   //   fetchPurchases()
//   // }, [])

//   // useEffect(() => {
//   //   const fetchSales = async () => {
//   //     const allInvoices = getInvoices()
//   //     const salesInvoices = (await allInvoices)
//   //       .filter(invoice => invoice.type === 'purchase')
//   //       .sort((a, b) => {
//   //         const billA = isNaN(Number(a.billNo)) ? a.billNo : Number(a.billNo)
//   //         const billB = isNaN(Number(b.billNo)) ? b.billNo : Number(b.billNo)
//   //         return billB > billA ? 1 : -1
//   //       })
  
//   //     setpurchases(salesInvoices)
//   //     setFilteredpurchases(salesInvoices)
//   //     setIsLoading(false)
//   //   }
  
//   //   fetchSales()
//   // }, [])

//   useEffect(() => {
//      const fetchSales = async () => {
//        setIsLoading(true)
//        try {
//          const { data, error } = await supabase
//            .from('invoices')
//            .select('*')
//            .eq('type', 'purchase')
//            .order('billNo', { ascending: false })
   
//          if (error) {
//            throw error
//          }
   
//          setpurchases(data || [])
//          setFilteredpurchases(data || [])
//        } catch (err) {
//          console.error('Failed to fetch sales from Supabase:', err)
//        } finally {
//          setIsLoading(false)
//        }
//      }
//      if (!navigator.onLine) {
//        const localInvoices = getInvoices()
//        const salesInvoices = localInvoices.filter(invoice => invoice.type === 'purchase')
 
//        setpurchases(salesInvoices)
//        setFilteredpurchases(salesInvoices)
//        return
//      }
     
   
//      fetchSales()
//    }, [])
   
  


//   useEffect(() => {
//     const filtered = purchases.filter(purchase => 
//       purchase.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       purchase.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (purchase.phone1 && purchase.phone1.includes(searchTerm)) ||
//       (purchase.phone2 && purchase.phone2.includes(searchTerm))
//     )
//     setFilteredpurchases(filtered)
//   }, [searchTerm, purchases])

//   const handleEdit = (id: string) => {
//     router.push(`/?id=${id}&type=purchase`)
//   }

//   // const handleDelete = (id: string) => {
//   //   setDeleteId(id)
//   // }

//   const handleDelete = (id: string) => {
//     setDeleteId(id)
//     setpurchases(prevPurchases => prevPurchases.filter(purchase => purchase.id !== id))
//   }

//   const confirmDelete = () => {
//     if (deleteId) {
//       deleteInvoice(deleteId)
//       const updatedpurchases = purchases.filter(purchase => purchase.id !== deleteId)
//       setpurchases(updatedpurchases)
//       setFilteredpurchases(updatedpurchases)
//       setDeleteId(null)
//     }
//   }

//   const cancelDelete = () => {
//     setDeleteId(null)
//   }

 

//   // const handleDownloadPDF = async (purchase: Invoice) => {
//   //   try {
//   //     const message = await downloadPDF(purchase);
//   //     alert(message);
//   //   } catch (error) {
//   //     console.error('Error downloading:', error);
//   //     alert('Error downloading the invoice. Please try again.');
//   //   }
//   // }

//   if (isLoading) {
//     return <Loader />
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Purchases List</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by Bill No, Customer, Phone 1, or Phone 2"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full"
//         />
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
//           {filteredpurchases.map((purchase) => (
//               <tr key={purchase.id}
//               className="cursor-pointer hover:bg-gray-100 transition"
//               onClick={() => handleEdit(purchase.id)}>
//                 <td className="border border-gray-300 p-2">{purchase.billNo}</td>
//                 <td className="border border-gray-300 p-2">{purchase.date}</td>
//                 <td className="border border-gray-300 p-2">{purchase.customer}</td>
//                 <td className="border border-gray-300 p-2">{purchase.phone1 ?? ''}</td>
//                 <td className="border border-gray-300 p-2">{purchase.phone2 ?? ''}</td>
//                 <td className="border border-gray-300 p-2">{purchase.address}</td>
//                 <td className="border border-gray-300 p-2">{purchase.gstNo}</td>
//                 <td className="border border-gray-300 p-2">{purchase.transport}</td>
//                 <td className="border border-gray-300 p-2">{purchase.grandTotal.toFixed(2)}</td>
//                 <td className="border border-gray-300 p-2 flex space-x-2">
//                   {/* this is edit button */}
//                   {/* <button 
//                   onClick={() => handleEdit(purchase.id)}
//                   className="flex items-center space-x-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
//                     <FaEdit className="w-4 h-4" />
//                   </button>
//                  */}
//                   {/* this is delete button */}
//                   <button 
//                   onClick={() => handleDelete(purchase.id)}
//                   className="flex items-center space-x-2 p-2 bg-red-700 text-white rounded hover:bg-red-800">
//                     <FaTrash className="w-4 h-4" />
//                   </button>

//                   {/* this is download button */}
//                   {/* <button
//                      onClick={() => handleDownloadPDF(purchase)}
//                   className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-purple-600">
//                   <FaDownload className="w-4 h-4" />
//                 </button> */}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <ConfirmationDialog
//         isOpen={deleteId !== null}
//         onClose={cancelDelete}
//         onConfirm={confirmDelete}
//         title="Confirm Deletion"
//         description="Are you sure you want to delete this purchase? This action cannot be undone."
//       />
//     </div>
//   )
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getInvoices, deleteInvoice, Invoice } from '../utils/storage';
import { ConfirmationDialog } from './confirmation-dialog';
import { Loader } from './loader';
import { FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '../utils/supabaseClient';

export default function PurchasesList() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Invoice[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Invoice[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  
  useEffect(() => {
      const testConnection = async () => {
          const { error } = await supabase.from('invoices').select('*').eq('type', 'purchase');
  
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
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('type', 'purchase')
          .order('billNo', { ascending: false });

        if (error) throw error;
        setPurchases(data || []);
        setFilteredPurchases(data || []);
      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!navigator.onLine) {
      const localInvoices = getInvoices();
      const localPurchases = localInvoices.filter(inv => inv.type === 'purchase');
      setPurchases(localPurchases);
      setFilteredPurchases(localPurchases);
    } else {
      fetchPurchases();
    }
  }, []);

  useEffect(() => {
  const delay = setTimeout(() => {
    const filtered = purchases.filter((purchase) => {
      const matchesSearch =
        purchase.billNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.phone1?.includes(searchTerm) ||
        purchase.phone2?.includes(searchTerm) ||
        purchase.transport?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = selectedDate ? purchase.date === selectedDate : true;

      return matchesSearch && matchesDate;
    });

    setFilteredPurchases(filtered);
  }, 300);

  return () => clearTimeout(delay);
}, [searchTerm, selectedDate, purchases]);

  const handleEdit = (id: string) => router.push(`/?id=${id}&type=purchase`);

  const confirmDelete = () => {
    if (deleteId) {
      deleteInvoice(deleteId);
      const updated = purchases.filter(p => p.id !== deleteId);
      setPurchases(updated);
      setFilteredPurchases(updated);
      setDeleteId(null);
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
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Purchases List</h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Bill, Name, Phone, Transport"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <Link href="?view=invoice&type=purchase">
          <Button variant="destructive" className="px-4 py-2 rounded shadow">
            New Purchase
          </Button>
        </Link>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedDate('');
          }}
          className="text-sm text-green-600 hover:underline"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['Bill', 'Date', 'Customer', 'Phone1', 'Phone2', 'Address', 'GST', 'Transport', 'Total', 'Actions'].map((head, i) => (
                <th key={i} className="px-3 py-2 text-sm font-semibold text-left">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPurchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="hover:bg-gray-100 transition cursor-pointer"
                onClick={() => handleEdit(purchase.id)}
              >
                <td className="px-3 py-2">{purchase.billNo}</td>
                <td className="px-3 py-2">{purchase.date}</td>
                <td className="px-3 py-2">{purchase.customer}</td>
                <td className="px-3 py-2">{purchase.phone1}</td>
                <td className="px-3 py-2">{purchase.phone2}</td>
                <td className="px-3 py-2">{purchase.address}</td>
                <td className="px-3 py-2">{purchase.gstNo}</td>
                <td className="px-3 py-2">{purchase.transport}</td>
                <td className="px-3 py-2">₹{purchase.grandTotal.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(purchase.id!);
                    }}
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Purchase"
        description="Are you sure you want to delete this purchase?"
      />
    </div>
  );
}
