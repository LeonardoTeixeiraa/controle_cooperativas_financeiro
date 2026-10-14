//Importar dependências
const express = require("express");
const routerApp = express.Router();

//Rota de login
routerApp.post("/login", () => {
   console.log("Bem vindo, Faça o Login!");
});

module.exports = routerApp;