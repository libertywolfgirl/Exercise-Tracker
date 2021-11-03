const exerciseForm = document.getElementById("exercise-form");
const usernameTextArea = document.getElementById("uname");
const idTextArea = document.getElementById("id");
const exerciseId = document.getElementById("uid");
const logForm = document.getElementById("log-form");
const descriptionTextArea = document.getElementById("desc");
const durationTextArea = document.getElementById("dur");
const dateTextArea = document.getElementById("dat");
const resultsDiv = document.getElementById("results");

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

  document.getElementById("yourId").textContent = `id: ${parsed._id}`;
  document.getElementById(
    "yourUsername"
  ).textContent = `username: ${parsed.username}`;
}

async function getExercise() {
  const _id = exerciseId.value;
  const exercise = {
    description: descriptionTextArea.value,
    duration: parseInt(durationTextArea.value),
    date: dateTextArea.value
  };

  const data = await fetch(`/api/users/${_id}/exercises`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(exercise)
  });

  const parsed = await data.json();
  console.log(parsed);
  if (parsed.error) {
    console.error(parsed.error);
    return;
  }

  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "log-container";
  const logDiv = document.createElement("div");
  logDiv.className = "parsed-data";
  const descriptionDiv = logDiv.appendChild(document.createElement("p"));
  descriptionDiv.textContent = `Exercise: ${parsed.description}`;
  descriptionDiv.className = "parsed";
  const durationDiv = logDiv.appendChild(document.createElement("p"));
  durationDiv.textContent = `Duration: ${parsed.duration} minutes`;
  durationDiv.className = "parsed";
  const dateDiv = logDiv.appendChild(document.createElement("p"));
  dateDiv.textContent = `Date: ${parsed.date}`;
  dateDiv.className = "parsed";
  wrapperDiv.appendChild(logDiv);
  document.body.appendChild(wrapperDiv);
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
  wrapperDiv.className = "log-container";
  parsed.log.forEach(function(log) {
    const logDiv = document.createElement("div");
    logDiv.className = "parsed-data";
    const logDescription = logDiv.appendChild(document.createElement("p"));
    logDescription.textContent = `Exercise: ${log.description}`;
    logDescription.className = "parsed";
    const logDuration = logDiv.appendChild(document.createElement("p"));
    logDuration.textContent = `Duration: ${log.duration} minutes`;
    logDuration.className = "parsed";
    const logDate = logDiv.appendChild(document.createElement("p"));
    logDate.textContent = `Date: ${log.date}`;
    logDate.className = "parsed";
    wrapperDiv.appendChild(logDiv);
  });
  document.body.appendChild(wrapperDiv);
}

document.getElementById("id-submit").addEventListener("click", e => {
  e.preventDefault();
  getId();
});

document.getElementById("exercise-submit").addEventListener("click", e => {
  e.preventDefault();
  getExercise();
});

document.getElementById("log-submit").addEventListener("click", e => {
  e.preventDefault();
  getLog();
});
