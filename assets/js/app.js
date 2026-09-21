const todoForm = document.getElementById("todoForm");
const updateTodoBtn = document.getElementById("updateTodoBtn");


let todosArr = JSON.parse(localStorage.getItem("todoArray")) || [];

function setLocalStorage() {
    localStorage.setItem("todoArray", JSON.stringify(todosArr));
}

function renderTodos(arr) {
    const todoContainer = document.getElementById("todoContainer");
    let res = "";
    arr.forEach(todo => {
        res += `
            <li class="list-group-item d-flex justify-content-between" id="${todo.id}">
                  <b>${todo.todoItem}</b>
                  <div>
                    <button onclick="onEdit(this)" class="btn btn-sm btn-info mr-2">Edit</button>
                    <button onclick="onDelete(this)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
            </li>
        `
    });
    todoContainer.innerHTML = res;
}


renderTodos(todosArr);

function onFormSubmit(event) {
    const todoItem = document.getElementById("todoItem");
    event.preventDefault();
    const todoObj = {
        todoItem: todoItem.value,
        id: crypto.randomUUID()
    }
    todosArr.push(todoObj);
    setLocalStorage();
    todoForm.reset();
    let newLi = document.createElement("li");
    newLi.id = todoObj.id;
    newLi.className = "list-group-item d-flex justify-content-between";
    newLi.innerHTML = `
        <b>${todoObj.todoItem}</b>
                  <div>
                    <button onclick="onEdit(this)" class="btn btn-sm btn-info mr-2">Edit</button>
                    <button onclick="onDelete(this)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
    `;
    todoContainer.append(newLi);
    Swal.fire({
                title: "Added!",
                text: "Your todo has been added successfully.",
                icon: "success"
            });
}

function onEdit(ele) {
    const todoItem = document.getElementById("todoItem");
    const addTodoBtn = document.getElementById("addTodoBtn");
    const updateTodoBtn = document.getElementById("updateTodoBtn");

    const editId = ele.closest("li").id;
    localStorage.setItem("updateId", editId);
    const editObj = todosArr.find(todo => todo.id === editId);
    todoItem.value = editObj.todoItem;
    addTodoBtn.classList.add("d-none");
    updateTodoBtn.classList.remove("d-none");
}

function onTodoUpdate() {
    const updateId = localStorage.getItem("updateId");
    const todoItem = document.getElementById("todoItem");
    const addTodoBtn = document.getElementById("addTodoBtn");
    const updateTodoBtn = document.getElementById("updateTodoBtn");

    localStorage.removeItem("updateId");
    const updateObj = {
        todoItem: todoItem.value,
        id: updateId
    }
    todoForm.reset();
    const updateIndex = todosArr.findIndex(todo => todo.id === updateId);
    todosArr[updateIndex] = updateObj;
    setLocalStorage();
    let updateLi = document.getElementById(updateId);
    updateLi.querySelector("b").innerText = updateObj.todoItem;
    Swal.fire({
                title: "Updated!",
                text: "Your todo has updated deleted.",
                icon: "success"
            });
    addTodoBtn.classList.remove("d-none");
    updateTodoBtn.classList.add("d-none");


}

function onDelete(ele) {
    const deleteId = ele.closest("li").id;
    Swal.fire({
        title: "Are you sure?",
        text: "You want to remove this todo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let deleteIndex = todosArr.findIndex( todo => todo.id === deleteId);
            todosArr.splice(deleteIndex,1);
            setLocalStorage();
            ele.closest("li").remove();
            Swal.fire({
                title: "Deleted!",
                text: "Your todo has been deleted.",
                icon: "success"
            });
        }


    });
}

todoForm.addEventListener("submit", onFormSubmit);
updateTodoBtn.addEventListener("click", onTodoUpdate);