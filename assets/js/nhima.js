// NHIMA Employee XLSX Generator JavaScript

let nhimaRowCount = 0;

// Field configuration for NHIMA
const nhimaFields = [
    { name: 'employerAccountNumber', label: 'Employer Account Number', type: 'text', required: true },
    { name: 'year', label: 'Year', type: 'number', required: true, min: '2020', max: '2030' },
    { name: 'monthPeriod', label: 'Month (Period)', type: 'month', required: true },
    { name: 'memberId', label: 'Member ID', type: 'text', required: true },
    { name: 'nrcPassport', label: 'NRC / Passport Number', type: 'text', required: true },
    { name: 'surname', label: 'Surname', type: 'text', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'otherName', label: 'Other Name', type: 'text', required: false },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { name: 'basicPay', label: 'Basic Pay (ZMW)', type: 'number', required: true, step: '0.01' },
    { name: 'employerShare', label: 'Employer Share', type: 'number', readonly: true, step: '0.01' },
    { name: 'employeeShare', label: 'Employee Share', type: 'number', readonly: true, step: '0.01' }
];

// Initialize the form when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeNhimaForm();
    loadNhimaFromLocal();
});

function initializeNhimaForm() {
    // Add initial row if none exist
    if (nhimaRowCount === 0) {
        addNhimaRow();
    }
}

function createNhimaRow() {
    nhimaRowCount++;
    const rowId = `nhima-row-${nhimaRowCount}`;
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'employee-row';
    rowDiv.id = rowId;
    
    // Create row number badge
    const rowNumber = document.createElement('div');
    rowNumber.className = 'row-number';
    rowNumber.textContent = nhimaRowCount;
    
    // Create form grid
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';
    
    // Create form fields
    nhimaFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = `${rowId}-${field.name}`;
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.innerHTML = '<option value="">Select...</option>';
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            if (field.step) input.step = field.step;
            if (field.min) input.min = field.min;
            if (field.max) input.max = field.max;
            if (field.readonly) input.readOnly = true;
        }
        
        input.id = `${rowId}-${field.name}`;
        input.name = field.name;
        if (field.required) input.required = true;
        
        // Add event listeners for salary calculations
        if (field.name === 'basicPay') {
            input.addEventListener('input', () => calculateNhimaContributions(rowId));
        }
        
        // Add date picker for date fields
        if (field.type === 'date') {
            flatpickr(input, {
                dateFormat: "Y-m-d",
                maxDate: "today"
            });
        }
        
        // Add month picker for period field
        if (field.name === 'monthPeriod') {
            flatpickr(input, {
                dateFormat: "m/Y",
                defaultDate: new Date(),
                allowInput: true,
                enableTime: false,
                plugins: [
                    function() {
                        return {
                            onReady: function() {
                                // Hide the entire calendar and show only month/year selectors
                                const calendarContainer = this.calendarContainer;
                                const dayContainer = calendarContainer.querySelector('.dayContainer');
                                const weekdayContainer = calendarContainer.querySelector('.flatpickr-weekdays');
                                const weekContainer = calendarContainer.querySelector('.flatpickr-weeks');
                                
                                if (dayContainer) dayContainer.style.display = 'none';
                                if (weekdayContainer) weekdayContainer.style.display = 'none';
                                if (weekContainer) weekContainer.style.display = 'none';
                                
                                // Style the month nav to be more prominent
                                const monthNav = calendarContainer.querySelector('.flatpickr-months');
                                if (monthNav) {
                                    monthNav.style.padding = '20px';
                                    monthNav.style.fontSize = '16px';
                                }
                            },
                            onMonthChange: function(selectedDates, dateStr, instance) {
                                // Auto-close and format on month change
                                setTimeout(() => {
                                    const currentDate = instance.currentMonth !== undefined ? 
                                        new Date(instance.currentYear, instance.currentMonth, 1) : 
                                        new Date();
                                    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                                    const year = currentDate.getFullYear();
                                    instance.input.value = `${month}/${year}`;
                                    instance.close();
                                }, 100);
                            },
                            onYearChange: function(selectedDates, dateStr, instance) {
                                // Auto-close and format on year change
                                setTimeout(() => {
                                    const currentDate = instance.currentMonth !== undefined ? 
                                        new Date(instance.currentYear, instance.currentMonth, 1) : 
                                        new Date();
                                    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                                    const year = currentDate.getFullYear();
                                    instance.input.value = `${month}/${year}`;
                                    instance.close();
                                }, 100);
                            }
                        }
                    }
                ]
            });
        }
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        formGrid.appendChild(formGroup);
    });
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove';
    deleteBtn.onclick = () => removeNhimaRow(rowId);
    deleteBtn.style.marginTop = '16px';
    deleteBtn.style.width = '100%';
    
    // Assemble the row
    rowDiv.appendChild(rowNumber);
    rowDiv.appendChild(formGrid);
    rowDiv.appendChild(deleteBtn);
    
    return rowDiv;
}

function addNhimaRow() {
    const formFields = document.getElementById('nhimaFormFields');
    const newRow = createNhimaRow();
    formFields.appendChild(newRow);
}

function removeNhimaRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        updateNhimaRowNumbers();
    }
}

function updateNhimaRowNumbers() {
    const rows = document.querySelectorAll('.employee-row');
    rows.forEach((row, index) => {
        const rowNumber = row.querySelector('.row-number');
        if (rowNumber) {
            rowNumber.textContent = index + 1;
        }
    });
    nhimaRowCount = rows.length;
}

function calculateNhimaContributions(rowId) {
    const basicPayInput = document.getElementById(`${rowId}-basicPay`);
    const employerShareInput = document.getElementById(`${rowId}-employerShare`);
    const employeeShareInput = document.getElementById(`${rowId}-employeeShare`);
    
    const basicPay = parseFloat(basicPayInput.value) || 0;
    const employerShare = basicPay * 0.01; // 1% employer share
    const employeeShare = basicPay * 0.01; // 1% employee share
    
    employerShareInput.value = employerShare.toFixed(2);
    employeeShareInput.value = employeeShare.toFixed(2);
}

function generateNhimaXLSX() {
    const employees = collectNhimaData();
    
    if (employees.length === 0) {
        alert('Please add at least one employee before generating the XLSX file.');
        return;
    }
    
    // Validate required fields
    for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const requiredFields = nhimaFields.filter(field => field.required);
        
        for (const field of requiredFields) {
            if (!employee[field.name] || employee[field.name].trim() === '') {
                alert(`Please fill in ${field.label} for Employee ${i + 1}`);
                return;
            }
        }
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data with headers
    const headers = nhimaFields.map(field => field.label);
    const data = [headers];
    
    employees.forEach(employee => {
        const row = nhimaFields.map(field => employee[field.name] || '');
        data.push(row);
    });
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = nhimaFields.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'NHIMA Employees');
    
    // Generate filename with current date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `NHIMA_Employees_${dateStr}.xlsx`;
    
    // Download file
    XLSX.writeFile(wb, filename);
}

function collectNhimaData() {
    const employees = [];
    const rows = document.querySelectorAll('.employee-row');
    
    rows.forEach(row => {
        const employee = {};
        nhimaFields.forEach(field => {
            const input = row.querySelector(`[name="${field.name}"]`);
            if (input) {
                employee[field.name] = input.value;
            }
        });
        employees.push(employee);
    });
    
    return employees;
}

function saveNhimaToLocal() {
    const employees = collectNhimaData();
    localStorage.setItem('nhimaEmployees', JSON.stringify(employees));
    alert('Data saved to browser storage successfully!');
}

function loadNhimaFromLocal() {
    const savedData = localStorage.getItem('nhimaEmployees');
    if (savedData) {
        const employees = JSON.parse(savedData);
        
        // Clear existing rows
        clearAllNhimaRows();
        
        // Add rows for saved data
        employees.forEach(employee => {
            addNhimaRow();
            const rows = document.querySelectorAll('.employee-row');
            const currentRow = rows[rows.length - 1];
            
            // Populate fields
            nhimaFields.forEach(field => {
                const input = currentRow.querySelector(`[name="${field.name}"]`);
                if (input && employee[field.name]) {
                    input.value = employee[field.name];
                    
                    // Trigger calculations for salary fields
                    if (field.name === 'basicPay') {
                        calculateNhimaContributions(currentRow.id);
                    }
                }
            });
        });
    }
}

function clearNhimaLocal() {
    if (confirm('Are you sure you want to clear all saved data from browser storage?')) {
        localStorage.removeItem('nhimaEmployees');
        alert('Saved data cleared successfully!');
    }
}

function clearAllNhimaRows() {
    if (confirm('Are you sure you want to clear all employee rows?')) {
        const formFields = document.getElementById('nhimaFormFields');
        formFields.innerHTML = '';
        nhimaRowCount = 0;
        addNhimaRow(); // Add one empty row
    }
}

function handleNhimaFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name;
    document.getElementById('nhimaFileName').textContent = `Selected: ${fileName}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        
        if (lines.length < 2) {
            alert('CSV file appears to be empty or invalid.');
            return;
        }
        
        // Clear existing rows
        clearAllNhimaRows();
        
        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
                
                addNhimaRow();
                const rows = document.querySelectorAll('.employee-row');
                const currentRow = rows[rows.length - 1];
                
                // Map CSV columns to form fields
                nhimaFields.forEach((field, index) => {
                    const input = currentRow.querySelector(`[name="${field.name}"]`);
                    if (input && values[index]) {
                        input.value = values[index];
                        
                        // Trigger calculations for salary fields
                        if (field.name === 'basicPay') {
                            calculateNhimaContributions(currentRow.id);
                        }
                    }
                });
            }
        }
        
        alert(`Successfully imported ${lines.length - 1} employee records from CSV.`);
    };
    
    reader.readAsText(file);
}