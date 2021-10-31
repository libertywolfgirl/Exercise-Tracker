const exerciseForm = document.getElementById("exercise-form");
const usernameTextArea = document.getElementById("uname");
const idTextArea = document.getElementById("id");
const logForm = document.getElementById("log-form");

exerciseForm.addEventListener("submit", () => {
  const userId = document.getElementById("uid").value;
  exerciseForm.action = `/api/users/${userId}/exercises`;

  exerciseForm.submit();
});

logForm.addEventListener("submit", () => {
  const userId = document.getElementById("id").value;
  logForm.action = `/api/users/${userId}/logs`;

  logForm.submit();
});

async function getId() {
  const username = { username: usernameTextArea.value };
  const data = await fetch("/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(username)
  });

  const parsed = await data.json();

  if (parsed.error) {
    console.error(parsed.error);
    return;
  }

  document.getElementById("yourId").textContent = parsed._id;
  document.getElementById("yourUsername").textContent = parsed.username;
}

async function getLog() {
  const _id = { _id: usernameTextArea.value };
  console.log(_id);
  const data = await fetch(`/api/users/${_id}/logs`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
  });

  const parsed = await data.json();

  if (parsed.error) {
    console.error(parsed.error);
    return;
  }

  console.log(parsed);
}

document.getElementById("id-submit").addEventListener("click", e => {
  e.preventDefault();
  getId();
});

document.getElementById("log-submit").addEventListener("click", e => {
  e.preventDefault();
  getLog();
});
