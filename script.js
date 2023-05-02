window.addEventListener("load", loadTasks);

const CRUD_BASEURL =
  "https://crudcrud.com/api/5f15417feb4642aa9b57396fb3aa9474/";

var taskListjson;
var taskListRef;

async function loadTasks() {
  taskListRef = document.getElementById("taskList");

  taskListRef.innerHTML = fetch(CRUD_BASEURL + "tasks").then(async (el) => {
    taskListjson = await el.json();

    taskListjson.forEach((element) => {
      console.log(element);

      var listTemplate = `
      <a href="#" id="a-${element._id}" data-taskID="${element._id}" class="list-group-item list-group-item-action" aria-current="true">
      <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1" id="title-${element._id}" >${element.title}</h5>
      <button type="button" class="btn btn-sm btn-secondary" onclick="updateTask('${element._id}')">
          Edit
        </button>

      <button type="button" class="btn btn-sm btn-danger" onclick="deleteTaskData('${element._id}')">
          Delete
        </button>

      </div>
      <p class="mb-1" id="description-${element._id}" >${element.description}</p>
      </a>
      `;

      taskListRef.innerHTML += listTemplate;
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

  var listTemplate = ` <a href="#" id="a-${newList._id}"class="list-group-item list-group-item-action active" aria-current="true">
 <div class="d-flex w-100 justify-content-between">
 <h5 class="mb-1" id="title-${newList._id}" >${newList.title}</h5>
 <button type="button" class="btn btn-sm btn-secondary" id="editTaskBtn-${newList._id}" onclick="updateTask('${newList._id}')">
 Edit
</button>

<button type="button" class="btn btn-sm btn-danger" onclick="deleteTaskData('${newList._id}')">
Delete
</button>

 </div>
 <p class="mb-1" id="description-${newList._id}" >${newList.description}</p>
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

      document.getElementById("title-" + task_id).innerHTML = title;
      document.getElementById("description-" + task_id).innerHTML = description;
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

async function deleteTaskData(task_id) {

  const isConfirmed = confirm("Are you sure you want to delete?");

  if (isConfirmed) {
    fetch(CRUD_BASEURL + "tasks/" + task_id, {
      method: "DELETE",
    })
      .then((el) => {
        document.getElementById("a-" + task_id).remove();
      })
      .catch((er) => {
        alert("Enable to delete the task. See console for more information.");
        console.log(er);
      });
  }
}
