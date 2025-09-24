// utils/onlineStorage.ts
import { Invoice } from './storage'
import { supabase } from './supabaseClient'
// import { getInvoices } from './storage'; // assuming this gets local storage


export async function saveInvoiceOnline(invoice: Invoice) {
  const { data, error } = await supabase.from('invoices').insert([invoice])

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function saveInvoiceOffline(invoice: Invoice) {
  const offlineInvoices = JSON.parse(localStorage.getItem('offlineInvoices') || '[]')
  offlineInvoices.push(invoice)
  localStorage.setItem('offlineInvoices', JSON.stringify(offlineInvoices))
}

export async function syncOfflineInvoices() {
  const offlineInvoices = JSON.parse(localStorage.getItem('offlineInvoices') || '[]')

  if (offlineInvoices.length === 0) return

  for (const invoice of offlineInvoices) {
    try {
      await saveInvoiceOnline(invoice)
    } catch (error) {
      console.error('Failed to sync one invoice:', error)
      // If any fails, stop sync — prevent data loss
      return
    }
  }

  // If all synced successfully
  localStorage.removeItem('offlineInvoices')
}

export async function updateInvoiceOnline(invoice: Invoice) {
  const { error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', invoice.id);

  if (error) {
    console.error('Update failed:', error);
    throw error;
  }
}

export async function deleteInvoiceOnline(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}


// Save one item
// export async function saveInventoryItemOnline(item: InventoryItem) {
//   const { data, error } = await supabase.from('inventory').insert([item])
//   if (error) throw error
//   return data
// }





// export async function syncInventoryToSupabase(items: InventoryItem[]) {
//   // Remove undefined or empty rows (optional)
//   const filtered = items.filter(i => i.particulars?.trim())

//   const { data, error } = await supabase.from('inventory').insert(filtered)

//   if (error) {
//     console.error('Supabase insert error:', error)
//     throw error
//   }

//   return data
// }

// export async function getOnlineInventory(): Promise<InventoryItem[]> {
//   const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });

//   if (error) {
//     console.error('Error loading inventory:', error);
//     throw error;
//   }

//   return data as InventoryItem[];
// }




// export async function saveInventoryOnline(items: InventoryItem[]) {
//   const cleaned = items.map(item => ({
//     sno: '',
//     particulars: item.particulars,
//     purchaseQty: Number(item.purchaseQty || 0),
//     purchasePrice: Number(item.purchasePrice || 0),
//     salesQty: Number(item.salesQty || 0),
//     salesPrice: Number(item.salesPrice || 0),
//     setQty: Number(item.setQty || 0),
//     purchaseDate: item.purchaseDate || null,
//   }));

//   const { error } = await supabase.from('inventory').insert(cleaned);

//   if (error) {
//     console.error('Inventory insert error:', error);
//     throw error;
//   }
// }

// import  {InventoryItem}  from '../components/InventoryList'

type InventoryItem = {
  sno?: number;
  purchaseDate: string;
  id?: string;
  particulars: string;
  purchaseQty: string;
  purchasePrice: string;
  salesQty: string;
  salesPrice: string;
  setQty: string;
  created_at?: string;
};

type RawItem = {
  // sno: number;
  particulars: string;
  qty: string;
  price: string;
};


export const fetchOnlineBusinessProfile = async () => {
  const { data, error } = await supabase
    .from('business_profile')
    .select('*')
    // .single(); // if only one profile exists per user
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching online business profile:", error.message);
    return null;
  }

  return data;
};

// ✅ Replace with your Supabase fetching logic
export const fetchBusinessProfile = async () => {
  const { data, error } = await supabase.from("business_profile").select("*").limit(1).maybeSingle();
  if (error) {
    throw error;
  }
  return data;
};



export async function saveInvoiceInventoryItems(
  items: RawItem[],
  type: 'purchase' | 'sale',
  date: string
) {
  for (const item of items) {
    const { particulars, qty, price } = item;
    const quantity = qty || '0';
    const rate = price || '0';

    // Check if item exists
    const { data: existing, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('particulars', particulars)
      .maybeSingle();

    if (fetchError) {
      console.error(`❌ Fetch error for ${particulars}:`, fetchError.message);
      continue;
    }

    const inventoryItem: InventoryItem = {
      particulars,
      purchaseQty: type === 'purchase' ? quantity : '0',
      purchasePrice: type === 'purchase' ? rate : '0',
      salesQty: type === 'sale' ? quantity : '0',
      salesPrice: type === 'sale' ? rate : '0',
      setQty: '0',
      purchaseDate: date,
    };

    if (existing) {
      // Update existing item
      const updates: Partial<InventoryItem> = {};

      if (type === 'sale') {
        updates.salesQty = (
          parseFloat(existing.salesQty || '0') + parseFloat(quantity)
        ).toString();
        // updates.salesPrice = rate;
      } else {
        updates.purchaseQty = quantity;
        updates.purchasePrice = rate;
      }

      const { error: updateError } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', existing.id);

      if (updateError) {
        console.error(`❌ Failed to update ${particulars}:`, updateError.message);
      } else {
        console.log(`✅ Updated inventory: ${particulars}`);
      }
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('inventory')
        .insert(inventoryItem);

      if (insertError) {
        console.error(`❌ Failed to insert ${particulars}:`, insertError.message);
      } else {
        console.log(`➕ Inserted new inventory item: ${particulars}`);
      }
    }
  }
}
