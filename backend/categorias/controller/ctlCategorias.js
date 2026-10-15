//Importa nossas funções de banco
const mdlCategorias = require("../model/mdlCategorias");

// 1. GET ALL - Consulta todas as categorias
// O (req, res) Recebe a requisição e prepara a resposta
const GetAllCategorias = (req, res) =>
  (async () => {
    // Chama o Model para consultar as categorias no banco
    let registro = await mdlCategorias.GetAllCategorias();

    // Retorna os registros encontrados em formato JSON
    res.json({ status: "ok", registro: registro });
  })();

// 2. GET BY ID - Consulta uma categoria pelo ID
const GetCategoriaByID = (req, res) =>
  (async () => {
    // Pega o ID informado na URL e converte para inteiro
    const categoriaID = parseInt(req.params.categoriaid);

    // Chama o Model passando o ID da categoria
    let registro = await mdlCategorias.GetCategoriaByID(categoriaID);

    // Retorna a categoria encontrada
    res.json({ status: "ok", registro: registro });
  })();

// 3. INSERT - Insere uma nova categoria
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

// 4. UPDATE - Atualiza uma categoria existente
const UpdateCategoria = (request, res) =>
  (async () => {
    // Recupera o ID informado na URL
    const categoriaID = parseInt(request.params.categoriaid);

    // Recebe os novos dados enviados pelo Front-End
    const registro = request.body;

    // Chama o Model para atualizar o registro
    let { msg, linhasAfetadas } =
      await mdlCategorias.UpdateCategoria(categoriaID, registro);

    // Retorna o resultado da atualização
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

// 5. DELETE - Remove logicamente uma categoria
const DeleteCategoria = (request, res) =>
  (async () => {
    // Recupera o ID da categoria pela URL
    const categoriaID = parseInt(request.params.categoriaid);

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
