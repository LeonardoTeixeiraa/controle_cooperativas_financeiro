//Importa nossas funções de banco
const mdlCategorias = require("../model/mdlCategorias");

// Valida o ID recebido pela URL.
// Aceita somente números inteiros positivos.
const ValidarCategoriaID = (id) => {

  // Verifica se contém apenas dígitos e começa com 1 a 9
  if (!/^[1-9][0-9]*$/.test(id)) {
    return null;
  }

  // Converte a string para número
  const numero = Number(id);

  // Garante que o ID seja representável com segurança
  if (!Number.isSafeInteger(numero)) {
    return null;
  }

  return numero;
};


// Consulta todas as categorias (GET ALL)
// O (req, res) Recebe a requisição e prepara a resposta
const GetAllCategorias = (req, res) =>
  (async () => {
    // Chama o Model para consultar as categorias no banco
    let registro = await mdlCategorias.GetAllCategorias();

    // Retorna os registros encontrados em formato JSON
    res.json({ status: "ok", registro: registro });
  })();

// Consulta uma categoria pelo ID (GET BY ID)
const GetCategoriaByID = (req, res) =>
  (async () => {
    // Pega o ID informado na URL e converte para inteiro
    const categoriaID = ValidarCategoriaID(req.params.categoriaid);

    if (categoriaID === null) {
      return res.status(400).json({
        status: "erro",
        mensagem: "ID da categoria inválido."
      });
    }

    // Chama o Model passando o ID da categoria
    let registro = await mdlCategorias.GetCategoriaByID(categoriaID);

    // Retorna a categoria encontrada
    res.json({ status: "ok", registro: registro });
  })();

// Insere uma nova categoria (INSERT)
const InsertCategoria = (request, res) =>
  (async () => {
    // Recebe os dados enviados pelo Front-End
    const registro = request.body;

    // Chama o Model para realizar o INSERT no banco
    let { msg, linhasAfetadas } =
      await mdlCategorias.InsertCategoria(registro);

    // Retorna o resultado da operação
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

// Atualiza uma categoria existente (UPDATE)
const UpdateCategoria = (request, res) =>
  (async () => {
    // Recupera o ID informado na URL
    const categoriaID = ValidarCategoriaID(request.params.categoriaid);

    if (categoriaID === null) {
      return res.status(400).json({
        status: "erro",
        mensagem: "ID da categoria inválido."
      });
    }
    // Recebe os novos dados enviados pelo Front-End
    const registro = request.body;

    // Chama o Model para atualizar o registro
    let { msg, linhasAfetadas } =
      await mdlCategorias.UpdateCategoria(categoriaID, registro);

    // Retorna o resultado da atualização
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

// Remove logicamente uma categoria (DELETE)
const DeleteCategoria = (request, res) =>
  (async () => {

    const categoriaID = ValidarCategoriaID(request.params.categoriaid);

    if (categoriaID === null) {
      return res.status(400).json({
        status: "erro",
        mensagem: "ID da categoria inválido."
      });
    }

    // Chama o Model para marcar removido = true
    let { msg, linhasAfetadas } =
      await mdlCategorias.DeleteCategoria(categoriaID);

    // Retorna o resultado da exclusão lógica
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

// Exporta as funções para serem usadas nas rotas
module.exports = {
  GetAllCategorias,
  GetCategoriaByID,
  InsertCategoria,
  UpdateCategoria,
  DeleteCategoria
};
