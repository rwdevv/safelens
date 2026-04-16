const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SECRET = "segredo_super";

let usuarios = [];

/* =========================
   CADASTRO
========================= */
app.post("/register", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const existe = usuarios.find((u) => u.email === email);

  if (existe) {
    return res.status(400).json({ erro: "Usuário já existe" });
  }

  usuarios.push({
    email,
    senha,
    codigo: null,
    codigoExpira: null
  });

  return res.json({ mensagem: "Cadastro realizado com sucesso ✔" });
});

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  if (user.senha !== senha) {
    return res.status(401).json({ erro: "Senha inválida" });
  }

  const agora = Date.now();

  if (user.codigoExpira && user.codigoExpira > agora) {
    return res.status(400).json({ erro: "Aguarde o código atual expirar ⏳" });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  user.codigo = codigo;
  user.codigoExpira = agora + 2 * 60 * 1000;

  console.log("🔐 Código:", codigo);

  return res.json({ codigo });
});

/* =========================
   VERIFY
========================= */
app.post("/verify", (req, res) => {
  const { email, codigo } = req.body;

  const user = usuarios.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  if (user.codigo !== codigo) {
    return res.status(401).json({ erro: "Código inválido ❌" });
  }

  if (user.codigoExpira < Date.now()) {
    return res.status(401).json({ erro: "Código expirado ⏰" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });

  user.codigo = null;
  user.codigoExpira = null;

  return res.json({ token });
});

/* =========================
   ROTA PRINCIPAL
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta " + PORT);
});