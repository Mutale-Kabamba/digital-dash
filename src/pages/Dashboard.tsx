import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Digital Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* NAPSA Tool */}
          <Link to="/tools/napsa" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-file-invoice-dollar text-blue-600 text-xl"></i>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">NAPSA Generator</h3>
            </div>
            <p className="text-gray-600">Generate NAPSA employee contribution files with ease.</p>
          </Link>

          {/* NHIMA Tool */}
          <Link to="/tools/nhima" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-file-medical text-green-600 text-xl"></i>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">NHIMA Generator</h3>
            </div>
            <p className="text-gray-600">Create NHIMA employee data files quickly and accurately.</p>
          </Link>

          {/* Invoice Tool */}
          <Link to="/tools/invoice" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-file-invoice text-purple-600 text-xl"></i>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">Invoice Generator</h3>
            </div>
            <p className="text-gray-600">Create professional invoices and receipts.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;