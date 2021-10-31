const exerciseForm = document.getElementById("exercise-form");
const usernameTextArea = document.getElementById("uname");

exerciseForm.addEventListener("submit", () => {
  const userId = document.getElementById("uid").value;
  exerciseForm.action = `/api/users/${userId}/exercises`;

  exerciseForm.submit();
});

const logForm = document.getElementById("log-form");

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

  document.getElementById("signUp").textContent = parsed._id;
}

document.getElementById("id-submit").addEventListener("click", e => {
  e.preventDefault();
  getId();
});
