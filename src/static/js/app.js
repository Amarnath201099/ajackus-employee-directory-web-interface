import {
  setSearchInput,
  setSortKey,
  setCurrentPage,
  setItemsPerPage,
  setFilterCriteria,
  resetFilterCriteria,
  deleteEmployeeById,
  getEmployeeById,
  getCurrentPage,
  getFilteredSortedPaginatedEmployees,
} from "./employeeService.js";

// Element references
const container = document.getElementById("employee-list-container");
const sortElement = document.getElementById("sort-select");
const searchElement = document.getElementById("search-input");
const itemsPerPageElement = document.getElementById("page-limit-select");

const modal = document.getElementById("confirm-modal");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addEmployee = document.getElementById("add-employee-btn");

const filterSidebar = document.getElementById("filter-sidebar");
const filterBtn = document.getElementById("filter-btn");
const applyFilterBtn = document.getElementById("apply-filter-btn");
const resetFilterBtn = document.getElementById("reset-filter-btn");
const filterForm = document.getElementById("filter-form");

const paginationContainer = document.getElementById("pagination-controls");
const prevPageBtn = document.getElementById("prev-page-btn");
const nextPageBtn = document.getElementById("next-page-btn");
const currentPageText = document.getElementById("current-page");
const totalPagesText = document.getElementById("total-pages");

let employeeIdToDelete = null;

// Event: Sort
sortElement.addEventListener("change", (e) => {
  setSortKey(e.target.value);
  setCurrentPage(1);
  renderEmployees();
});

// Event: Search
searchElement.addEventListener("input", (e) => {
  setSearchInput(e.target.value);
  setCurrentPage(1);
  renderEmployees();
});

// Event: Items per page
itemsPerPageElement.addEventListener("change", (e) => {
  setItemsPerPage(e.target.value);
  setCurrentPage(1);
  renderEmployees();
});

// Event: Confirm deletion
confirmBtn.addEventListener("click", () => {
  if (employeeIdToDelete !== null) {
    deleteEmployeeById(employeeIdToDelete);
    employeeIdToDelete = null;
    renderEmployees();
  }
  modal.classList.add("hidden");
});

// Event: Cancel deletion
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  employeeIdToDelete = null;
});

// Event: Open add employee form
addEmployee.addEventListener("click", () => {
  window.openForm();
});

// Toggle sidebar
filterBtn.addEventListener("click", () => {
  filterSidebar.classList.toggle("visible");
});

// Hide sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (!filterSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
    filterSidebar.classList.remove("visible");
  }
});

// Apply filter
applyFilterBtn.addEventListener("click", () => {
  const criteria = {
    firstName: filterForm.firstName.value,
    department: filterForm.department.value,
    role: filterForm.role.value,
  };
  setFilterCriteria(criteria);
  setCurrentPage(1);
  filterSidebar.classList.remove("visible");
  renderEmployees();
});

// Reset filter
resetFilterBtn.addEventListener("click", () => {
  resetFilterCriteria();
  filterForm.reset();
  setCurrentPage(1);
  filterSidebar.classList.remove("visible");
  renderEmployees();
});

// Show confirm modal
function showDeleteConfirm(id) {
  employeeIdToDelete = id;
  modal.classList.remove("hidden");
}

// Edit employee
function editEmployee(id) {
  const employee = getEmployeeById(id);
  if (employee) {
    window.openForm(employee);
  }
}

// Update pagination
function updatePaginationControls(totalItems) {
  const itemsPerPage = Number(itemsPerPageElement.value);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get the current page from service state
  const current = getCurrentPage();

  currentPageText.textContent = current;
  totalPagesText.textContent = totalPages || 1;

  prevPageBtn.disabled = current === 1;
  nextPageBtn.disabled = current >= totalPages;
}

// Render employee list
function renderEmployees() {
  const { employeesToShow, totalItems } = getFilteredSortedPaginatedEmployees();

  container.innerHTML = "";

  if (totalItems === 0) {
    container.innerHTML = `<p style="text-align:center;padding:20px;font-size:18px;">No employees found.</p>`;
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";

  employeesToShow.forEach((emp) => {
    container.innerHTML += `
      <div class="employee-card" data-id="${emp.id}">
        <h3 class="employee-card__title">${emp.firstName} ${emp.lastName}</h3>
        <p class="employee-card__field"><strong>Email:</strong> ${emp.email}</p>
        <p class="employee-card__field"><strong>Department:</strong> ${emp.department}</p>
        <p class="employee-card__field"><strong>Role:</strong> ${emp.role}</p>
        <div class="employee-card__btns_container">
          <button class="edit-btn btn btn-primary" data-id="${emp.id}">Edit</button>
          <button class="delete-btn btn btn-secondary" data-id="${emp.id}">Delete</button>
        </div>
      </div>
    `;
  });

  updatePaginationControls(totalItems);
  paginationContainer.dataset.page = currentPageText.textContent;
}

// Event: Header toggle
const toggleBtn = document.getElementById("header-toggle");
const header = document.querySelector(".page-header");

toggleBtn.addEventListener("click", () => {
  header.classList.toggle("open");
});

// Delegated actions for edit/delete
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    showDeleteConfirm(id);
  }
  if (e.target.classList.contains("edit-btn")) {
    const id = Number(e.target.dataset.id);
    editEmployee(id);
  }
});

// Pagination button handlers
prevPageBtn.addEventListener("click", () => {
  const current = Number(currentPageText.textContent);
  if (current > 1) {
    setCurrentPage(current - 1);
    renderEmployees();
  }
});

nextPageBtn.addEventListener("click", () => {
  const current = Number(currentPageText.textContent);
  setCurrentPage(current + 1);
  renderEmployees();
});

// Initial render
renderEmployees();

export { renderEmployees };
