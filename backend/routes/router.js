//Importar dependências
const express = require("express");
const routerApp = express.Router();

const appLogin = require("../login/controller/ctlLogin");

// Importa o Controller de Categorias Financeiras
const appCategorias = require("../categorias/controller/ctlCategorias");
const appContas = require("../contas/controller/ctlContas");

//Rota de login
routerApp.post(["/Login", "/login"], appLogin.Login);
routerApp.post(["/Logout", "/logout"], appLogin.Logout);

//Rota para home
routerApp.get(["/home", "/Home"], appLogin.AutenticaJWT);

// Rotas categorias Financeiras

// Listar todas as categorias (GET ALL)
routerApp.get(
  "/getAllCategorias",
  appLogin.AutenticaJWT,
  appCategorias.GetAllCategorias
);

// Consultar uma categoria pelo ID (GET BY ID)
routerApp.get(
  "/getCategoriaByID/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.GetCategoriaByID
);

// Cadastrar uma categoria (INSERT)
routerApp.post(
  "/insertCategoria",
  appLogin.AutenticaJWT,
  appCategorias.InsertCategoria
);

// Atualizar uma categoria (UPDATE)
routerApp.put(
  "/updateCategoria/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.UpdateCategoria
);

// Remover logicamente uma categoria (DELETE)
routerApp.delete(
  "/deleteCategoria/:categoriaid",
  appLogin.AutenticaJWT,
  appCategorias.DeleteCategoria
);

// Listando contas
routerApp.get(
    "/getAllContas",
    appLogin.AutenticaJWT,
    appContas.GetAllContas
);

// Consultando conta por ID
routerApp.get(
    "/getContaByID/:contaid",
    appLogin.AutenticaJWT,
    appContas.GetContaByID
);

// Cadastrando conta
routerApp.post(
    "/insertConta",
    appLogin.AutenticaJWT,
    appContas.InsertConta
);

// Atualizando conta
routerApp.put(
    "/updateConta/:contaid",
    appLogin.AutenticaJWT,
    appContas.UpdateConta
);

// Removendo conta logicamente
routerApp.delete(
    "/deleteConta/:contaid",
    appLogin.AutenticaJWT,
    appContas.DeleteConta
);

module.exports = routerApp;