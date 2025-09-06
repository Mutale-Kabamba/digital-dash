// Tools Directory JavaScript

// Suggest a tool handler
function suggestTool() {
  const input = document.getElementById('suggest-tool');
  const msg = document.getElementById('suggest-msg');
  if (input.value.trim().length < 3) {
    msg.style.color = "#ff8800";
    msg.textContent = "Please enter a tool name.";
    return;
  }
  msg.style.color = "#2ecc40";
  msg.textContent = "Thank you for your suggestion!";
  input.value = "";
  setTimeout(() => { msg.textContent = ""; }, 4000);
}

// Show category modal
function showCategoryModal(categoryId) {
  const modal = document.getElementById('category-modal');
  const modalBody = document.getElementById('modal-body');
  const gotoBtn = document.getElementById('goto-category-btn');
  const categoryDetails = {
    compliance: `<strong><i class="fa-solid fa-file-shield"></i> Zambian Compliance Tools</strong>
      <ul>
        <li><i class="fa-solid fa-file-invoice"></i> NHIMA Return Generator</li>
        <li><i class="fa-solid fa-file-invoice-dollar"></i> NAPSA Contribution Builder</li>
        <li><i class="fa-solid fa-calculator"></i> PAYE Calculator (ZRA) <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-file-lines"></i> VAT Return Form Builder <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-id-card"></i> TIN Validator <em class="coming-soon">Coming Soon</em></li>
      </ul>`,
    personal: `<strong><i class="fa-solid fa-user-graduate"></i> Personal & Career Tools</strong>
      <ul>
        <li><i class="fa-solid fa-file-signature"></i> CV Builder <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-envelope-open-text"></i> Cover Letter Generator <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-id-badge"></i> NRC to Age Calculator <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-list-check"></i> Job Application Tracker <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-user-check"></i> Basic Skills Audit <em class="coming-soon">Coming Soon</em></li>
      </ul>`,
    sme: `<strong><i class="fa-solid fa-briefcase"></i> SME Business Tools</strong>
      <ul>
        <li><i class="fa-solid fa-file-contract"></i> Quotation Generator <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-receipt"></i> Receipt Generator <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-book"></i> Cash Book Tool <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-address-card"></i> Business Card Creator <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-boxes-stacked"></i> Inventory Tracker <em class="coming-soon">Coming Soon</em></li>
      </ul>`,
    utility: `<strong><i class="fa-solid fa-screwdriver-wrench"></i> Utility Tools</strong>
      <ul>
        <li><i class="fa-solid fa-file-csv"></i> CSV to Excel Converter <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-broom"></i> Excel Cleaner <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-file-pdf"></i> PDF Compressor <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-sort-numeric-up"></i> Word Count Tool <em class="coming-soon">Coming Soon</em></li>
        <li><i class="fa-solid fa-money-bill-transfer"></i> ZMW ⇄ USD Converter <em class="coming-soon">Coming Soon</em></li>
      </ul>`
  };
  modalBody.innerHTML = categoryDetails[categoryId] || '<p>No details available for this category.</p>';
  modal.style.display = "block";
  
  // Set button action
  if (categoryId === "compliance") {
    gotoBtn.onclick = function() {
      window.location.href = "returns.html";
    };
    gotoBtn.disabled = false;
    gotoBtn.textContent = "Go to Category Page";
  } else {
    gotoBtn.onclick = function() {
      closeCategoryModal();
    };
    gotoBtn.disabled = true;
    gotoBtn.textContent = "Coming Soon";
  }
}

// Close category modal
function closeCategoryModal() {
  const modal = document.getElementById('category-modal');
  modal.style.display = "none";
}

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Close modal when clicking outside
  window.onclick = function(event) {
    const modal = document.getElementById('category-modal');
    if (event.target === modal) {
      closeCategoryModal();
    }
  };
});