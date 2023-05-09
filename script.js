window.addEventListener("load", loadTasks);

const CRUD_BASEURL =
  "https://crudcrud.com/api/0ab236e25f154fb8a92e6fdfdcb9be35/";

var taskListjson;
var taskListRef;

function renderListItem(element, isNewTask) {
  var listTemplate = `
      <a href="#" id="a-${element._id}" data-taskID="${
    element._id
  }" class="container list-group-item list-group-item-action ${
    isNewTask ? "active" : ""
  }" aria-current="true">
      
      <div class="d-flex w-100 justify-content-between">
      
      <h5 class="mb-1" id="title-${element._id}" >${element.title}</h5>
      <small id="date-${element._id}">${element.date}</small>
      
      <div>
      <button type="button" class="btn btn-sm btn-secondary" onclick="updateTask('${
        element._id
      }')">
      <i class="bi bi-pencil-square"></i>
      </button>
      
      <button type="button" class="btn btn-sm btn-danger" onclick="deleteTaskData('${
        element._id
      }')">
      <i class="bi bi-x-square"></i>
      </button>
      </div>

      </div>
      
      <p class="mb-1" id="description-${element._id}">${element.description}</p>
      </a>
      `;

  return listTemplate;
}

async function loadTasks() {
  taskListRef = document.getElementById("taskList");

  taskListRef.innerHTML = "";

  fetch(CRUD_BASEURL + "tasks").then(async (el) => {
    taskListjson = await el.json();

    taskListjson.forEach((element) => {
      console.log(element);

      var listTemplate = renderListItem(element, false);
      taskListRef.innerHTML += listTemplate;
    });
  });
}

function isTaskListValid(title, description, date) {
  let isFormValid = true;

  if (!title) {
    document.getElementById("title-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!description) {
    document.getElementById("desc-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!date) {
    document.getElementById("date-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!isFormValid) {
    return false;
  }
  return true;
}

const addTaskBtnRef = document.getElementById("addTaskBtn");

addTaskBtnRef.addEventListener("click", addTask);

async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  // isTaskListValid(title, description, date);

  if (isTaskListValid(title, description, date)) {
    const newList = await postList({
      title: title,
      description: description,
      date: date,
    });

    taskListjson.push(newList);

    var listTemplate = renderListItem(newList, true);
    taskListRef.innerHTML = listTemplate + taskListRef.innerHTML;

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("date").value = "";
  }
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
  document.getElementById("addTaskBtn").classList.add("d-none");
  const updateBtnElmRef = document.getElementById("updateTaskBtn");
  updateBtnElmRef.classList.remove("d-none");

  const task = await getTaskByID(task_id);

  document.getElementById("title").value = task.title;
  document.getElementById("desc").value = task.description;
  document.getElementById("date").value = task.date;

  updateBtnElmRef.addEventListener("click", async function () {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const date = document.getElementById("date").value;

    if (isTaskListValid(title, description, date)) {
      const isUpdated = await updateTaskData(task_id, {
        title,
        description,
        date,
      });
    }

    if (isUpdated) {
      document.getElementById("title").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("date").value = "";

      document.getElementById("updateTaskBtn").classList.add("d-none");
      document.getElementById("addTaskBtn").classList.remove("d-none");

      document.getElementById("title-" + task_id).innerHTML = title;
      document.getElementById("description-" + task_id).innerHTML = description;
      document.getElementById("date-" + task_id).innerHTML = date;
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

function searchTask(event) {
  taskListRef.innerHTML = "";

  var searchKeyWord = event.target.value;
  var searchResult = taskListjson.filter((el) =>
    el.title.toLowerCase().includes(searchKeyWord.toLowerCase())
  );

  searchResult.forEach((element) => {
    var listTemplate = renderListItem(element, false);
    taskListRef.innerHTML += listTemplate;
  });
}
