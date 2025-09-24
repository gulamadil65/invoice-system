'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { jsPDF } from 'jspdf'
import { v4 as uuidv4 } from 'uuid'
import {  getInvoices, getInventory, Invoice, InventoryItem, PDFData  } from '../utils/storage'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPlus, FaMinus, FaShareAlt, FaEraser, FaFileDownload } from 'react-icons/fa';
import { Card, CardContent } from "@/components/ui/card"
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
// import { InvoiceItem } from '../utils/types'
// import { sendPDFViaWhatsApp } from '../utils/WhatsAppSender'
// import { signInAnonymously } from '@/src/lib/supabase'

import { saveInvoiceOnline, saveInvoiceOffline, updateInvoiceOnline, fetchBusinessProfile, saveInvoiceInventoryItems } from '../utils/onlineStorage'
import { syncOfflineInvoices } from '../utils/onlineStorage'
import { supabase } from '../utils/supabaseClient' // adjust path
// import CreatableSelect from 'react-select/creatable';






export default function InvoiceGenerator() {
  


  const searchParams = useSearchParams()
  const [invoiceType, setInvoiceType] = useState<'sale' | 'purchase'>(
    (searchParams.get('type') as 'sale' | 'purchase') || 'sale'
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])


  const [formData, setFormData] = useState({
    billNo: '',
    date: new Date().toISOString().split('T')[0], // Set today's date as default
    customer: '',
    bookno: '',
    phone1: '',
    phone2: '',
    address: '',
    gstNo: '',
    transport: '',
    lrDate: '',
    lrNo: '',
    bale: null as number | null,
    payments: [{ mode: '', amount: '' }], // multiple payments
  })

  // const [pdfToShare, setPdfToShare] = useState<jsPDF | null>(null)


  const [inventoryItems, setInventoryItems] = useState([
    { serial: '', sno: 1, particulars: 'SAREES', hsn: '5407', qty: '', price: '', amount: 0 },
  ])
  

  // const [searchTerm, setSearchTerm] = useState('')
  // const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  // const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
  // const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  // // const router = useRouter()
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [showDropdown, setShowDropdown] = useState(false);
const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
const [selectedItemIndex, setSelectedItemIndex] = useState(0);
const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
const [previousBillNo, setPreviousBillNo] = useState<number | null>(null);
const [includeGST, setIncludeGST] = useState(true);


const fetchLastBillNo = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select("billNo")
    .order('billNo', { ascending: false }) // 👈 cast to int
    .limit(1)
    .single();

  if (!error && data) {
    setPreviousBillNo(data.billNo);
  }
};

useEffect(() => {
  fetchLastBillNo();
}, []);


  useEffect(() => {
    const typeParam = searchParams.get('type') as 'sale' | 'purchase'
    if (typeParam === 'sale' || typeParam === 'purchase') {
      setInvoiceType(typeParam)
    }
  }, [searchParams])
  
  

  // useEffect(() => {
  //   const handleOnline = () => setIsOnline(true)
  //   const handleOffline = () => setIsOnline(false)

  //   window.addEventListener('online', handleOnline)
  //   window.addEventListener('offline', handleOffline)

  //   return () => {
  //     window.removeEventListener('online', handleOnline)
  //     window.removeEventListener('offline', handleOffline)
  //   }
  // }, [])

  // useEffect(() => {
  //   const authenticateUser = async () => {
  //     try {
  //       await signInAnonymously()
  //       setIsAuthenticated(true)
  //       console.log('User authenticated anonymously')
  //     } catch (error) {
  //       console.error('Failed to authenticate:', error)
  //       toast.error('Failed to authenticate. Some features may not work.')
  //     }
  //   }

  //   authenticateUser()
  // }, [])

const [businessProfile, setBusinessProfile] = useState<PDFData | null>(null);

// useEffect(() => {
//   const profile = localStorage.getItem("businessProfile");
//   if (profile) {
//     setBusinessProfile(JSON.parse(profile));
//   }
// }, []);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);


useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase.from("invoices").select("*").limit(1);

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
//   const loadProfile = async () => {
//     try {
//       const profile = await fetchBusinessProfile();
//       setBusinessProfile(profile);
//     } catch (err) {
//       console.error("Error fetching business profile:", err);
//     }
//   };
//   loadProfile();
// }, []);

useEffect(() => {
  const loadProfile = async () => {
    try {
      const profile = await fetchBusinessProfile();
      setBusinessProfile(profile);
      localStorage.setItem("businessProfileBackup", JSON.stringify(profile)); // ✅ Save to localStorage
    } catch (err) {
      console.error("Error fetching business profile:", err);
      const localBackup = localStorage.getItem("businessProfileBackup");
      if (localBackup) {
        const fallbackProfile = JSON.parse(localBackup);
        setBusinessProfile(fallbackProfile);
        toast.info("Using saved business profile from local storage.");
      } else {
        toast.error("Failed to load business profile and no backup found.");
      }
    }
  };

  loadProfile();
}, []);



  useEffect(() => {
    const fetchInventory = async () => {
      const inventoryData = await getInventory()
      setInventory(inventoryData)
      // setFilteredInventory(inventoryData)
    }
    fetchInventory();
  }, [])

  // useEffect(() => {
  //   const filtered = inventory.filter(item =>
  //     item.particulars.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   setFilteredInventory(filtered)
  //   setSelectedItemIndex(0)
  // }, [searchTerm, inventory])

  

  // const getNextBillNumber = (type: 'sale' | 'purchase') => {
  //   const invoices = getInvoices()
  //   const filteredInvoices = invoices.filter(invoice => invoice.type === type)
  //   if (filteredInvoices.length === 0) return '101'
  //   const maxBillNo = Math.max(...filteredInvoices.map(invoice => parseInt(invoice.billNo)))
  //   return (maxBillNo + 1).toString()
  // }

        const handlePaymentChange = (index: number, field: 'mode' | 'amount', value: string) => {
          const updatedPayments = [...formData.payments]
          updatedPayments[index][field] = value
          setFormData(prev => ({ ...prev, payments: updatedPayments }))
        }
        
        const addPayment = () => {
          setFormData(prev => ({
            ...prev,
            payments: [...prev.payments, { mode: '', amount: '' }]
          }))
        }
        
        const removePayment = (index: number) => {
          const updated = formData.payments.filter((_, i) => i !== index)
          setFormData(prev => ({ ...prev, payments: updated }))
        }

        
        
  

  // const getNextBillNumber = async (type: 'sale' | 'purchase') => {
  //   const invoices = await getInvoices()
  //   const filteredInvoices = invoices.filter(invoice => invoice.type === type)
  //   if (filteredInvoices.length === 0) return '101'
  //   const maxBillNo = Math.max(...filteredInvoices.map(invoice => parseInt(invoice.billNo)))
  //   return (maxBillNo + 1).toString()
  // }



useEffect(() => {
  const fetchInvoice = async () => {
    const id = searchParams.get('id')
    const type = searchParams.get('type') as 'sale' | 'purchase'
    if (!id || !type) return

    try {
      let invoice: Invoice | undefined

      if (navigator.onLine) {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .eq('type', type)
          .single()

        if (error) throw error
        invoice = data
      } else {
        const offline = await getInvoices()
        invoice = offline.find(inv => inv.id === id && inv.type === type)
      }

      if (!invoice) return

      setFormData({
        billNo: invoice.billNo,
        date: invoice.date,
        customer: invoice.customer,
        bookno: invoice.bookno,
        phone1: invoice.phone1,
        phone2: invoice.phone2,
        address: invoice.address,
        gstNo: invoice.gstNo,
        transport: invoice.transport,
        lrDate: invoice.lrDate,
        lrNo: invoice.lrNo,
        bale: invoice.bale,
        payments: invoice.payments ?? [{ mode: '', amount: '' }],
        
      })

      setInventoryItems(invoice.items)
      setIsEditing(true)
      setEditingId(invoice.id)
      setInvoiceType(type)
      setIncludeGST(invoice.includeGST ?? true) // ✅ load saved value


    } catch (err) {
      console.error('Failed to fetch invoice:', err)
      toast.error('Failed to load invoice.')
    }
  }

  fetchInvoice();
}, [searchParams])

  
  // useEffect(() => {
  //   const id = searchParams.get('id')
  //   const type = searchParams.get('type') as 'sale' | 'purchase'
  //   if (id) {
  //     const invoices = getInvoices()
  //     const invoice = invoices.find(inv => inv.id === id && inv.type === type)
  //     if (invoice) {
  //       setFormData({
  //         billNo: invoice.billNo,
  //         date: invoice.date,
  //         customer: invoice.customer,
  //         bookno: invoice.bookno,
  //         phone1: invoice.phone1,
  //         phone2: invoice.phone2,
  //         address: invoice.address,
  //         gstNo: invoice.gstNo,
  //         transport: invoice.transport,
  //         lrDate: invoice.lrDate,
  //         lrNo: invoice.lrNo,
  //         bale: invoice.bale,
  //         payments: invoice.payments ?? [{ mode: '', amount: '' }],
  //       })
  //       setInventoryItems(invoice.items)
  //       setIsEditing(true)
  //       setEditingId(id)
  //       setInvoiceType(type)
  //     }
  //   }
  // }, [searchParams])

  

  
 const findCustomerByPhone = async (phone: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .or(`phone1.eq.${phone},phone2.eq.${phone}`)
      .single(); // returns one match

    if (error) {
      console.warn("No matching customer found:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error querying Supabase:", err);
    return null;
  }
};


  
  const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === 'phone1' || name === 'phone2') {
  const digitsOnly = value.replace(/\D/g, '');
  const lastTenDigits = digitsOnly.slice(-10);
  setFormData(prevData => ({ ...prevData, [name]: lastTenDigits }));

  if (lastTenDigits.length === 10) {
    const existingCustomer = await findCustomerByPhone(lastTenDigits);
    if (existingCustomer) {
      setFormData(prevData => ({
        ...prevData,
        billNo: existingCustomer.billNo || '',
        customer: existingCustomer.customer || '',
        address: existingCustomer.address || '',
        gstNo: existingCustomer.gstNo || '',
        transport: existingCustomer.transport || '',
        [name === 'phone1' ? 'phone2' : 'phone1']:
          name === 'phone1'
            ? existingCustomer.phone2 || ''
            : existingCustomer.phone1 || '',
      }));
      toast.success('Customer loaded from Supabase');
    // } else {
    //   toast.info('No matching customer found.');
    }
  }

  } else if (
    name === 'customer' ||
    name === 'address' ||
    name === 'gstNo' ||
    name === 'transport' ||
    name === 'lrNo'
  ) {
    setFormData(prevData => ({ ...prevData, [name]: value.toUpperCase() }));
  } else {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }
};


  const [inventoryOptions, setInventoryOptions] = useState<InventoryItem[]>([]);

useEffect(() => {
  const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) {
      console.error('Failed to fetch inventory:', error);
    } else {
      setInventoryOptions(data || []);
    }
  };
  fetchInventory();
}, []);


  const handleInventoryChange = (index: number, field: string, value: string) => {
    const updatedItems = [...inventoryItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'particulars') {
      value = value.toUpperCase()
    }
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'particulars') {
      const matchingItem = inventory.find(item => item.particulars.toLowerCase() === value.toLowerCase())
      if (matchingItem) {
        updatedItems[index].price = matchingItem.salesPrice.toString()
        updatedItems[index].qty = matchingItem.setQty.toString()

      }
      
    }
    
    if (field === 'serial') {
      const serial = parseInt(value)
      const matchedInventory = inventory[serial - 1] // assuming S.No is index + 1
    
      if (matchedInventory) {
        updatedItems[index] = {
          ...updatedItems[index],
          serial: value,
          particulars: matchedInventory.particulars,
          qty: matchedInventory.setQty,
          price: matchedInventory.salesPrice,
          amount: parseFloat(matchedInventory.setQty) * parseFloat(matchedInventory.salesPrice)
        }
      } else {
        // clear if not matched
        updatedItems[index] = {
          ...updatedItems[index],
          serial: value,
          particulars: '',
          qty: '',
          price: '',
          amount: 0
        }
      }
    }
    
    if (field === 'particulars') {
      const matchingItem = inventory.find(item =>
        item.particulars.toLowerCase() === value.toLowerCase()
      );
    
      if (matchingItem) {
        const serialNo = inventory.findIndex(item => item.particulars === matchingItem.particulars) + 1;
    
        updatedItems[index] = {
          ...updatedItems[index],
          serial: serialNo.toString(), // <-- SET SERIAL NO
          particulars: matchingItem.particulars,
          price: matchingItem.salesPrice.toString(),
          qty: matchingItem.setQty.toString(),
          amount: parseFloat(matchingItem.salesPrice) * parseFloat(matchingItem.setQty)
        };
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          serial: '',
          particulars: value.toUpperCase()
        };
      }
    }
    
    
    if (field === 'qty' || field === 'price') {
      const qty = parseFloat(updatedItems[index].qty) || 0
      const price = parseFloat(updatedItems[index].price) || 0
      updatedItems[index].amount = qty * price
    }
    
    setInventoryItems(updatedItems)

    if (index === inventoryItems.length - 1 && field === 'particulars'  && value !== '' /*&& !isNaN(parseFloat(value))*/) {
      addInventoryItem()
      
    }

    // if (field === 'particulars') {
    //   setSearchTerm(value)
    //   setActiveItemIndex(index)
    // }
    
    

  }

  const handleSelectItem = (invItem: InventoryItem, index: number) => {
    const updated = [...inventoryItems];
    updated[index].particulars = invItem.particulars;
    updated[index].qty = invItem.setQty?.toString() || '';
    updated[index].price = invItem.salesPrice?.toString() || '';
    setInventoryItems(updated);
  };
  
  const handleSerialNoInput = (value: string, index: number) => {
    const updated = [...inventoryItems];
    updated[index].serial = value;
  
    // Match by s.no from inventoryList
    const matched = inventoryOptions.find((inv) => inv.sno?.toString() === value);
  
    if (matched) {
      updated[index].particulars = matched.particulars;
      // updated[index].qty = matched.salesQty?.toString() || '';
      updated[index].price = matched.salesPrice?.toString() || '';
    }
  
    setInventoryItems(updated);
  };
  

  // const handleSelectItem = (selectedItem: InventoryItem) => {
  //   if (activeItemIndex !== null) {
  //     const updatedItems = [...inventoryItems]
  //     updatedItems[activeItemIndex] = {
  //       ...updatedItems[activeItemIndex],
  //       particulars: selectedItem.particulars,
  //       price: selectedItem.salesPrice.toString(),
  //       qty: selectedItem.setQty.toString()

  //     }
      
  //     setInventoryItems(updatedItems)
  //     setSearchTerm(selectedItem.particulars)
  //     setFilteredInventory([])
  //     setActiveItemIndex(null)
  //   }
  // }

  // const handleSelectItem = (selectedItem: InventoryItem) => {
  //   if (activeItemIndex !== null) {
  //     const qty = parseFloat(selectedItem.setQty) || 0
  //     const price = parseFloat(selectedItem.salesPrice) || 0
  //     const amount = qty * price

  //     const updatedItems = [...inventoryItems]
  //     updatedItems[activeItemIndex] = {
  //       ...updatedItems[activeItemIndex],
  //       particulars: selectedItem.particulars,
  //       price: price.toString(),
  //       qty: qty.toString(),
  //       amount: amount
  //     }
      
  //     setInventoryItems(updatedItems)
  //     setSearchTerm(selectedItem.particulars)
  //     setFilteredInventory([])
  //     setActiveItemIndex(null)
  //   }
  // }



  const addInventoryItem = () => {
    setInventoryItems(prevItems => [
      ...prevItems,
      { serial: '', sno: prevItems.length + 1, particulars: 'SAREES', hsn: '5407', qty: '', price: '', amount: 0 }
    ])
  }



  // const deleteRow = (index: number) => {
  //   if (inventoryItems.length > 1) {
  //     const updatedItems = inventoryItems.filter((_, i) => i !== index)
  //     updatedItems.forEach((item, i) => item.sno = i + 1)
  //     setInventoryItems(updatedItems)
  //   }
  // }

  // const deleteRow = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
  //   e.preventDefault() // Prevent the default form submission
  //   if (inventoryItems.length > 1) {
  //     const updatedItems = inventoryItems.filter((_, i) => i !== index)
  //     updatedItems.forEach((item, i) => item.sno = i + 1)
  //     setInventoryItems(updatedItems)
  //   }
  // }

  const deleteRow = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault()
    if (inventoryItems.length > 1) {
      const updatedItems = inventoryItems.filter((_, i) => i !== index)
      updatedItems.forEach((item, i) => item.sno = i + 1)
      setInventoryItems(updatedItems)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (e.type === 'click') {
      deleteRow(e, index);
    }
  };


  // const calculateTotals = () => {
  //   const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)
  //   const subtotal = validItems.reduce((sum, item) => sum + item.amount, 0)
  //   const totalQuantity = validItems.reduce((sum, item) => sum + parseFloat(item.qty), 0)
  //   const gst = subtotal * 0.05
  //   const grandTotal = subtotal + gst

  //   const totalPaid = formData.payments?.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0) || 0

  //   // Balance amount
  //   const balance = grandTotal - totalPaid
  

  //   return { subtotal, gst, grandTotal, totalQuantity, balance, totalPaid}
  // }

const calculateTotals = () => {
  const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0);
  const subtotal = validItems.reduce((sum, item) => sum + item.amount, 0);
  const gst = includeGST ? subtotal * 0.05 : 0;
  const grandTotal = subtotal + gst;
  const totalPaid = formData.payments?.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0) || 0;
  const balance = grandTotal - totalPaid;

  return { subtotal, gst, grandTotal, totalQuantity: validItems.reduce((sum, item) => sum + parseFloat(item.qty), 0), balance, totalPaid };
};
  

  // const handleSave = () => {
  //   if (formData.phone1.length !== 10 || (formData.phone2 && formData.phone2.length !== 10)) {
  //     toast.warn('One or more phone numbers are not 10 digits long. The data will be saved, but please verify the phone numbers.')
  //   }

  //   const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)

  //   const invoice: Invoice = {
  //     id: isEditing ? editingId! : uuidv4(),
  //     type: invoiceType,
  //     ...formData,
  //     date: formData.date,
  //     customer: formData.customer.toUpperCase(),
  //     address: formData.address.toUpperCase(),
  //     gstNo: formData.gstNo.toUpperCase(),
  //     transport: formData.transport.toUpperCase(),
  //     items: validItems.map(item => ({
  //       ...item,
  //       particulars: item.particulars.toUpperCase(),
  //       qty: item.qty,
  //       price: item.price,
  //       amount: parseFloat(item.amount.toFixed(2))
  //     })),
  //     ...calculateTotals()
  //   }

  //   if (isEditing) {
  //     updateInvoice(invoice)
  //     toast.success('Invoice updated successfully!')
  //   } else {
  //     saveInvoice(invoice)
  //     toast.success('Invoice saved successfully!')
  //     setIsEditing(true)
  //     setEditingId(invoice.id)
  //   }   
  // }

  // const handleSave = async () => {

  // // if (!user) {
  // //     toast.error('Please sign in to save invoices')
  // //     return
  // //   }

  //   if (formData.phone1.length !== 10 || (formData.phone2 && formData.phone2.length !== 10)) {
  //     toast.warn('One or more phone numbers are not 10 digits long. The data will be saved, but please verify the phone numbers.')
  //   }

  //   const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)

  //   const invoice: Invoice = {
  //     id: isEditing ? editingId! : uuidv4(),
  //     type: invoiceType,
  //     ...formData,
  //     date: formData.date,
  //     customer: formData.customer.toUpperCase(),
  //     address: formData.address.toUpperCase(),
  //     gstNo: formData.gstNo.toUpperCase(),
  //     transport: formData.transport.toUpperCase(),
  //     items: validItems.map(item => ({
  //       ...item,
  //       particulars: item.particulars.toUpperCase(),
  //       qty: item.qty,
  //       price: item.price,
  //       amount: parseFloat(item.amount.toFixed(2))
  //     })),
  //     ...calculateTotals()
  //   }

  //   try {
  //     if (navigator.onLine) {
  //       if (isEditing) {
  //         await updateInvoice(invoice)
  //         toast.success('Invoice updated successfully!')
  //       } else {
  //         await saveInvoice(invoice)
  //         toast.success('Invoice saved successfully!')
  //       }
  //       setIsEditing(true)
  //       setEditingId(invoice.id)
  //     } else {
  //       saveOfflineInvoice(invoice)
  //       toast.info('Invoice saved offline. It will be synced when you\'re back online.')
  //     }
  //   } catch (error) {
  //     console.error('Error saving invoice:', error)
  //     if (error instanceof Error) {
  //       toast.error(`Failed to save invoice: ${error.message}`)
  //     } else {
  //       toast.error('Failed to save invoice. Please try again.')
  //     }
  //   }
  // }

  // const handleSave = async () => {
  //   // if (!isAuthenticated) {
  //   //   toast.error('Not authenticated. Please try again later.')
  //   //   return
  //   // }

  //   // if (!validateForm()) {
  //   //   return
  //   // }

  //   setIsLoading(true)
  //   try {
  //     const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)
  //     const { subtotal, gst, grandTotal } = calculateTotals()

      

  //     const invoice: Invoice = {
  //       id: isEditing ? editingId! : uuidv4(),
  //       type: invoiceType,
  //       ...formData,
  //       customer: formData.customer.toUpperCase(),
  //       address: formData.address?.toUpperCase(),
  //       gstNo: formData.gstNo?.toUpperCase(),
  //       transport: formData.transport?.toUpperCase(),
  //       payments: formData.payments,
  //       totalPaid: formData.payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0),
  //       items: validItems.map(item => ({
  //         ...item,
  //         serialno: item.serial,
  //         particulars: item.particulars.toUpperCase(),
  //         amount: parseFloat(item.amount.toFixed(2))
  //       })),
  //       subtotal,
  //       gst,
  //       grandTotal,
  //    }

  //     // await saveInvoice(invoice); // Save locally
  //     // await sendToGoogleSheets(invoice); // Push to Google Sheets


  //     console.log('Saving invoice:', invoice)

  //     if (isEditing) {
  //       await updateInvoice(invoice)
  //       toast.success('Invoice updated successfully!')
  //     } else {
  //       await saveInvoice(invoice)
  //       toast.success('Invoice saved successfully!')
  //       setIsEditing(true)
  //       setEditingId(invoice.id)
  //     }
  //   } catch (error) {
  //     console.error("Failed to save invoice:", error)
  //     if (error instanceof Error) {
  //       toast.error(`Failed to save invoice: ${error.message}`)
  //     } else {
  //       toast.error('An unknown error occurred while saving the invoice')
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }

    
  // }



useEffect(() => {
  const handleOnline = async () => {
    try {
      await syncOfflineInvoices()
      toast.success('Offline invoices synced successfully!')
    } catch (error) {
      console.error('Failed syncing offline invoices:', error)
    }
  }

  window.addEventListener('online', handleOnline)

  return () => {
    window.removeEventListener('online', handleOnline)
  }
}, [])





  const handleSave = async () => {
    setIsLoading(true)
    try {
      const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)
      const { subtotal, gst, grandTotal } = calculateTotals()
  
      const invoice: Invoice = {
        id: isEditing ? editingId! : uuidv4(),

        type: invoiceType,
        ...formData,
        synced: false,
        customer: formData.customer.toUpperCase(),
        address: formData.address?.toUpperCase(),
        gstNo: formData.gstNo?.toUpperCase(),
        transport: formData.transport?.toUpperCase(),
        payments: formData.payments,
        totalPaid: formData.payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0),
        items: validItems.map(item => ({
          ...item,
          serialno: item.serial,
          particulars: item.particulars.toUpperCase(),
          amount: parseFloat(item.amount.toFixed(2))
        })),
        subtotal,
        gst,
        grandTotal,
        includeGST, 


      }
  
      if (navigator.onLine) {
        if (isEditing) {
          await updateInvoiceOnline(invoice)
          toast.success('Invoice updated online!')
          await saveInvoiceInventoryItems(validItems, invoice.type, invoice.date);  // ✅ update inventory



        } else {
          await saveInvoiceOnline(invoice)
          toast.success('Invoice saved online!')
          // await saveInvoiceInventoryItems(validItems, invoice.type, invoice.date);
          fetchLastBillNo(); // ⬅️ Automatically reload last bill no
        }
      } else {
        await saveInvoiceOffline(invoice)
        toast.info('Invoice saved offline. It will sync later.')
      }
  
      setIsEditing(true)
      setEditingId(invoice.id)
  
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save invoice.')
    } finally {
      setIsLoading(false)
    }
  }
  



  // const sendToGoogleSheets = async (invoice: Invoice): Promise<void> => {
  //   try {
  //     const response = await fetch('https://script.google.com/macros/s/AKfycbz95KtrveJvCVC1WEldKeiOFuyN4yV0ZLIdId8W1rOmikwF8S4boSRPErmIjo28DMCqlQ/exec', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(invoice),
  //       mode: 'no-cors',
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.status}`);
  //     }
  
  //     const result = await response.text();
  //     alert(`Saved successfully: ${result}`);
  //   } catch (error) {
  //     console.error('Failed to send invoice:', error);
  //     alert('Failed to save invoice.');
  //   }
  // };
  

 


  // const handleClear = () => {
  //   const nextBillNo = getNextBillNumber(invoiceType)
  //   setFormData({
  //     billNo: nextBillNo,
  //     date: new Date().toISOString().split('T')[0], // Set today's date as default
  //     customer: '',
  //     bookno: '',
  //     phone1: '',
  //     phone2: '',
  //     address: '',
  //     gstNo: '',
  //     transport: '',
  //     lrDate: '',
  //     lrNo: '',
  //     bale: null,
  //   })
  //   setInventoryItems([{ sno: 1, particulars: 'SAREES', hsn: '5407', qty: '', price: '', amount: 0 }])
  //   setIsEditing(false)
  //   setEditingId(null)
  // }

  const handleClear = async () => {
    const nextBillNo = invoiceType;
    setFormData({
      billNo: nextBillNo,
      date: new Date().toISOString().split('T')[0], // Set today's date as default
      customer: '',
      bookno: '',
      phone1: '',
      phone2: '',
      address: '',
      gstNo: '',
      transport: '',
      lrDate: '',
      lrNo: '',
      bale: null,
      payments: [{ mode: '', amount: '' }], // multiple payments
    });
    setInventoryItems([{serial: '', sno: 1, particulars: 'SAREES', hsn: '5407', qty: '', price: '', amount: 0 }]);
    setIsEditing(false);
    setEditingId(null);
  };



  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }
  
  

  // const generatePDF = async (data:PDFData) => {
    const generatePDF = async (data: PDFData, includeGST: boolean) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    
    // Adding the image
    // const imgUrllogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20241020_125834-djfIbSuTLOn5ssynQLf8PAYpIYqoGn.jpg'
    const imgUrllogo = `${data.logoDataUrl}`
    const imgWidth = 28
    const imgHeight = 28

    doc.addImage(imgUrllogo, 'JPEG', 160, 12, imgWidth, imgHeight)

    // const imgUrlscn = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2024-10-20-12-57-17-650_com.microsoft.office.word-SdNpWiDoXImZjSEXNvk7s1IF4tClPa.png'
    const imgUrlscn = `${data.paymentDataUrl}`
    const imgWidthscn = 30
    const imgHeightscn = 30

    const imageUrlgp = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_24-12-12_02-47-13-453.jpg-U2oSbi8RcKcBUQMA7L6c9SQGbRiEEz.jpeg';
    const imgwdgp = 15
    const imghtgp = 10

    // doc.addImage(imgUrlscn, 'JPEG', 70, 226, imgWidthscn, imgHeightscn)

    // Company details
    const header = () => {
      doc.setFontSize(13)
      doc.text(`Phone no: ${data.phone}`, 180, 10, { align: 'center' })
      doc.setFontSize(32)
      doc.setFont("times", "bold")
      doc.text(`${data.name}`, 105, 15, { align: 'center' })
      doc.setFontSize(12)
      doc.setTextColor(15, 15, 15)
      doc.text(`${data.address1}`, 105, 22, { align: 'center' })
      doc.text(`${data.address2}`, 105, 27, { align: 'center' })
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      // doc.text(`GSTIN : ${data.gst}`, 36, 32, { align: 'center' })
      // doc.text(`Pan No : ${data.pan}`, 30, 37, { align: 'center' })
      if (includeGST) {
      doc.text(`GSTIN : ${data.gst}`, 36, 32, { align: 'center' })
      doc.text(`Pan No : ${data.pan}`, 30, 37, { align: 'center' })
    }
      doc.setFontSize(18)
      doc.setTextColor(252, 33, 18)
      doc.setFont("times", "bold")
      // doc.text('TAX INVOICE', 105, 37, { align: 'center' })
      doc.text(includeGST ? 'TAX INVOICE' : 'INVOICE', 105, 37, { align: 'center' })


      // Customer details
      const addressLines = doc.splitTextToSize(`${formData.address}`, 180)

      doc.line(10, 76, 200, 76)
      doc.line(10, 40, 200, 40)

      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 15, 15)
      doc.text(`Name: `, 10, 50)
      doc.text(`${formData.customer}`, 85, 50, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`Address: `, 10, 57)
      // doc.text(splitAddress, 85, 57, { align: 'center' })
      doc.setTextColor(252, 33, 18) // Red
    doc.text(`${addressLines[0] || ''}`, 87, 57, { align: 'center' })
    doc.setTextColor(128, 0, 128) // Purple
    doc.text(addressLines[1] || '', 87, 62, { align: 'center' })
    doc.setTextColor(15, 15, 15) // Black
    doc.text(addressLines[2] || '', 87, 67, { align: 'center' })
    doc.setTextColor(15, 15, 15)
    doc.setFont("helvetica", "normal")
      doc.text(`Bill No:`, 150, 50)
      doc.text(`${formData.billNo}`, 180, 50, { align: 'center' })
      doc.text(`Date:`, 150, 57)
      doc.text(`${formatDate(formData.date)}`, 180, 57, { align: 'center' })
      doc.text(`Book No:`, 150, 63)
      doc.text(`${formData.bookno}`, 180, 63, { align: 'center' })
      doc.text(`GST No:`, 10, 74)
      doc.text(`${formData.gstNo}`, 55, 74, { align: 'center' })
      doc.text(`Phone:`, 90, 74)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 0, 0)
      doc.text(`${formData.phone1 || ''}`, 120, 74, { align: 'center' })
      doc.text(` ${formData.phone2 || ''}`, 160, 74, { align: 'center' })
      doc.setFont("helvetica", "normal")
      doc.setTextColor(15, 15, 15)
      doc.text(`Transport:`, 10, 84)
      doc.text(`${formData.transport}`, 75, 84, { align: 'center' })
      doc.text(`Bale No:`, 10, 90)
      doc.text(`${formData.bale || ''}`, 40, 90, { align: 'center' })
      doc.text(`LR Date:`, 140, 84)
      doc.text(`${formData.lrDate}`, 175, 84, { align: 'center' })
      doc.text(`LR No:`, 140, 90)
      doc.text(`${formData.lrNo}`, 175, 90, { align: 'center' })
      
    }

    header()

    // Inventory table
    const startY = 100
    const rowHeight = 6
    let currentY = startY

    // Draw the table header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text('S.No', 10, currentY)
    doc.text('Particular', 60, currentY, { align: 'center' })
    doc.text('HSN', 100, currentY)
    doc.text('Quantity', 125, currentY)
    doc.text('Price', 150, currentY)
    doc.text('Total', 175, currentY)
    currentY += rowHeight

    doc.line(10, 95, 200, 95)
    doc.line(10, 103, 200, 103)

    const validItems = inventoryItems.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)

    // Loop through the rows manually
    for (let i = 0; i < validItems.length; i++) {

    // for (let i = 0; i < inventoryItems.length; i++) {
      if (i > 0 && i % 15 === 0) {
        doc.addPage()
        currentY = startY
        header()
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text('S.No', 10, currentY)
        doc.text('Particular', 60, currentY, { align: 'center' })
        doc.text('HSN', 100, currentY)
        doc.text('Quantity', 125, currentY)
        doc.text('Price', 150, currentY)
        doc.text('Total', 175, currentY)
        currentY += rowHeight

        doc.line(10, 95, 200, 95)
        doc.line(10, 103, 200, 103)
      }

      const item = validItems[i]
      // const item = inventoryItems[i]
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text(item.sno.toString(), 15, currentY + 1, { align: 'center' })
      doc.text(item.particulars || 'SAREE', 60, currentY + 1, { align: 'center' })
      doc.text(item.hsn.toString(), 105, currentY + 1, { align: 'center' })
      doc.text(item.qty.toString(), 133, currentY + 1, { align: 'center' })
      doc.text(item.price.toString(), 155, currentY + 1, { align: 'center' })
      doc.text(item.amount.toFixed(), 180, currentY + 1, { align: 'center' })

      currentY += rowHeight

      // if (i === inventoryItems.length - 1 || (i + 1) % 15 === 0) {
        if (i === validItems.length - 1 || (i + 1) % 15 === 0) {

        footer()
      }
    }

    const { subtotal, gst, grandTotal } = calculateTotals()
    // const totalQuantity = inventoryItems.reduce((sum, item) => sum + Number(item.qty), 0);
    const totalQuantity = validItems.reduce((sum, item) => sum +  parseFloat(item.qty), 0)


    // Footer function
    function footer() {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.line(10, 193, 200, 193)

      // Bank details
      doc.addImage(imgUrlscn, 'JPEG', 65, 220, imgWidthscn, imgHeightscn)
            doc.addImage(imageUrlgp, 'JPEG', 48, 240, imgwdgp, imghtgp)

      doc.line(10, 200, 200, 200)
      doc.text('Bank Details :', 10, 206, { align: 'left' })
      doc.text(`A/C Name : ${data.acName}`, 10, 214, { align: 'left' })
      doc.text(`Bank : ${data.bankname}`, 10, 220, { align: 'left' })
      doc.text(`A/C No : ${data.acNo}`, 10, 226, { align: 'left' })
      doc.text(`IFSC : ${data.ifsc}`, 10, 232, { align: 'left' })
      doc.text(`Branch : ${data.branch}`, 10, 238, { align: 'left' })
      doc.setTextColor(255, 0, 0)
      doc.text('ONLINE PAYMENTS', 10, 244, { align: 'left' })
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 15, 15)
      doc.setFontSize(13)
      doc.text(`${data.paymentPhone}`, 10, 250, { align: 'left' })
      doc.line(100, 200, 100, 252)
      doc.line(10, 252, 200, 252)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`For ${data.name}`, 170, 257, { align: 'center' })
      doc.line(150, 266, 190, 266)
      doc.text('Authorised Signatory:', 170, 270, { align: 'center' })


      // Terms and conditions section
      doc.setFontSize(12)
      doc.line(10, 272, 200, 272)
      doc.text('TERMS AND CONDITIONS :', 10, 276, { align: 'left' })
      const text2 = doc.splitTextToSize('1. Any claims for damages, shortages, or incorrect items must be made within 7 days of receipt. Unauthorized returns will not be accepted.', 120)
      const text3 = doc.splitTextToSize('2. The buyer is responsible for shipping costs unless otherwise stated. Risk of loss passes to the buyer upon dispatch of goods.', 120)
      doc.setFontSize(8)
      doc.text(text2, 10, 281)
      doc.text(text3, 10, 290)

      // Greeting
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text('Thank you for your business !', 110, 277, { align: 'left' })
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text(`Email: ${data.email}`, 110, 282, { align: 'left' })
      doc.text(`Facebook: ${data.facebook}`, 110, 287, { align: 'left' })
      doc.text(`Youtube: ${data.youtube}`, 110, 292, { align: 'left' })

    }

    footer()
    doc.setFontSize(11)
    doc.setTextColor(15, 15, 15)
    doc.text(`Total Quantity: ${totalQuantity}`, 100, 198)
    // doc.text(`Subtotal  :`, 100, 224)
    doc.text(`${subtotal.toFixed()}`, 180, 198, { align: 'center' })
    // doc.text(`GST (5%) `, 105, 210)
    // doc.text(`${gst.toFixed()}`, 180, 210, { align: 'center' })
    if (includeGST) {
      doc.text(`GST (5%) `, 105, 210);
      doc.text(`${gst.toFixed()}`, 180, 210, { align: 'center' });
    }  
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`Grand Total `, 105, 230)
    doc.setFontSize(18)
    doc.text(`${grandTotal.toFixed()}`, 180, 230, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.line(100, 235, 200, 235)
    //doc.text(`Amount in Words: ${numberToWords(Math.round(grandTotal))}`, 102, 240)
    const Amtinword = doc.splitTextToSize(`Amount in Words: ${numberToWords(Math.round(grandTotal))}`, 100)
    doc.text(Amtinword, 102, 240)


    // Save the PDF
    // doc.save(`${invoiceType}-invoice-${formData.billNo}.pdf`)

  
     // Open PDF in a new tab instead of download
     // if download pdf you delete this line and add below download 
    // window.open(doc.output('bloburl'), '_blank')

    const pdfOutput = doc.output('datauristring')
    // const pdfUrl = URL.createObjectURL(pdfOutput);
    


    // const pdfUrl = URL.createObjectURL(pdfOutput)
    // window.open(pdfUrl, '_blank')

    return pdfOutput
    
  }

  
  const [isLoading, setIsLoading] = useState(false);

  const sharePDF = async (data:PDFData) => {
    setIsLoading(true);
    try {
      const pdfBase64 = generatePDF(data, includeGST);

      if (Capacitor.isNativePlatform()) {
        const fileName = `${invoiceType}-invoice-${formData.billNo}.pdf`;
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: (await pdfBase64).split(',')[1],
          directory: Directory.Cache
        });

        await Share.share({
          title: 'Invoice',
          text: 'Here is your invoice',
          url: savedFile.uri,
          dialogTitle: 'Share Invoice',
        });
      } else {
        // Web browser sharing
        if (navigator.share) {
          const blobPdf = await fetch(await pdfBase64).then(res => res.blob());
          const file = new File([blobPdf], 'invoice.pdf', {type: 'application/pdf'});
          await navigator.share({
            title: 'Invoice',
            text: 'Here is your invoice',
            files: [file],
          });
        } else {
          alert('Sharing is not supported on this browser.');
          toast.warn('Sharing not supported');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Error sharing the invoice. Please try again.');
      toast.warn('Error sharing the invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (data:PDFData) => {
    setIsLoading(true);
    try {
      const pdfBase64 = generatePDF(data, includeGST);

      if (Capacitor.isNativePlatform()) {
        const fileName = `${invoiceType}-invoice-${formData.billNo}.pdf`;
        await Filesystem.writeFile({
          path: fileName,
          data: (await pdfBase64).split(',')[1],
          directory: Directory.Documents
        });
        alert(`Invoice saved to Documents/${fileName}`);
      } else {
        // Web browser download
        const blob = await fetch(await pdfBase64).then(res => res.blob());
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invoiceType}-invoice-${formData.billNo}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Error downloading the invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!businessProfile) {
      toast.warn("Business profile not loaded yet.");
      return;
    }
  
    try {
      const dataUriString = await generatePDF(businessProfile, includeGST); // still returns string
  
      const response = await fetch(dataUriString);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const printWindow = window.open(blobUrl, '_blank');
      printWindow?.addEventListener('load', () => {
        printWindow?.print();
      });
    } catch (error) {
      console.error("Print failed:", error);
      toast.error("Failed to generate printable PDF.");
    }
  };
  



  
  // const sendPDFViaWhatsApp = async () => {
  //   setIsLoading(true);
  //   try {
  //     const pdfBase64 = generatePDF();
  //     const phoneNumber = formData.phone1.replace(/\D/g, ''); // Remove non-digit characters

  //     if (!phoneNumber) {
  //       throw new Error('Phone number is required');
  //     }

  //     if (Capacitor.isNativePlatform()) {
  //       const fileName = `${invoiceType}-invoice-${formData.billNo}.pdf`;
  //       const savedFile = await Filesystem.writeFile({
  //         path: fileName,
  //         data: pdfBase64.split(',')[1],
  //         directory: Directory.Cache
  //       });

  //       await Share.share({
  //         title: 'Invoice',
  //         text: 'Here is your invoice',
  //         url: savedFile.uri,
  //         dialogTitle: 'Send Invoice via WhatsApp',
  //       });
  //     } else {
  //       // For web browsers, open WhatsApp web with pre-filled message and attached PDF
  //       const blob = await fetch(pdfBase64).then(res => res.blob());
  //       const file = new File([blob], `${invoiceType}-invoice.pdf`, {type: 'application/pdf'});
  //       const formData = new FormData();
  //       formData.append('file', file);
  //       formData.append('phone', phoneNumber);
  //       formData.append('text', 'Here is your invoice');

  //       // You need to set up a server endpoint to handle this request and forward it to WhatsApp Business API
  //       const response = await fetch('/api/send-whatsapp', {
  //         method: 'POST',
  //         body: formData
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to send WhatsApp message');
  //       }
  //     }
  //     toast.success('Invoice sent to WhatsApp successfully!');
  //   } catch (error) {
  //     console.error('Error sending PDF via WhatsApp:', error);
  //     toast.error(error instanceof Error ? error.message : 'Error sending the invoice via WhatsApp. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  



  
  
  // Helper function to convert number to words
  function numberToWords(num: number) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

    if (num === 0) return 'Zero'

    function convertLessThanOneThousand(n: number): string {
      if (n < 10) return ones[n]
      if (n < 20) return teens[n - 10]
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanOneThousand(n % 100) : '')
    }

    let result = ''
    if (num >= 10000000) {
      result += convertLessThanOneThousand(Math.floor(num / 10000000)) + ' Crore '
      num %= 10000000
    }
    if (num >= 100000) {
      result += convertLessThanOneThousand(Math.floor(num / 100000)) + ' Lakh '
      num %= 100000
    }
    if (num >= 1000) {
      result += convertLessThanOneThousand(Math.floor(num / 1000)) + ' Thousand '
      num %= 1000
    }
    if (num > 0) {
      result += convertLessThanOneThousand(num)
    }

    return result.trim()
  }

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (filteredInventory.length > 0) {
  //     switch (e.key) {
  //       case 'ArrowDown':
  //         e.preventDefault()
  //         setSelectedItemIndex(prev => (prev + 1) % filteredInventory.length)
  //         break
  //       case 'ArrowUp':
  //         e.preventDefault()
  //         setSelectedItemIndex(prev => (prev - 1 + filteredInventory.length) % filteredInventory.length)
  //         break
  //       case 'Enter':
  //         e.preventDefault()
  //         handleSelectItem(filteredInventory[selectedItemIndex])
  //         break
  //     }
  //   }
  // }
  
  
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
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8 drop-shadow">Invoice App</h1>

 <ToastContainer
  position="top-center" // still needed for internal logic
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
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    pointerEvents: 'none',
  }}
/>

  
        

       
        <div className="flex justify-end space-x-2">
        {/* <div className="flex space-x-2">
          <button
            // onClick={() => setInvoiceType('sale')}
            onClick={handleSaleReceiptClick}
            className={`px-4 py-2 rounded ${invoiceType === 'sale' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sales Receipt
          </button>
          <button
            // onClick={() => setInvoiceType('purchase')}
            onClick={handlePurchaseReceiptClick}
            className={`px-4 py-2 rounded ${invoiceType === 'purchase' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Purchase Receipt
          </button>
        </div> */}

      <h2 className="text-2xl font-bold text-center mb-4">
        {invoiceType === 'sale' ? 'Sales Receipt' : 'Purchase Receipt'}
      </h2>



       {/* <OnlineStatus /> */}
        </div>

        

        {/* ... (rest of the JSX) */}

        <div className="flex space-x-2 ">
          <button type="button" onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {/* <button type="button" onClick={handleClear} className="bg-green-500 text-white px-4 py-2 rounded">Clear</button> */}
          <button type="button" onClick={handleClear} className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded hover:bg-blue-600">
            <FaEraser  className="w-4 h-4" />
            </button>


          {/* ... (other buttons) */}
        </div>


        
            <button type="button" onClick={fetchLastBillNo} className="flex justify-end space-x-2">
            🗘
            </button>
      <form className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
              {/* Form fields */}
              {previousBillNo !== null && (
        <p className="text-sm text-gray-500 mb-1">
          Last Bill No: <span className="font-semibold">{previousBillNo}</span>
        </p>
              )}
             
       

        <div className="grid grid-cols-2 gap-4">
          <input name="billNo" value={formData.billNo} onChange={handleFormChange} placeholder="Bill No" className="border p-2" />
          <input id="date" name="date" type="date" value={formData.date} onChange={handleFormChange} className="border p-2" />
          <input name="customer" value={formData.customer} onChange={handleFormChange} placeholder="Customer" className="border p-2" />
          <input name="bookno" value={formData.bookno} onChange={handleFormChange} placeholder="Book No" className="border p-2" />
          <input name="phone1" value={formData.phone1 ?? ''} onChange={handleFormChange} placeholder="Phone No." className="border p-2" />
          <input name="phone2" value={formData.phone2 ?? ''} onChange={handleFormChange} placeholder="Alternative No." className="border p-2" />
          {/* <input name="address" maxLength={125} value={formData.address} onChange={handleFormChange} placeholder="Address" className="border p-2" /> */}
          <textarea
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            placeholder="Address"
            className="border p-2 w-full"
            rows={3}
            maxLength={136}
          />

          <input name="gstNo" value={formData.gstNo} onChange={handleFormChange} placeholder="GST No" className="border p-2" />
          <input name="transport" value={formData.transport} onChange={handleFormChange} placeholder="Transport" className="border p-2" />
          <input name="lrDate" type="date" value={formData.lrDate} onChange={handleFormChange} className="border p-2" />
          <input name="lrNo" value={formData.lrNo} onChange={handleFormChange} placeholder="LR No" className="border p-2" />
          <input name="bale" type="number" value={formData.bale ?? ''} onChange={handleFormChange} placeholder="Bale" className="border p-2" />
        </div>


  


        {/* Inventory table */}
        
        {/* <div className="overflow-x-auto"> */}

        <table className="min-w-full">
          <thead>
            <tr>
            <th className="border p-2">BCo</th>
              <th className="border p-2">SN</th>
              <th className="border px-10 py-1">Particulars</th>
              <th className="border p-2 hidden px-2 py-1">HSN</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                <input
                  type="number"
                  value={item.serial}
                  onChange={(e) => handleSerialNoInput(e.target.value, index)}
                  className="border p-2 w-8"
                />
              </td>

                <td className="border p-2">{item.sno}</td>


    <td className=" border border-gray-300 px-2 py-1">
            {/* <td className="border p-2"> */}
     <div className="relative">
     <input
  value={item.particulars}
  onChange={(e) => {
    handleInventoryChange(index, 'particulars', e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventoryOptions.filter(inv =>
      inv.particulars.toLowerCase().includes(searchTerm)
    );
    setFilteredInventory(filtered);
    setShowDropdown(true);
  }}
  onFocus={() => {
    setActiveItemIndex(index);
    const searchTerm = item.particulars.toLowerCase();
    const filtered = inventoryOptions.filter(inv =>
      inv.particulars.toLowerCase().includes(searchTerm)
    );
    setFilteredInventory(filtered);
    setShowDropdown(true);
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 💥 Prevent the form from submitting or row deleting
      if (filteredInventory[selectedItemIndex]) {
        const selected = filteredInventory[selectedItemIndex];
        handleSelectItem(selected, index);
        setShowDropdown(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedItemIndex((prev) => Math.min(prev + 1, filteredInventory.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedItemIndex((prev) => Math.max(prev - 1, 0));
    }
  }}
  className="w-full border p-2"
/>

{showDropdown && activeItemIndex === index && filteredInventory.length > 0 && (
  <Card className="absolute z-10 w-full mt-2 bg-white shadow">
    <CardContent className="p-0">
      <ul className="max-h-40 overflow-y-auto">
        {filteredInventory.map((invItem, idx) => (
          <li
            key={idx}
            className={`cursor-pointer p-2 hover:bg-gray-100 ${
              idx === selectedItemIndex ? 'bg-gray-200' : ''
            }`}
            onMouseDown={() => {
              handleSelectItem(invItem, index);
              setShowDropdown(false);
            }}
          >
            {invItem.particulars}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)}

    


                      {/* <input
                        value={item.particulars}
                        onChange={(e) => handleInventoryChange(index, 'particulars', e.target.value)}
                        onFocus={() => setActiveItemIndex(index)}
                        onKeyDown={handleKeyDown}

                      />
                      {activeItemIndex === index && filteredInventory.length > 0 && (
                        <Card className="absolute z-10 w-full mt-2">whats
                          <CardContent className="p-0">
                            <ul className="max-h-40 overflow-y-auto">
                              {filteredInventory.map((invItem, idx) => (
                                <li
                                  key={idx}
                                  className="cursor-pointer hover:bg-gray-100 p-2"
                                  onClick={() => handleSelectItem(invItem)}
                                  onMouseDown={() => {
                                    setSelectedItemIndex(idx)
                                    // handleInventoryChange(index, 'particulars', invItem.particulars)
                                    // handleInventoryChange(index, 'price', invItem.salesPrice.toString())
                                    // setShowDropdown(false)
                                  }}
                                >
                                  {invItem.particulars}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )} */}
                    </div>
                </td>
                <td className="border p-2 hidden">
                  <input
                    value={item.hsn}
                    onChange={(e) => handleInventoryChange(index, 'hsn', e.target.value)}
                    className="w-full min-w-[5ch]"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleInventoryChange(index, 'qty', e.target.value)}
                    className="w-full min-w-[4ch]"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleInventoryChange(index, 'price', e.target.value)}
                    className="w-full min-w-[4ch]"
                  />
                </td>
                <td className="border p-2">{item.amount.toFixed(2)}</td>

                <td className="border px-1 py-1">
                <button className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                type="button" // ✅ This prevents accidental form submission
                onClick={(e) => handleDeleteClick(e, index)}
                disabled={inventoryItems.length === 1}
                >
        <FaMinus className="w-1 h-1" />
      

      </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </div> */}
        
        <button type="button" onClick={addInventoryItem} className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        <FaPlus className="w-4 h-4" />
        </button>

        {/* Totals */}
        {/* <div className="space-y-2 w-full border-collapse border">
          <p>Total Qty: {calculateTotals().totalQuantity.toFixed()}</p>
          <p>Sub Total: {calculateTotals().subtotal.toFixed(2)}</p>
          <p>GST (5%): {calculateTotals().gst.toFixed(2)}</p>
          <p>Grand Total: {calculateTotals().grandTotal.toFixed(2)}</p>
        </div> */}
        <div className="flex items-center space-x-2">
          <label htmlFor="gstToggle" className="text-sm font-semibold">GST</label>
          <input
            id="gstToggle" 
            type="checkbox"
            checked={includeGST}
            onChange={(e) => setIncludeGST(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-sm">{includeGST ? 'GST Included' : 'No GST'}</span>
        </div>


        <div className="w-full space-y-2 w-full border-t pt-4">
          <p className="w-full flex justify-between border-b py-2 font-medium">
            <span>Total Qty:</span>
            <span>{calculateTotals().totalQuantity.toFixed()}</span>
          </p>
          <p className="w-full flex justify-between border-b py-2 font-medium">
            <span>Sub Total:</span>
            <span>₹{Math.round(calculateTotals().subtotal)}</span>
          </p>
          <p className="w-full flex justify-between border-b py-2 font-medium">
            <span>GST (5%):</span>
            <span>₹{Math.round(calculateTotals().gst)}</span>
            </p>
          <p className="w-full flex justify-between py-2 font-semibold text-lg text-green-700">
            <span>Grand Total:</span>
            <span>₹{Math.round(calculateTotals().grandTotal)}</span>
            </p>
        </div>


        {/* Action buttons */}
        <div className="flex space-x-2">
        <button type="button" onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {/* <button type="button" onClick={sharePDF} className="bg-blue-500 text-white px-4 py-2 rounded">Share PDF</button> */}
          {businessProfile && ( <button type="button" onClick={() => sharePDF(businessProfile)} disabled={isLoading} className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-red-600">
            {isLoading ? 'processing...' : ''}
        <FaShareAlt className="w-12 h-4" />
        </button>)}
        {businessProfile && ( <button type="button" onClick={() => downloadPDF(businessProfile)} disabled={isLoading} className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-red-600">
            {isLoading ? 'processing...' : ''}
        <FaFileDownload className="w-4 h-4" />
        </button>
      )}

        <button
          type="button"
          onClick={handlePrint}
          className="hidden sm:flex items-center space-x-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
          🖨️ Print
        </button>


          {/* <button type="button" onClick={generatePDF} className="bg-purple-500 text-white px-4 py-2 rounded">Download PDF</button> */}
          {/* <button type="button" onClick={downloadPDF} disabled={isLoading} className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded hover:bg-blue-600">
         {isLoading ? 'processing...' : ''}
          <FaDownload className="w-4 h-4" />
          </button> */}
          {/* <button type="button" onClick={OpenPdf} className="flex items-center space-x-2 p-2 bg-yellow-500 text-white rounded hover:bg-blue-600"> 
            
        <FaPrint className="w-4 h-4" />
        </button> */}


        </div>
        <label className="block text-sm font-medium mb-1">Mode(s) of Payment</label>
{formData.payments.map((payment, index) => (
  <div key={index} className="flex items-center gap-2 mb-2">
    <select
      value={payment.mode}
      onChange={(e) => handlePaymentChange(index, 'mode', e.target.value)}
      className="border p-2"
    >
      <option value="">Select</option>
      <option value="Cash">Cash</option>
      <option value="G PAY">G PAY</option>
      <option value="Card">Card</option>
      <option value="P PAY">P PAY</option>
      <option value="Credit">Credit</option>
    </select>
    <input
      type="number"
      value={payment.amount}
      onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
      placeholder="Amount"
      className="border p-2"
    />
    <button
      type="button"
      onClick={() => removePayment(index)}
      className="text-red-500 text-xl"
    >
      −
    </button>
  </div>
))}
<button
  type="button"
  onClick={addPayment}
  className="text-green-600 border px-2 rounded"
>
  + Add Payment
</button>

<div className="mt-4 p-3 bg-gray-100 rounded border">

<div className="p-4 border rounded bg-gray-50 mt-4 space-y-2">
  <div className="text-sm">
    <strong>Total Amount:</strong> ₹{Math.round(calculateTotals().grandTotal)}
  </div>
  <div className="text-sm">
    <strong>Paid Amount:</strong> ₹{calculateTotals().totalPaid}
  </div>
  <div className="text-sm">
    <strong>Balance Amount:</strong> ₹{calculateTotals().balance.toFixed(2)}
      <p className={`font-semibold ${calculateTotals().balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
  Balance: ₹{calculateTotals().balance.toFixed(2)}
</p>

  </div>
</div>


</div>



      </form>
       
     </div>
     

  )
}


