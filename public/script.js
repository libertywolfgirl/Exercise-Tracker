const exerciseForm = document.getElementById("exercise-form");
const usernameTextArea = document.getElementById("uname");
const idTextArea = document.getElementById("id");
const exerciseId = document.getElementById("uid");
const logForm = document.getElementById("log-form");

exerciseForm.addEventListener("submit", () => {
  const userId = exerciseId.value;
  exerciseForm.action = `/api/users/${userId}/exercises`;

  exerciseForm.submit();
});

logForm.addEventListener("submit", () => {
  const userId = idTextArea.value;
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

async function getExercise() {
  const _id = exerciseId.value;

  const data = await fetch(`/api/users/${_id}/exercises`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    }
  });

  const parsed = await data.json();

  if (parsed.error) {
    console.error(parsed.error);
    return;
  } 
}

async function getLog() {
  const _id = idTextArea.value;

  const data = await fetch(`/api/users/${_id}/logs`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    }
  });

  const parsed = await data.json();
  console.log(parsed);
  if (parsed.error) {
    console.error(parsed.error);
    return;
  }

  const wrapperDiv = document.createElement("div");
  parsed.log.forEach(function(log) {
    const logDiv = document.createElement("div");
    logDiv.className = "parsed-data";
    const logDescription = logDiv.appendChild(
      document.createTextNode(log.description)
    );
    logDescription.className = "parsed";
    const logDuration = logDiv.appendChild(
      document.createTextNode(log.duration)
    );
    logDuration.className = "parsed";
    const logDate = logDiv.appendChild(document.createTextNode(log.date));
    logDate.className = "parsed";
    wrapperDiv.appendChild(logDiv);
  });
  document.body.appendChild(wrapperDiv);
}

document.getElementById("id-submit").addEventListener("click", e => {
  e.preventDefault();
  getId();
});

document.getElementById("log-submit").addEventListener("click", e => {
  e.preventDefault();
  getLog();
});
