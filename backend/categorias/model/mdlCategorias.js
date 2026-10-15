
const db = require("../../database/databaseConfig");

// 1. GET ALL - Retorna todas as categorias não removidas
const GetAllCategorias = async () => {
  return (
    await db.query(
      "SELECT * " +
        "FROM categorias WHERE removido = false ORDER BY nome ASC"
    )
  ).rows;
};

// 2. GET BY ID - Retorna uma categoria pelo ID
const GetCategoriaByID = async (categoriaIDPar) => {
  return (
    await db.query(
      "SELECT * " +
        "FROM categorias WHERE id = $1 AND removido = false",
      [categoriaIDPar]
    )
  ).rows;
};

// 3. INSERT - Insere uma nova categoria
const InsertCategoria = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO categorias (nome, descricao, removido) " +
          "VALUES ($1, $2, false)",
        [
          registroPar.nome,
          registroPar.descricao,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCategorias|InsertCategoria] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// 4. UPDATE - Atualiza uma categoria pelo ID
const UpdateCategoria = async (categoriaIDPar, registroPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE categorias SET " +
          "nome = $2, " +
          "descricao = $3 " +
          "WHERE id = $1 AND removido = false",
        [
          categoriaIDPar,
          registroPar.nome,
          registroPar.descricao,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCategorias|UpdateCategoria] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// 5. DELETE - Exclusão lógica (soft delete)
const DeleteCategoria = async (categoriaIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE categorias SET " +
          "removido = true " +
          "WHERE id = $1 AND removido = false",
        [categoriaIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCategorias|DeleteCategoria] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Exporta as funções para serem usadas pelo Controller
module.exports = {
  GetAllCategorias,
  GetCategoriaByID,
  InsertCategoria,
  UpdateCategoria,
  DeleteCategoria,
};
