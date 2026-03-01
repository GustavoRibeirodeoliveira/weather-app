// ===============================
// REGISTRO
// ===============================
function register() {
  const username = document.getElementById("regUsername")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();
  const feedback = document.getElementById("regFeedback");

  if (!username || !email || !password) {
    feedback.textContent = "Preencha todos os campos.";
    feedback.style.color = "red";
    return;
  }

  // Pega usuários já cadastrados
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Verifica se email já existe
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    feedback.textContent = "Este email já está cadastrado.";
    feedback.style.color = "red";
    return;
  }

  // Cria novo usuário
  const newUser = {
    username,
    email,
    password
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  feedback.textContent = "Conta criada com sucesso! Redirecionando...";
  feedback.style.color = "lightgreen";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}


// ===============================
// LOGIN
// ===============================
function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const feedback = document.getElementById("feedback");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    feedback.textContent = "Email ou senha incorretos.";
    feedback.style.color = "red";
    return;
  }

  // Salva usuário logado
  localStorage.setItem("user", JSON.stringify(user));

  feedback.textContent = "Login realizado com sucesso!";
  feedback.style.color = "lightgreen";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}


// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
// ===============================
// MOSTRAR INICIAL DO USUÁRIO
// ===============================
 // ===============================
// DASHBOARD (Inicial + Dropdown)
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const userIcon = document.getElementById("userIcon");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Mostrar inicial do nome
  if (userIcon && user.username) {
    userIcon.textContent = user.username.charAt(0).toUpperCase();
  }

  // Abrir / fechar dropdown
  if (userIcon && userDropdown) {
    userIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

  // Fechar ao clicar fora
  document.addEventListener("click", function () {
    if (userDropdown) {
      userDropdown.classList.add("hidden");
    }
  });

});
 