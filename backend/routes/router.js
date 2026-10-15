//Importar dependências
const express = require("express");
const routerApp = express.Router();

const appLogin = require("../login/controller/ctlLogin");

// Importa o Controller de Categorias Financeiras
const appCategorias = require("../categorias/controller/ctlCategorias");

//Rota de login
routerApp.post(["/Login", "/login"], appLogin.Login);
routerApp.post(["/Logout", "/logout"], appLogin.Logout);

// Rotas categorias Financeiras

// 1. GET ALL - Listar todas as categorias
routerApp.get(
  "/getAllCategorias",
  appLogin.AutenticaJWT,
  appCategorias.GetAllCategorias
);

// 2. GET BY ID - Consultar uma categoria pelo ID
routerApp.get(
  "/getCategoriaByID/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.GetCategoriaByID
);

// 3. INSERT - Cadastrar uma categoria
routerApp.post(
  "/insertCategoria",
  appLogin.AutenticaJWT,
  appCategorias.InsertCategoria
);

// 4. UPDATE - Atualizar uma categoria
routerApp.put(
  "/updateCategoria/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.UpdateCategoria
);

// 5. DELETE - Remover logicamente uma categoria
routerApp.delete(
  "/deleteCategoria/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.DeleteCategoria
);

// Exportar as rotas
module.exports = routerApp;