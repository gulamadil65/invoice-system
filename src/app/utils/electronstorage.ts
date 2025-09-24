import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { InventoryItem, Invoice } from './storage';

const userDataPath = app.getPath('userData');
const inventoryPath = path.join(userDataPath, 'inventory.json');
const invoicesPath = path.join(userDataPath, 'invoices.json');

export function getInventory(): InventoryItem[] {
  if (fs.existsSync(inventoryPath)) {
    const data = fs.readFileSync(inventoryPath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

export function updateInventory(updatedInventory: InventoryItem[]): void {
  fs.writeFileSync(inventoryPath, JSON.stringify(updatedInventory));
}

export function getInvoices(): Invoice[] {
  if (fs.existsSync(invoicesPath)) {
    const data = fs.readFileSync(invoicesPath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  invoices.push(invoice);
  fs.writeFileSync(invoicesPath, JSON.stringify(invoices));
}

export function updateInvoice(updatedInvoice: Invoice): void {
  const invoices = getInvoices();
  const index = invoices.findIndex(inv => inv.id === updatedInvoice.id);
  if (index !== -1) {
    invoices[index] = updatedInvoice;
    fs.writeFileSync(invoicesPath, JSON.stringify(invoices));
  }
}