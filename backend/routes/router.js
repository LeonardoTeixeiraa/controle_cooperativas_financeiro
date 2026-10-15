//Importar dependências
const express = require("express");
const routerApp = express.Router();

const appLogin = require("../login/controller/ctlLogin");

//Rota de login
routerApp.post(["/Login", "/login"], appLogin.Login);
routerApp.post(["/Logout", "/logout"], appLogin.Logout);

module.exports = routerApp;