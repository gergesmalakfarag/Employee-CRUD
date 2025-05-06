const formEmp = document.getElementById("formEmp");
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputMobile = document.getElementById("mobile");
const inputEditId = document.getElementById("contIDEdit");
const submitBtn = document.getElementById("submit");  // الزرار بتاع الإرسال
const tableBody = document.querySelector("#employeeTable");

let employees = [];
let idCounter = 1;

class Employee {
    constructor(id, name, email, mobile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
    }

    storeEmployee() {
        const allData = JSON.parse(localStorage.getItem("employees")) ?? [];
        allData.push({
            id: this.id,
            name: this.name,
            email: this.email,
            mobile: this.mobile
        });
        localStorage.setItem("employees", JSON.stringify(allData));
    }

    showData() {
        const trEl = document.createElement("tr");
        trEl.innerHTML = `
            <td>${this.name}</td>
            <td>${this.email}</td>
            <td>${this.mobile}</td>
            <td>
                <button class="btn btn-info btn-sm me-2" onclick="editEmployee(${this.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${this.id})">Delete</button>
            </td>
        `;
        return trEl;
    }
}

formEmp.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const mobile = inputMobile.value.trim();
    const editId = inputEditId.value;

    if (editId) {
        // تعديل موجود
        const emp = employees.find(e => e.id === parseInt(editId));
        if (emp) {
            emp.name = name;
            emp.email = email;
            emp.mobile = mobile;
            updateStorage();
        }
        inputEditId.value = "";
    } else {
        // إضافة جديد
        const newEmp = new Employee(idCounter++, name, email, mobile);
        employees.push(newEmp);
        newEmp.storeEmployee();
    }

    renderEmployees();
    formEmp.reset();

    // رجّع الزر لاسمه الأصلي بعد الإضافة أو التعديل
    submitBtn.value = "Store This Data";
    submitBtn.classList.remove("btn-warning");
    submitBtn.classList.add("btn-success");
});

function renderEmployees() {
    tableBody.innerHTML = "";
    employees.forEach(emp => {
        tableBody.appendChild(emp.showData());
    });
}

function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    updateStorage();
    renderEmployees();
}

function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (emp) {
        inputName.value = emp.name;
        inputEmail.value = emp.email;
        inputMobile.value = emp.mobile;
        inputEditId.value = emp.id;

        // غيّر اسم الزر إلى "Edit This Item"
        submitBtn.value = "Edit This Item";
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-warning");
    }
}

function updateStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function loadEmployeesFromStorage() {
    const allData = JSON.parse(localStorage.getItem("employees")) ?? [];
    employees = allData.map(emp => new Employee(emp.id, emp.name, emp.email, emp.mobile));

    // لو فيه موظفين محفوظين، نحدث العداد
    if (employees.length > 0) {
        idCounter = Math.max(...employees.map(e => e.id)) + 1;
    }

    renderEmployees();
}
function downloadExcel() {
    const allData = JSON.parse(localStorage.getItem("employees")) ?? [];

    if (allData.length === 0) {
        alert("لا يوجد بيانات لتحميلها.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
}


// نداء الدالة أول ما الصفحة تفتح
window.addEventListener("DOMContentLoaded", loadEmployeesFromStorage);
