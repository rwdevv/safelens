const API = "";

function navegar(pagina) {
  window.location.href = pagina;
}

async function cadastrar() {
  try {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    const res = await fetch(API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        senha: senhaInput.value.trim()
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.mensagem || "Cadastro realizado com sucesso ✔");
      window.location.href = "index.html";
    } else {
      alert(data.erro || "Erro ao cadastrar ❌");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor ❌");
  }
}

async function login() {
  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        senha: senha.value.trim()
      })
    });

    const data = await res.json();

    if (res.ok && data.codigo) {
      codigo.innerText = "Código: " + data.codigo;
    } else {
      alert(data.erro || "Erro no login ❌");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor ❌");
  }
}

async function verificar() {
  try {
    const res = await fetch(API + "/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        codigo: cod.value.trim()
      })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      navegar("dashboard.html");
    } else {
      alert(data.erro || "Código inválido ❌");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor ❌");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}