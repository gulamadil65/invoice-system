import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';




export interface Invoice {
    synced: boolean;
    id: string;
    type: 'sale' | 'purchase';
    billNo: string;
    date: string;
    customer: string;
    bookno: string;
    phone1: string;
    phone2: string;
    address: string;
    gstNo: string;
    transport: string;
    lrDate: string;
    lrNo: string;
    bale: number | null;
    items: {
      serial: string,
      sno: number;
      particulars: string;
      hsn: string;
      qty: string;
      price: string;
      amount: number;
    }[];
    subtotal: number;
    gst: number;
    grandTotal: number;
    includeGST?: boolean;
    payments?: PaymentEntry[];
    totalPaid?: number;    

    
  }

  export interface PaymentEntry {
    mode: string;
    amount: string;
  }
  

  export interface PDFData {
    name: string;
    phone: string;
    address1: string;
    address2: string;
    gst: string;
    pan: string;
    acName: string;
    acNo: string;
    bankname: string;
    ifsc: string;
    branch: string;
    paymentPhone: string;
    email: string;
    facebook: string;
    youtube: string;
    logoDataUrl?: string;
    paymentDataUrl?: string;
  }
  
  
  export interface InventoryItem {
    id?: string;
    serialno: string;
    sno: number;
    purchaseDate: string;
    particulars: string;
    purchaseQty: number;
    purchasePrice: number;
    salesQty: number;
    salesPrice: string;
    setQty: string;
  }
  


  
  
  export function saveInvoice(invoice: Invoice): void {
    try {
      const invoices = getInvoices();
      invoices.push(invoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      updateInventoryFromInvoice(invoice);
    } catch (error) {
      console.error("Failed to save invoice:", error);
    }
  }
  
  export function getInvoices(): Invoice[] {
    try {
      const invoicesJson = localStorage.getItem('invoices');
      return invoicesJson ? JSON.parse(invoicesJson) : [];
    } catch (error) {
      console.error("Failed to retrieve invoices:", error);
      return [];
    }
  }
  

  
  export function updateInvoice(updatedInvoice: Invoice): void {
    try {
      const invoices = getInvoices();
      const index = invoices.findIndex(invoice => invoice.id === updatedInvoice.id);
      if (index !== -1) {
        const oldInvoice = invoices[index];
        invoices[index] = updatedInvoice;
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updateInventoryFromEditedInvoice(oldInvoice, updatedInvoice);
      }
    } catch (error) {
      console.error("Failed to update invoice:", error);
    }
  }
  
  export function deleteInvoice(id: string): void {
    try {
      const invoices = getInvoices();
      const invoiceToDelete = invoices.find(invoice => invoice.id === id);
      if (invoiceToDelete) {
        updateInventoryFromDeletedInvoice(invoiceToDelete);
      }
      const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  }
  
  export function getInventory(): InventoryItem[] {
    try {
      const inventoryJson = localStorage.getItem('inventory');
      return inventoryJson ? JSON.parse(inventoryJson) : [];
    } catch (error) {
      console.error("Failed to retrieve inventory:", error);
      return [];
    }
  }
  
  export function updateInventory(inventory: InventoryItem[]): void {
    try {
      localStorage.setItem('inventory', JSON.stringify(inventory));
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  }
  
  export function deleteInventoryItem(index: number): void {
    try {
      const inventory = getInventory();
      inventory.splice(index, 1);
      updateInventory(inventory);
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
    }
  }

  export function deleteInvoiceOffline() {
    throw new Error('Function not implemented.')
  }
  
  // function updateInventoryFromDeletedInvoice(invoice: Invoice): void {
  //   const inventory = getInventory();
  //   invoice.items.forEach(item => {
  //     const existingItem = inventory.find(invItem => invItem.particulars === item.particulars);
  //     if (existingItem) {
  //       if (invoice.type === 'purchase') {
  //         existingItem.purchaseQty -= parseInt(item.qty);
  //         if (existingItem.purchaseQty <= 0) {
  //           // Remove the item from inventory if purchase quantity becomes zero or negative
  //           const index = inventory.findIndex(invItem => invItem.particulars === item.particulars);
  //           if (index !== -1) {
  //             inventory.splice(index, 1);
  //           }
  //         }
  //       } else {
  //         existingItem.salesQty -= parseInt(item.qty);
  //       }
  //     }
  //   });
  //   updateInventory(inventory);
  // }

  function updateInventoryFromDeletedInvoice(invoice: Invoice): void {
    const inventory = getInventory();
    invoice.items.forEach(item => {
      const existingItem = inventory.find(invItem => invItem.particulars === item.particulars);
      if (existingItem) {
        if (invoice.type === 'purchase') {
          existingItem.purchaseQty -= parseInt(item.qty);
        } else {
          existingItem.salesQty -= parseInt(item.qty);
        }
        // Remove item from inventory if quantities become zero
        if (existingItem.purchaseQty === 0 && existingItem.salesQty === 0) {
          const index = inventory.findIndex(invItem => invItem.particulars === item.particulars);
          if (index !== -1) {
            inventory.splice(index, 1);
          }
        }
      }
    });
    updateInventory(inventory);
  }
  

  function updateInventoryFromEditedInvoice(oldInvoice: Invoice, newInvoice: Invoice): void {
    const inventory = getInventory();
  
    // Remove old quantities
    oldInvoice.items.forEach(item => {
      const inventoryItem = inventory.find(invItem => invItem.particulars === item.particulars);
      if (inventoryItem) {
        if (oldInvoice.type === 'purchase') {
          inventoryItem.purchaseQty -= parseInt(item.qty);
        } else {
          inventoryItem.salesQty -= parseInt(item.qty);
        }
      }
    });
  
    // Add new quantities
    newInvoice.items.forEach(item => {
      const inventoryItem = inventory.find(invItem => invItem.particulars === item.particulars);
      if (inventoryItem) {
        if (newInvoice.type === 'purchase') {
          inventoryItem.purchaseQty += parseInt(item.qty);
          inventoryItem.purchasePrice = parseFloat(item.price);
          inventoryItem.purchaseDate = newInvoice.date;
        } else {
          inventoryItem.salesQty += parseInt(item.qty);
        }
      } else {
        // If item doesn't exist in inventory, add it
        inventory.push({
          serialno: item.serial,
          sno: item.sno,
          particulars: item.particulars,
          purchaseQty: newInvoice.type === 'purchase' ? parseInt(item.qty) : 0,
          purchasePrice: newInvoice.type === 'purchase' ? parseFloat(item.price) : 0,
          salesQty: newInvoice.type === 'sale' ? parseInt(item.qty) : 0,
          salesPrice: '0',
          setQty: '0',
          purchaseDate: newInvoice.type === 'purchase' ? newInvoice.date : '',
        });
      }
    });
  
    // Remove items from inventory if they no longer exist in any invoice
    const allInvoices = getInvoices();
    inventory.forEach((item, index) => {
      const existsInAnyInvoice = allInvoices.some(invoice => 
        invoice.items.some(invoiceItem => invoiceItem.particulars === item.particulars)
      );
      if (!existsInAnyInvoice) {
        inventory.splice(index, 1);
      }
    });
  
    updateInventory(inventory);
  }
  
  

  function updateInventoryFromInvoice(invoice: Invoice): void {
    const inventory = getInventory();
    invoice.items.forEach(item => {
      const existingItem = inventory.find(invItem => invItem.particulars === item.particulars);
      if (existingItem) {
        if (invoice.type === 'purchase') {
          
          existingItem.purchaseQty += parseInt(item.qty);
          existingItem.purchasePrice = parseFloat(item.price);
          existingItem.purchaseDate = invoice.date;
        } else {
          existingItem.salesQty += parseInt(item.qty);
        }
      } else {
        inventory.push({
          serialno: item.serial,
          sno: item.sno,
          particulars: item.particulars,
          purchaseDate: invoice.type === 'purchase' ? invoice.date : '',
          purchaseQty: invoice.type === 'purchase' ? parseInt(item.qty) : 0,
          purchasePrice: invoice.type === 'purchase' ? parseFloat(item.price) : 0,
          salesQty: invoice.type === 'sale' ? parseInt(item.qty) : 0,
          salesPrice: '0',
          setQty: '0',
        });
      }
    });
    updateInventory(inventory);
  }


  // Backup all data
export async function backupData() {
  const data = {
    invoices: getInvoices(),
    inventory: getInventory(),
    // Add other data types here if needed
  };

  const jsonData = JSON.stringify(data);

  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Filesystem.writeFile({
        path: 'invoice_backup.json',
        data: jsonData,
        directory: Directory.Documents,
        recursive: true
      });
      console.log('Backup saved:', result.uri);
    } catch (error) {
      console.error('Error saving backup:', error);
    }
  } else {
    // Web platform
    const blob = new Blob([jsonData], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'invoice_backup.json';
    a.click();
    URL.revokeObjectURL(a.href);

  }
  

    
}

// Restore data from backup
export async function restoreFromBackup(jsonData: string) {
  try {
    const data = JSON.parse(jsonData);
    localStorage.setItem('invoices', JSON.stringify(data.invoices));
    localStorage.setItem('inventory', JSON.stringify(data.inventory));
    // Restore other data types here if needed
    console.log('Data restored successfully');

  } catch (error) {
    console.error('Error restoring data:', error);
    throw error;
  }
}




// import { supabase } from './supabaseClient'
// import { v4 as uuidv4 } from 'uuid'

// export interface Invoice {
//   id: string
//   type: 'sale' | 'purchase'
//   billNo: string
//   date: string
//   customer: string
//   bookno: string
//   phone1: string
//   phone2: string
//   address: string
//   gstNo: string
//   transport: string
//   lrDate: string
//   lrNo: string
//   bale: number | null
//   items: {
//     sno: number
//     particulars: string
//     hsn: string
//     qty: string
//     price: string
//     amount: number
//   }[]
//   totalQuantity: number
//   subtotal: number
//   gst: number
//   grandTotal: number
// }

// export interface InventoryItem {
//   id?: string;
//   particulars: string;
//   purchaseDate: string;
//   purchaseQty: number;
//   purchasePrice: number;
//   salesQty: number;
//   salesPrice: string;
//   setQty: string;
// }

// // export async function saveInvoice(invoice: Invoice): Promise<void> {
// //   try {
// //     console.log('Saving invoice:', invoice) // Add this line for debugging

// //     const { data, error } = await supabase
// //       .from('invoices')
// //       .upsert({ ...invoice, updated_at: new Date().toISOString() })
    
// //     if (error) {
// //       console.error('Supabase error:', error) // Add this line for detailed error logging
// //       throw new Error(`Supabase error: ${error.message}`)
// //     }
    
// //     console.log('Invoice saved successfully:', data) // Add this line for debugging

// //     await updateInventoryFromInvoice(invoice)
// //   } catch (error) {
// //     console.error("Failed to save invoice:", error)
// //     if (error instanceof Error) {
// //       throw new Error(`Failed to save invoice: ${error.message}`)
// //     } else {
// //       throw new Error('Failed to save invoice: Unknown error')
// //     }
// //   }
// // }

// export async function getInvoices(): Promise<Invoice[]> {
//   try {
//     const { data, error } = await supabase
//       .from('invoices')
//       .select('*')
    
//     if (error) throw error
    
//     return data || []
//   } catch (error) {
//     console.error("Failed to retrieve invoices:", error)
//     return []
//   }
// }


// export async function saveInvoice(invoice: Invoice): Promise<void> {
//   try {
//     console.log('Saving invoice:', invoice);

//     const { data, error } = await supabase
//       .from('invoices')
//       .upsert(invoice);
    
//     if (error) {
//       console.error('Supabase error:', error);
//       throw new Error(`Supabase error: ${error.message}`);
//     }
    
//     console.log('Invoice saved successfully:', data);

//     await updateInventoryFromInvoice(invoice);
//   } catch (error) {
//     console.error("Failed to save invoice:", error);
//     if (error instanceof Error) {
//       throw new Error(`Failed to save invoice: ${error.message}`);
//     } else {
//       throw new Error('Failed to save invoice: Unknown error');
//     }
//   }
// }

// // Update other functions that use 'updated_at' similarly
// export async function updateInvoice(updatedInvoice: Invoice): Promise<void> {
//   try {
//     const { data: oldInvoice, error: fetchError } = await supabase
//       .from('invoices')
//       .select('*')
//       .eq('id', updatedInvoice.id)
//       .single()
    
//     if (fetchError) throw fetchError

//     const { error: updateError } = await supabase
//       .from('invoices')
//       .update(updatedInvoice)
//       .eq('id', updatedInvoice.id)
    
//     if (updateError) throw updateError

//     await updateInventoryFromEditedInvoice(oldInvoice, updatedInvoice)
//   } catch (error) {
//     console.error("Failed to update invoice:", error)
//     throw error
//   }
// }


// // export async function updateInvoice(updatedInvoice: Invoice): Promise<void> {
// //   try {
// //     const { data: oldInvoice, error: fetchError } = await supabase
// //       .from('invoices')
// //       .select('*')
// //       .eq('id', updatedInvoice.id)
// //       .single()
    
// //     if (fetchError) throw fetchError

// //     const { error: updateError } = await supabase
// //       .from('invoices')
// //       .update({ ...updatedInvoice, updated_at: new Date().toISOString() })
// //       .eq('id', updatedInvoice.id)
    
// //     if (updateError) throw updateError

// //     await updateInventoryFromEditedInvoice(oldInvoice, updatedInvoice)
// //   } catch (error) {
// //     console.error("Failed to update invoice:", error)
// //     throw error
// //   }
// // }

// export async function deleteInvoice(id: string): Promise<void> {
//   try {
//     const { data: invoiceToDelete, error: fetchError } = await supabase
//       .from('invoices')
//       .select('*')
//       .eq('id', id)
//       .single()
    
//     if (fetchError) throw fetchError

//     const { error: deleteError } = await supabase
//       .from('invoices')
//       .delete()
//       .eq('id', id)
    
//     if (deleteError) throw deleteError

//     await updateInventoryFromDeletedInvoice(invoiceToDelete)
//   } catch (error) {
//     console.error("Failed to delete invoice:", error)
//     throw error
//   }
// }

// export async function getInventory(): Promise<InventoryItem[]> {
//   try {
//     const { data, error } = await supabase
//       .from('inventory')
//       .select('*')
    
//     if (error) throw error
    
//     return data || []
//   } catch (error) {
//     console.error("Failed to retrieve inventory:", error)
//     return []
//   }
// }

// export async function updateInventory(inventory: InventoryItem[]): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('inventory')
//       .upsert(inventory.map(item => ({ ...item, updated_at: new Date().toISOString() })))
    
//     if (error) throw error
//   } catch (error) {
//     console.error("Failed to update inventory:", error)
//     throw error
//   }
// }

// export async function deleteInventoryItem(id: string): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('inventory')
//       .delete()
//       .eq('id', id)
    
//     if (error) throw error
//   } catch (error) {
//     console.error("Failed to delete inventory item:", error)
//     throw error
//   }
// }

// async function updateInventoryFromDeletedInvoice(invoice: Invoice): Promise<void> {
//   const inventory = await getInventory()
//   invoice.items.forEach(item => {
//     const existingItem = inventory.find(invItem => invItem.particulars === item.particulars)
//     if (existingItem) {
//       if (invoice.type === 'purchase') {
//         existingItem.purchaseQty -= parseInt(item.qty)
//       } else {
//         existingItem.salesQty -= parseInt(item.qty)
//       }
//       // Remove item from inventory if quantities become zero
//       if (existingItem.purchaseQty === 0 && existingItem.salesQty === 0) {
//         const index = inventory.findIndex(invItem => invItem.particulars === item.particulars)
//         if (index !== -1) {
//           inventory.splice(index, 1)
//         }
//       }
//     }
//   })
//   await updateInventory(inventory)
// }

// async function updateInventoryFromEditedInvoice(oldInvoice: Invoice, newInvoice: Invoice): Promise<void> {
//   const inventory = await getInventory()

//   // Remove old quantities
//   oldInvoice.items.forEach(item => {
//     const inventoryItem = inventory.find(invItem => invItem.particulars === item.particulars)
//     if (inventoryItem) {
//       if (oldInvoice.type === 'purchase') {
//         inventoryItem.purchaseQty -= parseInt(item.qty)
//       } else {
//         inventoryItem.salesQty -= parseInt(item.qty)
//       }
//     } 
//   })

//   // Add new quantities
//   newInvoice.items.forEach(item => {
//     const inventoryItem = inventory.find(invItem => invItem.particulars === item.particulars)
//     if (inventoryItem) {
//       if (newInvoice.type === 'purchase') {
//         inventoryItem.purchaseQty += parseInt(item.qty)
//         inventoryItem.purchasePrice = parseFloat(item.price)
//         inventoryItem.purchaseDate = newInvoice.date
//       } else {
//         inventoryItem.salesQty += parseInt(item.qty)
//       }
//     } else {
//       // If item doesn't exist in inventory, add it
//       inventory.push({
//         id: uuidv4(),
//         particulars: item.particulars,
//         purchaseQty: newInvoice.type === 'purchase' ? parseInt(item.qty) : 0,
//         purchasePrice: newInvoice.type === 'purchase' ? parseFloat(item.price) : 0,
//         salesQty: newInvoice.type === 'sale' ? parseInt(item.qty) : 0,
//         salesPrice: '0',
//         setQty: '0',
//         purchaseDate: newInvoice.type === 'purchase' ? newInvoice.date : '',
//       })
//     }
//   })

//   await updateInventory(inventory)
// }

// // async function updateInventoryFromInvoice(invoice: Invoice): Promise<void> {
// //   for (const item of invoice.items) {
// //     try {
// //       const { data, error } = await supabase
// //         .from('inventory')
// //         .select('*')
// //         .eq('particulars', item.particulars)
// //         .single()

// //       if (error && error.code !== 'PGRST116') {
// //         console.error('Error fetching inventory item:', error)
// //         continue
// //       }

// //       let updatedItem: InventoryItem
// //       if (data) {
// //         updatedItem = {
// //           id: data.id,
// //           particulars: item.particulars,
// //           purchaseQty: invoice.type === 'purchase' ? data.purchaseQty + parseInt(item.qty) : data.purchaseQty,
// //           salesQty: invoice.type === 'sale' ? data.salesQty + parseInt(item.qty) : data.salesQty,
// //           purchasePrice: invoice.type === 'purchase' ? parseFloat(item.price) : data.purchasePrice,
// //           salesPrice: data.salesPrice,
// //           setQty: data.setQty,
// //           purchaseDate: invoice.type === 'purchase' ? invoice.date : data.purchaseDate,
// //         }
// //       } else {
// //         updatedItem = {
// //           id: data.id,
// //           particulars: item.particulars,
// //           purchaseQty: invoice.type === 'purchase' ? parseInt(item.qty) : 0,
// //           salesQty: invoice.type === 'sale' ? parseInt(item.qty) : 0,
// //           purchasePrice: invoice.type === 'purchase' ? parseFloat(item.price) : 0,
// //           salesPrice: '0',
// //           setQty: '0',
// //           purchaseDate: invoice.type === 'purchase' ? invoice.date : '',
// //         }
// //       }

// //       const { error: upsertError } = await supabase
// //         .from('inventory')
// //         .upsert(updatedItem)

// //       if (upsertError) {
// //         console.error('Error updating inventory:', upsertError)
// //         throw upsertError
// //       }

// //       console.log('Inventory item updated successfully:', updatedItem)
// //     } catch (error) {
// //       console.error('Error in updateInventoryFromInvoice:', error)
// //     }
// //   }
// // }

// async function updateInventoryFromInvoice(invoice: Invoice): Promise<void> {
//   if (!invoice || !invoice.items) {
//     console.error("Invalid invoice data in updateInventoryFromInvoice")
//     return
//   }

//   for (const item of invoice.items) {
//     if (!item || !item.particulars) {
//       console.error("Invalid item data in updateInventoryFromInvoice")
//       continue
//     }

//     try {
//       const { data, error } = await supabase.from("inventory").select("*").eq("particulars", item.particulars).single()

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No matching record found, create a new one
//           const newItem: InventoryItem = {
//             particulars: item.particulars,
//             purchaseQty: invoice.type === "purchase" ? Number.parseInt(item.qty) : 0,
//             salesQty: invoice.type === "sale" ? Number.parseInt(item.qty) : 0,
//             purchasePrice: invoice.type === "purchase" ? Number.parseFloat(item.price) : 0,
//             salesPrice: invoice.type === "sale" ? item.price : "0",
//             setQty: "0",
//             purchaseDate: invoice.type === "purchase" ? invoice.date : "",
//           }

//           const { error: insertError } = await supabase.from("inventory").insert(newItem)

//           if (insertError) {
//             console.error("Error inserting new inventory item:", insertError)
//           } else {
//             console.log("New inventory item created:", newItem)
//           }
//         } else {
//           console.error("Error fetching inventory item:", error)
//         }
//         continue
//       }

//       if (!data) {
//         console.error("No data returned for inventory item")
//         continue
//       }

//       const updatedItem: InventoryItem = {
//         id: data.id,
//         particulars: item.particulars,
//         purchaseQty: invoice.type === "purchase" ? data.purchaseQty + Number.parseInt(item.qty) : data.purchaseQty,
//         salesQty: invoice.type === "sale" ? data.salesQty + Number.parseInt(item.qty) : data.salesQty,
//         purchasePrice: invoice.type === "purchase" ? Number.parseFloat(item.price) : data.purchasePrice,
//         salesPrice: invoice.type === "sale" ? item.price : data.salesPrice,
//         setQty: data.setQty,
//         purchaseDate: invoice.type === "purchase" ? invoice.date : data.purchaseDate,
//       }

//       const { error: upsertError } = await supabase.from("inventory").upsert(updatedItem)

//       if (upsertError) {
//         console.error("Error updating inventory:", upsertError)
//       } else {
//         console.log("Inventory item updated successfully:", updatedItem)
//       }
//     } catch (error) {
//       console.error("Error in updateInventoryFromInvoice:", error)
//     }
//   }
// }





// // Offline support
// export async function syncOfflineData() {
//   const offlineInvoices = JSON.parse(localStorage.getItem('offlineInvoices') || '[]')
//   const offlineInventory = JSON.parse(localStorage.getItem('offlineInventory') || '[]')

//   for (const invoice of offlineInvoices) {
//     await saveInvoice(invoice)
//   }

//   for (const item of offlineInventory) {
//     await updateInventory([item])
//   }

//   localStorage.removeItem('offlineInvoices')
//   localStorage.removeItem('offlineInventory')
// }

// export function saveOfflineInvoice(invoice: Invoice) {
//   const offlineInvoices = JSON.parse(localStorage.getItem('offlineInvoices') || '[]')
//   offlineInvoices.push(invoice)
//   localStorage.setItem('offlineInvoices', JSON.stringify(offlineInvoices))
// }

// export function saveOfflineInventoryItem(item: InventoryItem) {
//   const offlineInventory = JSON.parse(localStorage.getItem('offlineInventory') || '[]')
//   offlineInventory.push(item)
//   localStorage.setItem('offlineInventory', JSON.stringify(offlineInventory))
// }

