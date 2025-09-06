import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";

interface Employee {
  period: string;
  ssn: string;
  nationalId: string;
  firstName: string;
  surnameName: string;
  dateOfBirth: string;
  contributionAmount: string;
  employerShare: string;
  employeeShare: string;
}

interface FieldConfig {
  name: keyof Employee;
  label: string;
  type: string;
  required: boolean;
  readonly?: boolean;
  step?: string;
}

const napsaFields: FieldConfig[] = [
  { name: 'period', label: 'Period (MM/YYYY)', type: 'text', required: true },
  { name: 'ssn', label: 'SSN', type: 'text', required: true },
  { name: 'nationalId', label: 'National ID', type: 'text', required: true },
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'surnameName', label: 'Surname Name', type: 'text', required: true },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
  { name: 'contributionAmount', label: 'Contribution Amount (ZMW)', type: 'number', required: true, step: '0.01' },
  { name: 'employerShare', label: 'Employer Share', type: 'number', required: false, readonly: true, step: '0.01' },
  { name: 'employeeShare', label: 'Employee Share', type: 'number', required: false, readonly: true, step: '0.01' }
];

const NAPSATool: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Load saved data from localStorage or initialize with one empty employee
    const savedData = localStorage.getItem('napsaEmployees');
    if (savedData) {
      try {
        const loadedEmployees = JSON.parse(savedData);
        if (loadedEmployees.length > 0) {
          setEmployees(loadedEmployees);
          return;
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    // Initialize with one empty employee if no saved data
    setEmployees([createEmptyEmployee()]);
  }, []);

  const createEmptyEmployee = (): Employee => ({
    period: new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '/'),
    ssn: '',
    nationalId: '',
    firstName: '',
    surnameName: '',
    dateOfBirth: '',
    contributionAmount: '',
    employerShare: '',
    employeeShare: ''
  });

  const addEmployee = () => {
    setEmployees([...employees, createEmptyEmployee()]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const updateEmployee = (index: number, field: keyof Employee, value: string) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index] = { ...updatedEmployees[index], [field]: value };

    // Calculate contributions when contribution amount changes
    if (field === 'contributionAmount') {
      const contributionAmount = parseFloat(value) || 0;
      const share = (contributionAmount / 2).toFixed(2);
      updatedEmployees[index].employerShare = share;
      updatedEmployees[index].employeeShare = share;
    }

    setEmployees(updatedEmployees);
  };

  const validateData = (): boolean => {
    if (employees.length === 0) {
      alert('Please add at least one employee before generating the XLSX file.');
      return false;
    }

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const requiredFields = napsaFields.filter(field => field.required);
      
      for (const field of requiredFields) {
        if (!employee[field.name] || employee[field.name].trim() === '') {
          alert(`Please fill in ${field.label} for Employee ${i + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const generateXLSX = () => {
    if (!validateData()) return;

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data with headers
    const headers = napsaFields.map(field => field.label);
    const data = [headers];
    
    employees.forEach(employee => {
      const row = napsaFields.map(field => employee[field.name] || '');
      data.push(row);
    });
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = napsaFields.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'NAPSA Employees');
    
    // Generate filename with current date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `NAPSA_Employees_${dateStr}.xlsx`;
    
    // Download file
    XLSX.writeFile(wb, filename);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('napsaEmployees', JSON.stringify(employees));
    alert('Data saved to browser storage successfully!');
  };

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all saved data from browser storage?')) {
      localStorage.removeItem('napsaEmployees');
      alert('Saved data cleared successfully!');
    }
  };

  const clearAllEmployees = () => {
    if (window.confirm('Are you sure you want to clear all employee rows?')) {
      setEmployees([createEmptyEmployee()]);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NAPSA Employee XLSX Generator</h1>
          <p className="text-lg text-gray-600 mb-6">
            Generate NAPSA employee contribution files with ease. Add employee details and download as XLSX format.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={addEmployee}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              Add Employee
            </button>
            <button
              onClick={generateXLSX}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-download"></i>
              Generate XLSX
            </button>
            <button
              onClick={saveToLocalStorage}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-save"></i>
              Save Draft
            </button>
            <button
              onClick={clearAllEmployees}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-trash"></i>
              Clear All
            </button>
            <button
              onClick={clearLocalStorage}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-eraser"></i>
              Clear Storage
            </button>
          </div>
        </div>

        {/* Employee Forms */}
        <div className="space-y-6">
          {employees.map((employee, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg relative">
              {/* Row Number Badge */}
              <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Employee {index + 1}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {napsaFields.map((field) => (
                  <div key={field.name} className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'date' ? (
                      <DatePicker
                        selected={employee[field.name] ? new Date(employee[field.name]) : null}
                        onChange={(date) => updateEmployee(index, field.name, date ? date.toISOString().split('T')[0] : '')}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholderText="Select date"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={employee[field.name]}
                        onChange={(e) => updateEmployee(index, field.name, e.target.value)}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          field.readonly ? 'bg-gray-100' : ''
                        }`}
                        required={field.required}
                        readOnly={field.readonly}
                        step={field.step}
                        placeholder={field.name === 'period' ? 'MM/YYYY' : ''}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Remove Button */}
              {employees.length > 1 && (
                <button
                  onClick={() => removeEmployee(index)}
                  className="mt-6 w-full bg-red-100 text-red-600 px-4 py-3 rounded-xl font-medium hover:bg-red-200 transition-colors duration-200 inline-flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-trash"></i>
                  Remove Employee
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions:</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Fill in all required fields marked with an asterisk (*)</li>
            <li>• Contribution amounts will be automatically split 50/50 between employer and employee shares</li>
            <li>• Use the "Save Draft" button to save your progress locally</li>
            <li>• Click "Generate XLSX" to download the completed file</li>
            <li>• The file will be named with the current date for easy identification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NAPSATool;