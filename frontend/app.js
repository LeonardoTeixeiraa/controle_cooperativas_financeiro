const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

// Carrega as configurações do arquivo .env
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Cria o servidor Express do Front-End
const app = express();

// Configura a Porta do servidor e endereço da API Back-End
const port = process.env.FRONTEND_PORT || 40100;
const servidorDw3 = process.env.SERVIDOR_DW3 || "http://localhost:40000";

// Configuração do Nunjucks
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "njk");

nunjucks.configure(path.join(__dirname, "view"), {
  autoescape: true,
  express: app,
  noCache: true,
});

// Disponibiliza os arquivos CSS, JS e imagens
app.use(express.static(path.join(__dirname, "public")));

// Disponibiliza os scripts dos módulos
app.use("/apps", express.static(path.join(__dirname, "apps")));

// Rota temporária para testar o servidor
app.get("/teste", (req, res) => {
  res.send("Servidor Front-End funcionando!");
});

// Página inicial redireciona para o Login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Página de Login provisória
app.get("/login", (req, res) => {
  res.render("loginView.njk", {
    backendUrl: servidorDw3,
  });
});

// Página principal
app.get("/home", (req, res) => {
  res.render("home.njk", {
    title: "Painel principal",
    activeMenu: "home",
    backendUrl: servidorDw3,
  });
});

// Listagem de Categorias
app.get("/categorias", (req, res) => {
  res.render("categorias.njk", {
    title: "Categorias financeiras",
    activeMenu: "categorias",
    backendUrl: servidorDw3,
  });
});

// Formulário de cadastro
app.get("/categorias/novo", (req, res) => {
  res.render("categoriaForm.njk", {
    title: "Cadastrar categoria",
    activeMenu: "categorias",
    categoriaId: "",
    backendUrl: servidorDw3,
  });
});

// Visualização dos detalhes de uma categoria por ID
app.get("/categorias/visualizar/:categoriaid", (req, res) => {
  res.render("categoriaForm.njk", {
    backendUrl: servidorDw3,
    categoriaId: req.params.categoriaid,
    somenteLeitura: true,
  });
});

// Formulário de edição
app.get("/categorias/editar/:id", (req, res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).send("ID inválido");
  }

  res.render("categoriaForm.njk", {
    title: "Editar categoria",
    activeMenu: "categorias",
    categoriaId: req.params.id,
    backendUrl: servidorDw3,
  });
});

// Página provisória do módulo do Bruno
app.get("/contas", (req, res) => {
  res.render("emConstrucao.njk", {
    title: "Contas a pagar",
    activeMenu: "contas",
    backendUrl: servidorDw3,
  });
});

// Inicia o servidor Front-End
app.listen(port, () => {
  console.log(`Front-End rodando na porta ${port}`);
});
