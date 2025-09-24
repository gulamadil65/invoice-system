import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { Invoice, PDFData } from './storage'
// import { Share } from '@capacitor/share';
// import { Store } from 'lucide-react';a



export function generatePDF(invoice: Invoice, data: PDFData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Adding the image
  // const imgUrllogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20241020_125834-djfIbSuTLOn5ssynQLf8PAYpIYqoGn.jpg'
  const imgUrllogo = `${data.logoDataUrl}`
  const imgWidth = 24
  const imgHeight = 24

  doc.addImage(imgUrllogo, 'JPEG', 160, 14, imgWidth, imgHeight)

  // const imgUrlscn = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2024-10-20-12-57-17-650_com.microsoft.office.word-SdNpWiDoXImZjSEXNvk7s1IF4tClPa.png'
  const imgUrlscn = `${data.paymentDataUrl}`
  const imgWidthscn = 30
  const imgHeightscn = 30

//   doc.addImage(imgUrlscn, 'JPEG', 70, 244, imgWidthscn, imgHeightscn)

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  return `${day}-${month}-${year}`
}

  // Company details
  const header = () => {
    doc.setFontSize(13)
      doc.text(`${data.phone}`, 180, 10, { align: 'center' })
      doc.setFontSize(32)
      doc.setFont("times", "bold")
      doc.text(`${data.name}`, 105, 15, { align: 'center' })
      doc.setFontSize(12)
      doc.setTextColor(15, 15, 15)
      doc.text(`${data.address1}`, 105, 22, { align: 'center' })
      doc.text(`${data.address2}`, 105, 27, { align: 'center' })
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`GSTIN :${data.gst}`, 36, 31, { align: 'center' })
      doc.text(`Pan No : ${data.pan}`, 30, 37, { align: 'center' })
      doc.setFontSize(18)
      doc.setTextColor(242, 5, 5)
      doc.setFont("times", "bold")
      doc.text('TAX INVOICE', 105, 37, { align: 'center' })

      // Customer details
      const addressLines = doc.splitTextToSize(`${invoice.address}`, 150)
      // const addressLines = invoice.address.split(',', 3).map(line => line.trim());

      doc.line(10, 76, 200, 76)
      doc.line(10, 40, 200, 40)

      doc.setFontSize(13)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(15, 15, 15)
      doc.text(`Name: `, 10, 50)
      doc.text(`${invoice.customer}`, 85, 50, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`Address: `, 10, 57)
      // doc.text(splitAddress, 85, 57, { align: 'center' })
      // Address with different colors
    doc.setTextColor(0, 0, 255) // Blue
    doc.text(`${addressLines[0] || ''}`, 85, 57, { align: 'center' })
    doc.setTextColor(128, 0, 128) // Purple
    doc.text(addressLines[1] || '', 85, 62, { align: 'center' })
    doc.setTextColor(0, 128, 0) // Green
    doc.text(addressLines[2] || '', 85, 67, { align: 'center' })
    doc.setTextColor(15, 15, 15)
      doc.text(`Bill No:`, 150, 50)
      doc.text(`${invoice.billNo}`, 180, 50, { align: 'center' })
      doc.text(`Date:`, 150, 57)
      doc.text(`${formatDate(invoice.date)}`, 180, 57, { align: 'center' })
      doc.text(`Book No:`, 150, 63)
      doc.text(`${invoice.bookno}`, 180, 63, { align: 'center' })
      doc.text(`GST No:`, 10, 74)
      doc.text(`${invoice.gstNo}`, 55, 74, { align: 'center' })
      doc.text(`Phone:`, 90, 74)
      doc.setTextColor(255, 0, 0)
      doc.text(`${invoice.phone1 || ''}`, 120, 74, { align: 'center' })
      doc.text(` ${invoice.phone2 || ''}`, 160, 74, { align: 'center' })
      doc.setTextColor(15, 15, 15)
      doc.text(`Transport:`, 10, 84)
      doc.text(`${invoice.transport}`, 75, 84, { align: 'center' })
      doc.text(`Bale No:`, 10, 90)
      doc.text(`${invoice.bale || ''}`, 40, 90, { align: 'center' })
      doc.text(`LR Date:`, 140, 84)
      doc.text(`${invoice.lrDate}`, 175, 84, { align: 'center' })
      doc.text(`LR No:`, 140, 90)
      doc.text(`${invoice.lrNo}`, 175, 90, { align: 'center' })
      
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

  

  // Filter out items with empty quantities before creating the table
  const validItems = invoice.items.filter(item => item.qty !== '' && parseFloat(item.qty) > 0)

  // Loop through the rows manually
  for (let i = 0; i < validItems.length; i++) {
    if (i > 0 && i % 15 === 0) {
      doc.addPage()
      currentY = startY
      header()
      doc.setFont("helvetica", "bold")
      doc.text('S.No', 10, currentY)
      doc.text('Item', 60, currentY, { align: 'center' })
      doc.text('HSN', 100, currentY)
      doc.text('Quantity', 125, currentY)
      doc.text('Price', 150, currentY)
      doc.text('Total', 175, currentY)
      currentY += rowHeight
      doc.line(10, 93, 200, 93)
    }

    const item = validItems[i]
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(item.sno.toString(), 15, currentY + 1)
    doc.text(item.particulars || 'SAREE', 60, currentY + 1, { align: 'center' })
    doc.text(item.hsn || '', 105, currentY + 1)
    doc.text(item.qty.toString(), 133, currentY + 1)
    doc.text(item.price.toString(), 155, currentY + 1)
    doc.text(item.amount.toFixed(), 180, currentY + 1)

    currentY += rowHeight

    if (i === validItems.length - 1 || (i + 1) % 15 === 0) {
      footer()
    }
  }

  const totalQuantity = validItems.reduce((sum, item) => sum +  parseFloat(item.qty), 0)


  // Footer function
  function footer() {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.line(10, 193, 200, 193)
    

    // Bank details
    doc.addImage(imgUrlscn, 'JPEG', 65, 220, imgWidthscn, imgHeightscn)
    doc.line(10, 200, 200, 200)
    doc.text('Bank Details :', 10, 206, { align: 'left' })
    doc.text(`A/C Name : ${data.acName}`, 10, 214, { align: 'left' })
    doc.text(`Bank : ${data.bankname}`, 10, 220, { align: 'left' })
    doc.text(`A/C No : ${data.acNo}`, 10, 226, { align: 'left' })
    doc.text(`IFSC : ${data.ifsc}`, 10, 232, { align: 'left' })
    doc.text(`Branch : ${data.branch}`, 10, 238, { align: 'left' })
    doc.setTextColor(255, 0, 0)
    doc.text('ONLINE PAYMENTS', 10, 244, { align: 'left' })
    doc.setTextColor(15, 15, 15)
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
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
doc.text(`${invoice.subtotal.toFixed()}`, 180, 198, { align: 'center' })
doc.text(`GST (5%) `, 105, 210)
doc.text(`${invoice.gst.toFixed()}`, 180, 210, { align: 'center' })  
doc.setFontSize(14)
doc.setFont("helvetica", "bold")
doc.text(`Grand Total `, 105, 230)
doc.setFontSize(18)
doc.text(`${invoice.grandTotal.toFixed()}`, 180, 230, { align: 'center' })
doc.setFontSize(10)
doc.setFont("helvetica", "normal")
doc.line(100, 235, 200, 235)
//doc.text(`Amount in Words: ${numberToWords(Math.round(grandTotal))}`, 102, 240)
const Amtinword = doc.splitTextToSize(`Amount in Words: ${numberToWords(Math.round(invoice.grandTotal))}`, 100)
doc.text(Amtinword, 102, 240)
// Save the PDF
// doc.save(`${invoice.type}-invoice-${invoice.billNo}.pdf`)


 // Open PDF in a new tab instead of download
 // if download pdf you delete this line and add below download 
// window.open(doc.output('bloburl'), '_blank');
return doc;

}

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

export async function downloadPDF(invoice: Invoice, data: PDFData) {
  const pdf = await generatePDF(invoice, data);
  const pdfBase64 = pdf.output('datauristring').split(',')[1];
           
  if (Capacitor.isNativePlatform()) {
    const fileName = `${invoice.type}-invoice-${invoice.billNo}.pdf`;
    await Filesystem.writeFile({
      path: fileName,
      data: pdfBase64,
      directory: Directory.Documents
    });
    return `Invoice saved to Documents/${fileName}`;
  } else {
    // Web browser download
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.type}-invoice-${invoice.billNo}.pdf`;
    link.click();
    return 'Invoice downloaded successfully';
  }
}

import { supabase } from "../utils/supabaseClient";

export async function getBusinessProfileFromSupabase() {
  const { data, error } = await supabase
    .from("business_profile")
    .select("*")
    .single();

  if (error) {
    console.error("Error loading profile:", error);
    return null;
  }

  return data;
}


// export async function sharePDF(invoice: Invoice) {
//   const pdf = await generatePDF(invoice);
//   const pdfBase64 = pdf.output('datauristring').split(',')[1];
//   const fileName = `${invoice.type}-invoice-${invoice.billNo}.pdf`;

//   if (Capacitor.isNativePlatform()) {
//     await Filesystem.writeFile({
//       path: fileName,
//       data: pdfBase64,
//       directory: Directory.Documents
//     });

//     const fileUri = (await Filesystem.getUri({
//       directory: Directory.Documents,
//       path: fileName,
//     })).uri;

//     await Share.share({
//       title: 'Share Invoice PDF',
//       text: `Invoice ${invoice.billNo}`,
//       url: fileUri,
//       dialogTitle: 'Share Invoice',
//     });

//     return 'Invoice shared successfully.';
//   } else {
//     alert('Sharing is only available on native platforms.');
//     return 'Sharing not supported on web.';
//   }
// }