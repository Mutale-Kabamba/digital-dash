// NAPSA Employee XLSX Generator JavaScript

let napsaRowCount = 0;

// Field configuration for NAPSA
const napsaFields = [
    { name: 'period', label: 'Period (MM/YYYY)', type: 'text', required: true },
    { name: 'ssn', label: 'SSN', type: 'text', required: true },
    { name: 'nationalId', label: 'National ID', type: 'text', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'surnameName', label: 'Surname Name', type: 'text', required: true },
    { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
    { name: 'contributionAmount', label: 'Contribution Amount (ZMW)', type: 'number', required: true, step: '0.01' },
    { name: 'employerShare', label: 'Employer Share', type: 'number', readonly: true, step: '0.01' },
    { name: 'employeeShare', label: 'Employee Share', type: 'number', readonly: true, step: '0.01' }
];

// Initialize the form when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeNapsaForm();
    loadNapsaFromLocal();
});

function initializeNapsaForm() {
    // Add initial row if none exist
    if (napsaRowCount === 0) {
        addNapsaRow();
    }
}

function createNapsaRow() {
    napsaRowCount++;
    const rowId = `napsa-row-${napsaRowCount}`;
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'employee-row';
    rowDiv.id = rowId;
    
    // Create row number badge
    const rowNumber = document.createElement('div');
    rowNumber.className = 'row-number';
    rowNumber.textContent = napsaRowCount;
    
    // Create form grid
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';
    
    // Create form fields
    napsaFields.forEach(field => {
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
            if (field.readonly) input.readOnly = true;
        }
        
        input.id = `${rowId}-${field.name}`;
        input.name = field.name;
        if (field.required) input.required = true;
        
        // Add event listeners for salary calculations
        if (field.name === 'contributionAmount') {
            input.addEventListener('input', () => calculateContributions(rowId));
        }
        
        // Add date picker for date fields
        if (field.type === 'date') {
            flatpickr(input, {
                dateFormat: "Y-m-d",
                maxDate: "today"
            });
        }
        
        // Add month/year picker for period field
        if (field.name === 'period') {
            flatpickr(input, {
                dateFormat: "m/Y",
                defaultDate: new Date(),
                allowInput: true,
                monthSelectorType: 'dropdown',
                showMonths: 1,
                enableTime: false,
                onOpen: function(selectedDates, dateStr, instance) {
                    // Hide the day picker and show only month/year selection
                    const calendarContainer = instance.calendarContainer;
                    const dayContainer = calendarContainer.querySelector('.dayContainer');
                    if (dayContainer) {
                        dayContainer.style.display = 'none';
                    }
                },
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length > 0) {
                        const date = selectedDates[0];
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        instance.input.value = `${month}/${year}`;
                        instance.close();
                    }
                }
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
    deleteBtn.onclick = () => removeNapsaRow(rowId);
    deleteBtn.style.marginTop = '16px';
    deleteBtn.style.width = '100%';
    
    // Assemble the row
    rowDiv.appendChild(rowNumber);
    rowDiv.appendChild(formGrid);
    rowDiv.appendChild(deleteBtn);
    
    return rowDiv;
}

function addNapsaRow() {
    const formFields = document.getElementById('napsaFormFields');
    const newRow = createNapsaRow();
    formFields.appendChild(newRow);
}

function removeNapsaRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        updateRowNumbers();
    }
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('.employee-row');
    rows.forEach((row, index) => {
        const rowNumber = row.querySelector('.row-number');
        if (rowNumber) {
            rowNumber.textContent = index + 1;
        }
    });
    napsaRowCount = rows.length;
}

function calculateContributions(rowId) {
    const contributionAmountInput = document.getElementById(`${rowId}-contributionAmount`);
    const employerShareInput = document.getElementById(`${rowId}-employerShare`);
    const employeeShareInput = document.getElementById(`${rowId}-employeeShare`);
    
    const contributionAmount = parseFloat(contributionAmountInput.value) || 0;
    const share = contributionAmount / 2; // Split equally between employer and employee
    
    employerShareInput.value = share.toFixed(2);
    employeeShareInput.value = share.toFixed(2);
}

function generateNapsaXLSX() {
    const employees = collectNapsaData();
    
    if (employees.length === 0) {
        alert('Please add at least one employee before generating the XLSX file.');
        return;
    }
    
    // Validate required fields
    for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const requiredFields = napsaFields.filter(field => field.required);
        
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
}

function collectNapsaData() {
    const employees = [];
    const rows = document.querySelectorAll('.employee-row');
    
    rows.forEach(row => {
        const employee = {};
        napsaFields.forEach(field => {
            const input = row.querySelector(`[name="${field.name}"]`);
            if (input) {
                employee[field.name] = input.value;
            }
        });
        employees.push(employee);
    });
    
    return employees;
}

function saveNapsaToLocal() {
    const employees = collectNapsaData();
    localStorage.setItem('napsaEmployees', JSON.stringify(employees));
    alert('Data saved to browser storage successfully!');
}

function loadNapsaFromLocal() {
    const savedData = localStorage.getItem('napsaEmployees');
    if (savedData) {
        const employees = JSON.parse(savedData);
        
        // Clear existing rows
        clearAllNapsaRows();
        
        // Add rows for saved data
        employees.forEach(employee => {
            addNapsaRow();
            const rows = document.querySelectorAll('.employee-row');
            const currentRow = rows[rows.length - 1];
            
            // Populate fields
            napsaFields.forEach(field => {
                const input = currentRow.querySelector(`[name="${field.name}"]`);
                if (input && employee[field.name]) {
                    input.value = employee[field.name];
                    
                    // Trigger calculations for contribution fields
                    if (field.name === 'contributionAmount') {
                        calculateContributions(currentRow.id);
                    }
                }
            });
        });
    }
}

function clearNapsaLocal() {
    if (confirm('Are you sure you want to clear all saved data from browser storage?')) {
        localStorage.removeItem('napsaEmployees');
        alert('Saved data cleared successfully!');
    }
}

function clearAllNapsaRows() {
    if (confirm('Are you sure you want to clear all employee rows?')) {
        const formFields = document.getElementById('napsaFormFields');
        formFields.innerHTML = '';
        napsaRowCount = 0;
        addNapsaRow(); // Add one empty row
    }
}

function handleNapsaFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name;
    document.getElementById('napsaFileName').textContent = `Selected: ${fileName}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        
        if (lines.length < 2) {
            alert('CSV file appears to be empty or invalid.');
            return;
        }
        
        // Clear existing rows
        clearAllNapsaRows();
        
        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
                
                addNapsaRow();
                const rows = document.querySelectorAll('.employee-row');
                const currentRow = rows[rows.length - 1];
                
                // Map CSV columns to form fields
                napsaFields.forEach((field, index) => {
                    const input = currentRow.querySelector(`[name="${field.name}"]`);
                    if (input && values[index]) {
                        input.value = values[index];
                        
                        // Trigger calculations for contribution fields
                        if (field.name === 'contributionAmount') {
                            calculateContributions(currentRow.id);
                        }
                    }
                });
            }
        }
        
        alert(`Successfully imported ${lines.length - 1} employee records from CSV.`);
    };
    
    reader.readAsText(file);
}
