import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date | null;
  dueDate: Date | null;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

const InvoiceTool: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    companyName: '',
    companyAddress: '',
    clientName: '',
    clientAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    notes: ''
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (invoice.items.length > 1) {
      setInvoice({
        ...invoice,
        items: invoice.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Calculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setInvoice({ ...invoice, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generatePDF = () => {
    // Simple HTML generation for printing/PDF
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info, .client-info { margin-bottom: 20px; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals { text-align: right; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <h2>${invoice.invoiceNumber}</h2>
          </div>
          
          <div class="invoice-details">
            <div style="display: flex; justify-content: space-between;">
              <div class="company-info">
                <h3>From:</h3>
                <p><strong>${invoice.companyName}</strong></p>
                <p>${invoice.companyAddress.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="client-info">
                <h3>To:</h3>
                <p><strong>${invoice.clientName}</strong></p>
                <p>${invoice.clientAddress.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <p><strong>Invoice Date:</strong> ${invoice.invoiceDate?.toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${invoice.dueDate?.toLocaleDateString()}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>ZMW ${item.rate.toFixed(2)}</td>
                  <td>ZMW ${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table style="width: 300px; margin-left: auto;">
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>ZMW ${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Tax (${invoice.taxRate}%):</strong></td>
                <td>ZMW ${tax.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total:</strong></td>
                <td><strong>ZMW ${total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          ${invoice.notes ? `
            <div style="margin-top: 30px;">
              <h3>Notes:</h3>
              <p>${invoice.notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 50px; text-align: center; color: #666;">
            <p>Generated by Digital Dash Invoice Generator</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    alert('Invoice saved to browser storage successfully!');
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('invoiceData');
    if (savedData) {
      try {
        const loadedInvoice = JSON.parse(savedData);
        // Convert date strings back to Date objects
        loadedInvoice.invoiceDate = loadedInvoice.invoiceDate ? new Date(loadedInvoice.invoiceDate) : null;
        loadedInvoice.dueDate = loadedInvoice.dueDate ? new Date(loadedInvoice.dueDate) : null;
        setInvoice(loadedInvoice);
        alert('Invoice loaded from storage successfully!');
      } catch (error) {
        alert('Error loading saved invoice data.');
      }
    } else {
      alert('No saved invoice data found.');
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear the invoice form?')) {
      setInvoice({
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        companyName: '',
        companyAddress: '',
        clientName: '',
        clientAddress: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        taxRate: 0,
        notes: ''
      });
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invoice Generator</h1>
          <p className="text-lg text-gray-600 mb-6">
            Create professional invoices and receipts for your business. Generate PDF-ready invoices instantly.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={generatePDF}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-file-pdf"></i>
              Generate PDF
            </button>
            <button
              onClick={saveToLocalStorage}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-save"></i>
              Save Draft
            </button>
            <button
              onClick={loadFromLocalStorage}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-upload"></i>
              Load Draft
            </button>
            <button
              onClick={clearForm}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-trash"></i>
              Clear Form
            </button>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                <DatePicker
                  selected={invoice.invoiceDate}
                  onChange={(date) => setInvoice({ ...invoice, invoiceDate: date })}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <DatePicker
                  selected={invoice.dueDate}
                  onChange={(date) => setInvoice({ ...invoice, dueDate: date })}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Company and Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">From (Your Company)</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={invoice.companyName}
                  onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Company Address"
                  value={invoice.companyAddress}
                  onChange={(e) => setInvoice({ ...invoice, companyAddress: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">To (Client)</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={invoice.clientName}
                  onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Client Address"
                  value={invoice.clientAddress}
                  onChange={(e) => setInvoice({ ...invoice, clientAddress: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Qty</th>
                    <th className="px-4 py-3 text-left">Rate</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ZMW {item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {invoice.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addItem}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              Add Item
            </button>
          </div>

          {/* Totals and Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={invoice.taxRate}
                onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>ZMW {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>ZMW {calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>ZMW {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              placeholder="Additional notes or terms..."
              value={invoice.notes}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Instructions:</h3>
          <ul className="text-purple-800 space-y-2">
            <li>• Fill in your company details and client information</li>
            <li>• Add items with descriptions, quantities, and rates</li>
            <li>• Amounts are calculated automatically</li>
            <li>• Set tax rate if applicable (leave as 0 for no tax)</li>
            <li>• Use "Generate PDF" to create a printable invoice</li>
            <li>• Save your work as a draft for later editing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTool;