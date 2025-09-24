// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// // import { InventoryItem } from '../utils/storage'
// import { FaTrash } from 'react-icons/fa'
// import { ConfirmationDialog } from './confirmation-dialog'
// // import { getOnlineInventory, saveInventoryOnline } from '../utils/onlineStorage'
// import { supabase } from '../utils/supabaseClient';
// // import { toast } from 'react-toastify'

// export type InventoryItem = {
//   sno?: number;
//   purchaseDate: string;
//   id?: string;
//   particulars: string;
//   purchaseQty: string;
//   purchasePrice: string;
//   salesQty: string;
//   salesPrice: string;
//   setQty: string;
//   created_at?: string;
// };

// export default function InventoryList() {
//   const [inventory, setInventory] = useState<InventoryItem[]>([])
//   // const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  
//     const [deleteId, setDeleteId] = useState<string | null>(null)
//     useEffect(() => {
//       const fetchInventory = async () => {
//         const { data, error } = await supabase
//           .from('inventory')
//           .select('*')
//           .order('created_at', { ascending: false });
//         if (error) {
//           console.error('Error fetching inventory:', error);
//           return;
//         }
//         setInventory(data as InventoryItem[]);
//       };
  
//       fetchInventory();
//     }, []);
  
//     const handleUpdate = async (index: number, field: 'salesPrice' | 'setQty', value: string) => {
//       const updated = [...inventory];
//       const item = updated[index];
//       item[field] = value;
//       setInventory(updated);
  
//       await supabase
//         .from('inventory')
//         .update({ [field]: item[field] })
//         .eq('id', item.id);
//     };
  
//     // const handleDelete = async (id: string) => {
//     //   await supabase.from('inventory').delete().eq('id', id);
//     //   setInventory(inventory.filter(item => item.id !== id));
//     // };
  

//   // useEffect(() => {
//   //   const fetchInventory = async () => {
//   //   setInventory(await getInventory())
//   //   }
//   //   fetchInventory()
//   // }, [])


  

//   // useEffect(() => {
//   //   const fetchInventory = async () => {
//   //     try {
//   //       const data = await getOnlineInventory()
//   //       setInventory(data)
//   //     } catch (err) {
//   //       console.error('Failed to load inventory:', err)
//   //     }
//   //   }
  
//   //   fetchInventory()
//   // }, [])
  

//   // const handleSalesPriceChange = (index: number, value: string) => {
//   //   const updatedInventory = [...inventory]
//   //    updatedInventory[index].salesPrice = value
//   //   setInventory(updatedInventory)
//   //   // updateInventory(updatedInventory)
//   // }

//   // const handleSetQtyChange = (index: number, value: string) => {
//   //   const updatedInventory = [...inventory]
//   //   updatedInventory[index].setQty = value
//   //   setInventory(updatedInventory)
//   //   // updateInventory(updatedInventory)
//   // }
//   // const handleDeleteRow = (index: number) => {
//   //   const updatedInventory = inventory.filter((_, i) => i !== index)
//   //   setInventory(updatedInventory)
//   //   deleteInventoryItem(index)
//   // }

//   // const handleDelete = async (id: string) => {
//   //   await supabase.from('inventory').delete().eq('id', id);
//   //   setInventory(inventory.filter(item => item.id !== id));
//   // };
  
//   // const handleDeleteRow = (index: number) => {
//   //   setDeleteIndex(index)
//   // }

//   // const cancelDelete = () => {
//   //   setDeleteIndex(null)
//   // }

//   // const confirmDelete = () => {
//   //   if (deleteIndex !== null) {
//   //     const updatedInventory = inventory.filter((_, i) => i !== deleteIndex)
//   //     setInventory(updatedInventory)
//   //     deleteInventoryItem(deleteIndex)
//   //     setDeleteIndex(null)
//   //   }
//   // }

//   //  const confirmDelete = async () => {
//   //     if (deleteId) {
//   //       try {
//   //         // await deleteInventoryItem(deleteId)
//   //     const updatedInventory = inventory.filter((_, i) => i !== deleteIndex)
//   //     setInventory(updatedInventory)
//   //       } catch (error) {
//   //         console.error('Error deleting invoice:', error)
//   //       } finally {
//   //         setDeleteId(null)
//   //       }
//   //     }
//   //   }


  
  

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Inventory List</h1>


//       {/* <Button
//   onClick={async () => {
//     try {
//       await saveInventoryOnline(inventory)
//       toast.success('Inventory synced to Supabase!')
//     } catch (err) {
//       console.error('Sync error:', err);
//       toast.error('Failed to sync inventory.')
//     }
//   }}
//   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
// >
//   Sync Inventory to Supabase
// </Button> */}

//       <table className="w-full">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 p-2 w-[50px]">S.No</th>
//             <th className="border border-gray-300 p-2 w-1/12">Date</th>
//             <th className="border border-gray-300 p-2 w-auto">Particular</th>
//             <th className="border border-gray-300 p-2 w-1/12">Purchase Qty</th>
//             <th className="border border-gray-300 p-2 w-1/12">Purchase Price</th>
//             <th className="border border-gray-300 p-2 w-1/12">Sales Qty</th>
//             <th className="border border-gray-300 p-2 w-1/12">Sales Price</th>
//             <th className="border border-gray-300 p-2 w-1/12">Set Qty</th>
//             <th className="border border-gray-300 p-2 w-1/12">Available Stock</th>
//             <th className="border border-gray-300 p-2 w-1/12">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventory.map((item, index) => (
//             <tr key={index} className="hover:bg-gray-50">
//               <td className="border border-gray-300 p-2">{index + 1}</td>
//               <td className="border border-gray-300 p-2">{item.purchaseDate || 'N/A'}</td>
//               <td className="border border-gray-300 p-2">{item.particulars}</td>
//               <td className="border border-gray-300 p-2">{item.purchaseQty}</td>
//               <td className="border border-gray-300 p-2">{item.purchasePrice}</td>
//               <td className="border border-gray-300 p-2">{item.salesQty}</td>
//               <td className="border border-gray-300 p-2">
//               <input
//                   type="number"
//                   value={item.salesPrice}
//                   onChange={(e) => handleUpdate(index, 'salesPrice', e.target.value)}
//                   className="w-[80px]"
//                 />
//               </td>
//               <td className="border border-gray-300 p-2 w-1/12">
//               <input
//                   type="number"
//                   value={item.setQty}
//                   onChange={(e) => handleUpdate(index, 'setQty', e.target.value)}
//                   className="w-[80px]"
//                 />
//               </td>
//               {/* <td className="border border-gray-300 p-2">{item.purchaseQty - item.salesQty}</td> */}
//               <td className="border border-gray-300 p-2">
//                 {Number(item.purchaseQty) - Number(item.salesQty)}
//               </td>

//               <td className="border border-gray-300 p-2">
//                   <Button
//                   onClick={() => setDeleteId(item.id!)}
//                   variant="destructive"
//                   size="icon"
//                 >
//                   <FaTrash className="w-4 h-4" />
//                 </Button>

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <ConfirmationDialog
//   isOpen={deleteId !== null}
//   onClose={() => setDeleteId(null)}
//   onConfirm={async () => {
//     if (deleteId) {
//       await supabase.from('inventory').delete().eq('id', deleteId);
//       setInventory(prev => prev.filter(item => item.id !== deleteId));
//       setDeleteId(null);
//     }
//   }}
//   title="Confirm Deletion"
//   description="Are you sure you want to delete this item? This action cannot be undone."
// />

//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import { Button } from "@/components/ui/button";

type InventoryItem = {
  sno: string;
  id?: string;
  particulars: string;
  purchaseQty: number;
  purchasePrice: number;
  salesQty: number;
  salesPrice: number;
};



export default function FancyInventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

    const [isConnected, setIsConnected] = useState<boolean | null>(null);


useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase.from("inventory").select("*").limit(1);

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



  // useEffect(() => {
  //   const fetchInventory = async () => {
  //     const { data, error } = await supabase
  //       .from('inventory')
  //       .select('*')
  //       .order('created_at', { ascending: false });

  //     if (error) console.error('Error:', error);
  //     else setInventory(data as InventoryItem[]);
  //   };

  //   fetchInventory();
  // }, []);

  useEffect(() => {
  const fetchInventory = async () => {
    let query = supabase
      .from('inventory')
      .select('*')
      .order('sno', { ascending: true });

    if (searchTerm.trim() !== '') {
      query = query.ilike('particulars', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching inventory:', error);
    } else {
      setInventory(data as InventoryItem[]);
    }
  };

  fetchInventory();
}, [searchTerm]);


  const updateSalesPrice = async (id: string | undefined, value: number) => {
    if (!id) return;
    const updated = inventory
        .filter((item) =>
          item.particulars.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(item =>
      item.id === id ? { ...item, salesPrice: value } : item
    );
    setInventory(updated);
    await supabase.from('inventory').update({ salesPrice: value }).eq('id', id);
  };

// Round up to nearest 5
const calculateSalesPrice = (purchasePrice: number) => {
  const priceWithMargin = purchasePrice * 1.10 + 25;
  return Math.ceil(priceWithMargin / 5) * 5;
};


  const handleRemove = async (id?: string) => {
    if (!id) return;
    await supabase.from('inventory').delete().eq('id', id);
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
        <div className="flex items-center gap-2 mb-4">
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
      {/* Summary */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-wrap justify-between mb-6">
        <div>
          <div className="text-gray-500 text-sm">Total Items</div>
          <div className="text-2xl font-bold">{inventory.length}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Total Stock</div>
          <div className="text-2xl font-bold">
            {inventory.reduce((sum, i) => sum + i.purchaseQty - i.salesQty, 0)}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Total Value</div>
          <div className="text-2xl font-bold text-green-600">
            ₹
            {inventory.reduce((sum, i) => sum + i.purchaseQty * i.purchasePrice, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {inventory.map((item) => {
          const available = item.purchaseQty - item.salesQty;
          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition"
            >
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-center">
                  {/* <div className="text-sm text-gray-400">S.No: {idx + 1}</div> */}
                  <div className="text-sm text-gray-400">S.No: {item.sno ?? '-'}</div>
                  <div className="text-sm text-gray-400">ID: {item.id?.slice(0, 6)}</div>
                </div>
                <h2 className="text-lg font-semibold">{item.particulars}</h2>
                <p className="text-sm text-gray-500">
                  Qty: {item.purchaseQty} | Sold: {item.salesQty} | Avail:{" "}
                  <span className={`${available < 5 ? "text-red-500 font-bold" : "text-green-600"}`}>
                    {available}
                  </span>
                </p>
                <div className="text-sm text-gray-600 mt-2">
                  Set Sales Price: ₹{" "}
                  <input
                    type="number"
                    value={item.salesPrice}
                    onChange={(e) => updateSalesPrice(item.id, parseFloat(e.target.value))}
                    className="border px-2 py-1 rounded w-[100px]"
                  />
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Sales Price: ₹{" "}
                  <input
                    type="number"
                    value={calculateSalesPrice(item.purchasePrice)}
                    disabled
                    className="border px-2 py-1 rounded w-[100px] bg-gray-100 text-gray-700"
                  />
                </div>

              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
