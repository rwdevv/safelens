const API = "http://localhost:3000";

function navegar(pagina) {
  window.location.href = pagina;
}

async function login() {
  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      senha: senha.value
    })
  });

  const data = await res.json();

  if (data.codigo) {
    codigo.innerText = "Código: " + data.codigo;
  } else {
    alert(data.erro);
  }
}

async function verificar() {
  const res = await fetch(API + "/verify", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      codigo: cod.value
    })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    navegar("dashboard.html");
  } else {
    alert(data.erro);
  }
}

async function cadastrar() {
  const res = await fetch(API + "/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      senha: senha.value
    })
  });

  const data = await res.json();

  alert(data.mensagem || data.erro);
}