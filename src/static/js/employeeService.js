let employees = [...window.mockEmployees];

let searchInput = "";
let sortKey = null;
let currentPage = 1;
let itemsPerPage = 10;

let filterCriteria = {
  firstName: "",
  department: "",
  role: "",
};

export function setSearchInput(value) {
  searchInput = value.trim().toLowerCase();
}

export function setSortKey(key) {
  sortKey = key;
}

export function setCurrentPage(page) {
  currentPage = Number(page);
}

export function setItemsPerPage(limit) {
  itemsPerPage = Number(limit);
}

export function setFilterCriteria(criteria) {
  filterCriteria = {
    firstName: criteria.firstName?.toLowerCase() || "",
    department: criteria.department?.toLowerCase() || "",
    role: criteria.role?.toLowerCase() || "",
  };
}

export function resetFilterCriteria() {
  filterCriteria = { firstName: "", department: "", role: "" };
}

export function deleteEmployeeById(id) {
  employees = employees.filter((emp) => emp.id !== id);
}

export function getEmployeeById(id) {
  return employees.find((emp) => emp.id === id);
}

export function getCurrentPage() {
  return currentPage;
}

export function getFilteredSortedPaginatedEmployees() {
  let data = [...employees];

  // Filter by search input (matches first name, last name, or email)
  if (searchInput) {
    data = data.filter((emp) =>
      [emp.firstName, emp.lastName, emp.email].some((field) =>
        field.toLowerCase().includes(searchInput)
      )
    );
  }

  // Filter by criteria: first name, department, and role
  data = data.filter((emp) => {
    const matchesFirstName = filterCriteria.firstName
      ? emp.firstName.toLowerCase().includes(filterCriteria.firstName)
      : true;
    const matchesDepartment = filterCriteria.department
      ? emp.department.toLowerCase().includes(filterCriteria.department)
      : true;
    const matchesRole = filterCriteria.role
      ? emp.role.toLowerCase().includes(filterCriteria.role)
      : true;

    return matchesFirstName && matchesDepartment && matchesRole;
  });

  // Sort by the selected key (e.g., department or role) in ascending order
  if (sortKey) {
    data.sort((a, b) => {
      const aVal = String(a[sortKey]).toLowerCase();
      const bVal = String(b[sortKey]).toLowerCase();

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
  }

  // Apply pagination
  const totalItems = data.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = data.slice(startIndex, startIndex + itemsPerPage);

  return { employeesToShow: paginated, totalItems };
}

export function addEmployee(employee) {
  employees.push(employee);
}

export function updateEmployee(updatedEmployee) {
  const index = employees.findIndex((emp) => emp.id === updatedEmployee.id);
  if (index !== -1) {
    employees[index] = updatedEmployee;
  }
}
