window.addEventListener("load", loadTasks);

var taskListjson;

var taskListRef;

async function loadTasks() {
  taskListRef = document.getElementById("taskList");
  taskListRef.innerHTML = fetch(
    "https://crudcrud.com/api/bca845aef0df41d6a888dcf6db768837/tasks"
  ).then(async (el) => {
    taskListjson = await el.json();
    console.log(taskListjson);

    taskListjson.forEach((element, index) => {
      console.log(element);
      console.log(index);

      var listTemplate = `
      <a href="#" class="list-group-item list-group-item-action" aria-current="true">
      <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">${element.title}</h5>
      <small>3 days ago</small>
      </div>
      <p class="mb-1">${element.description}</p>
      </a>
      `;
      taskListRef.innerHTML += listTemplate;
    });
  });
}

const addTaskBtnRef = document.getElementById("addTaskBtn");

addTaskBtnRef.addEventListener("click", addTask);

async function addTask() {
  let isFormValid = true;

  const title = document.getElementById("title").value;
  if (!title) {
    document.getElementById("title-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  const description = document.getElementById("desc").value;
  if (!description) {
    document.getElementById("desc-error").classList.remove("visually-hidden");
    isFormValid = false;
  }

  if (!isFormValid) {
    return;
  }

  // write add task logic here

  const newList = await postList({
    title: title,
    description: description,
  });

  var listTemplate = ` <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
 <div class="d-flex w-100 justify-content-between">
 <h5 class="mb-1">${title}</h5>
 <small>3 days ago</small>
 </div>
 <p class="mb-1">${description}</p>
 </a>`;
  taskListjson.push(newList);

  taskListRef.innerHTML = listTemplate + taskListRef.innerHTML;
}

async function postList(list) {
  const response = await fetch(
    "https://crudcrud.com/api/bca845aef0df41d6a888dcf6db768837/tasks",
    {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["Content-Type", "text/plain"],
      ],
      body: JSON.stringify(list),
    }
  );

  const addedList = await response.json();
  console.log(addedList);

  return addedList;
}
