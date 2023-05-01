window.addEventListener("load", loadTasks);

const CRUD_BASEURL =
  "https://crudcrud.com/api/b91deceb286c4ed9a80d2f20d4f14e6b/";

var taskListjson;
var taskListRef;

async function loadTasks() {
  taskListRef = document.getElementById("taskList");

  taskListRef.innerHTML = fetch(CRUD_BASEURL + "tasks").then(async (el) => {
    taskListjson = await el.json();
    //console.log(taskListjson);

    taskListjson.forEach((element) => {
      console.log(element);
      //console.log(index);

      var listTemplate = `
      <a href="#"  data-taskID="${element._id}" class="list-group-item list-group-item-action" aria-current="true">
      <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1" id="title-${element._id}" >${element.title}</h5>
      <button type="button" class="btn btn-sm btn-secondary" onclick="updateTask('${element._id}')">
          Edit
        </button>
      </div>
      <p class="mb-1" id="description-${element._id}" >${element.description}</p>
      </a>
      `;

      taskListRef.innerHTML += listTemplate;

      //   editBtnElmRef = document.getElementById("editTaskBtn-${element._id}");
      // editBtnElmRef.addEventListener("click", updateTask);
    });
  });
}

function isTaskListValid(title, description) {
  let isFormValid = true;

  if (!title) {
    document.getElementById("title-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!description) {
    document.getElementById("desc-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!isFormValid) {
    return;
  }
}
const addTaskBtnRef = document.getElementById("addTaskBtn");

addTaskBtnRef.addEventListener("click", addTask);

async function addTask() {
  // write add task logic here
  const title = document.getElementById("title").value;
  const description = document.getElementById("desc").value;

  isTaskListValid(title, description);

  const newList = await postList({
    title: title,
    description: description,
  });

  var listTemplate = ` <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
 <div class="d-flex w-100 justify-content-between">
 <h5 class="mb-1">${newList.title}</h5>
 <button type="button" class="btn btn-sm btn-secondary" id="editTaskBtn-${newList._id}">
 Edit
</button>
 </div>
 <p class="mb-1">${newList.description}</p>
 </a>`;
  taskListjson.push(newList);

  taskListRef.innerHTML = listTemplate + taskListRef.innerHTML;

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
}

async function postList(list) {
  const response = await fetch(CRUD_BASEURL + "tasks", {
    method: "POST",
    headers: [
      ["Content-Type", "application/json"],
      ["Content-Type", "text/plain"],
    ],
    body: JSON.stringify(list),
  });

  const addedList = await response.json();
  console.log(addedList);

  return addedList;
}

async function getTaskByID(taskID) {
  const response = await fetch(CRUD_BASEURL + "tasks/" + taskID);
  return await response.json();
}

async function updateTask(task_id) {
  document.getElementById("addTaskBtn").setAttribute("disabled", "true");
  const updateBtnElmRef = document.getElementById("updateTaskBtn");
  updateBtnElmRef.removeAttribute("disabled");

  const task = await getTaskByID(task_id);

  document.getElementById("title").value = task.title;
  document.getElementById("desc").value = task.description;
  // document.getElementById("addTaskBtn").innerHTML = "Update Task";

  updateBtnElmRef.addEventListener("click", async function () {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;

    isTaskListValid(title, description);

    const isUpdated = await updateTaskData(task_id, {
      title,
      description,
    });
    if (isUpdated) {
      document.getElementById("title").value = "";
      document.getElementById("desc").value = "";

      document.getElementById("updateTaskBtn").setAttribute("disabled", "true");
      document.getElementById("addTaskBtn").removeAttribute("disabled");

      document.getElementById("title-"+task_id).innerHTML = title;
      document.getElementById("description-"+task_id).innerHTML = description;
    } else {
      alert("Task not updated");
    }
  });
}

async function updateTaskData(task_id, taskList) {

  const response = await fetch(CRUD_BASEURL + "tasks/" + task_id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8", // Indicates the content
    },
    body: JSON.stringify(taskList),
  });

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
