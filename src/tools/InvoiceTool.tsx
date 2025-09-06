import React from 'react';

const InvoiceTool: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoice Generator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Create professional invoices and receipts for your business.
        </p>
        {/* Content will be converted from tools/invoice.html */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p>Invoice tool functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTool;