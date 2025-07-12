import {
  addEmployee,
  updateEmployee,
  getEmployeeById,
} from "./employeeService.js";
import { renderEmployees } from "./app.js";

const formSection = document.getElementById("employee-form-section");
const employeeForm = document.getElementById("employee-form");
const formCancelBtn = document.getElementById("form-cancel-btn");

let editingEmployeeId = null; // null = add mode, otherwise editing existing employee

// Open the form; if employee data provided, pre-fill for editing
function openForm(employee = null) {
  if (employee) {
    editingEmployeeId = employee.id;
    employeeForm.firstName.value = employee.firstName;
    employeeForm.lastName.value = employee.lastName;
    employeeForm.email.value = employee.email;
    employeeForm.department.value = employee.department;
    employeeForm.role.value = employee.role;
  } else {
    editingEmployeeId = null;
    employeeForm.reset();
  }
  clearErrors();
  formSection.classList.remove("hidden"); // Show the form section
}

// Close the form and reset state
function closeForm() {
  editingEmployeeId = null;
  employeeForm.reset();
  clearErrors();
  formSection.classList.add("hidden"); // Hide the form section
}

// Clear validation error messages
function clearErrors() {
  const errorElements = employeeForm.querySelectorAll(".error-message");
  errorElements.forEach((el) => (el.textContent = ""));
}

// Simple email format validator regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handle form submission for adding or editing employee
employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  // Trim and collect input values
  const firstName = employeeForm.firstName.value.trim();
  const lastName = employeeForm.lastName.value.trim();
  const email = employeeForm.email.value.trim();
  const department = employeeForm.department.value.trim();
  const role = employeeForm.role.value.trim();

  let valid = true;

  // Validate required fields
  if (!firstName) {
    employeeForm.querySelector("#error-firstName").textContent =
      "First Name is required.";
    valid = false;
  }
  if (!lastName) {
    employeeForm.querySelector("#error-lastName").textContent =
      "Last Name is required.";
    valid = false;
  }
  if (!email) {
    employeeForm.querySelector("#error-email").textContent =
      "Email is required.";
    valid = false;
  } else if (!emailRegex.test(email)) {
    employeeForm.querySelector("#error-email").textContent =
      "Invalid email format.";
    valid = false;
  }
  if (!department) {
    employeeForm.querySelector("#error-department").textContent =
      "Department is required.";
    valid = false;
  }
  if (!role) {
    employeeForm.querySelector("#error-role").textContent = "Role is required.";
    valid = false;
  }

  if (!valid) return; // Stop submission if validation failed

  if (editingEmployeeId) {
    const updatedEmployee = {
      id: editingEmployeeId,
      firstName,
      lastName,
      email,
      department,
      role,
    };
    updateEmployee(updatedEmployee);
  } else {
    const newEmployee = {
      id: Date.now(), // simple unique ID
      firstName,
      lastName,
      email,
      department,
      role,
    };
    addEmployee(newEmployee);
  }

  closeForm();
  renderEmployees(); // Refresh employee list display
});

// Cancel button closes the form without saving
formCancelBtn.addEventListener("click", () => {
  closeForm();
});

// Make openForm globally accessible (called from elsewhere)
window.openForm = openForm;
