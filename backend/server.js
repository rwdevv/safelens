const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "segredo_super";

let usuarios = [];

/* =========================
   CADASTRO
========================= */
app.post("/register", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.json({ erro: "Preencha todos os campos" });
  }

  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    return res.json({ erro: "Usuário já existe" });
  }

  usuarios.push({
    email,
    senha,
    codigo: null,
    codigoExpira: null
  });

  res.json({ mensagem: "Cadastro realizado ✔" });
});

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(u => u.email === email);

  if (!user) return res.json({ erro: "Usuário não encontrado" });
  if (user.senha !== senha) return res.json({ erro: "Senha inválida" });

  const agora = Date.now();

  if (user.codigoExpira && user.codigoExpira > agora) {
    return res.json({ erro: "Aguarde o código atual expirar ⏳" });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  user.codigo = codigo;
  user.codigoExpira = agora + 2 * 60 * 1000;

  console.log("🔐 Código:", codigo);

  res.json({ codigo });
});

/* =========================
   VERIFY
========================= */
app.post("/verify", (req, res) => {
  const { email, codigo } = req.body;

  const user = usuarios.find(u => u.email === email);

  if (!user) return res.json({ erro: "Usuário não encontrado" });

  if (user.codigo !== codigo) {
    return res.json({ erro: "Código inválido ❌" });
  }

  if (user.codigoExpira < Date.now()) {
    return res.json({ erro: "Código expirado ⏰" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });

  user.codigo = null;
  user.codigoExpira = null;

  res.json({ token });
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});