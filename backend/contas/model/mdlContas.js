
const db = require("../../database/databaseConfig");

// Consultando a base com relacionamento entre Contas e Categorias.
const CONSULTA_BASE = `
    SELECT
        c.id,
        c.descricao,
        c.valor,
        c.data_vencimento::text AS data_vencimento,
        c.pago,
        c.categoria_id,
        c.removido,
        cat.nome AS categoria_nome
    FROM contas c
    INNER JOIN categorias cat
        ON c.categoria_id = cat.id
`;

// Consultando todas as contas não removidas.
const GetAllContas = async () => {
    const resultado = await db.query(
        CONSULTA_BASE +
        " WHERE c.removido = false ORDER BY c.id ASC"
    );

    return resultado.rows;
};

// Consultando uma conta específica.
const GetContaByID = async (contaID) => {
    const resultado = await db.query(
        CONSULTA_BASE +
        " WHERE c.id = $1 AND c.removido = false",
        [contaID]
    );

    return resultado.rows;
};

// Verificando se a categoria existe e está ativa.
const CategoriaAtiva = async (categoriaID) => {
    const resultado = await db.query(
        `SELECT id FROM categorias
         WHERE id = $1 AND removido = false`,
        [categoriaID]
    );

    return resultado.rowCount > 0;
};

// Cadastrando uma conta.
const InsertConta = async (dados) => {
    if (!(await CategoriaAtiva(dados.categoria_id))) {
        return {
            msg: "categoria_invalida",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        `INSERT INTO contas
         (descricao, valor, data_vencimento, pago,
          categoria_id, removido)
         VALUES ($1, $2, $3, $4, $5, false)
         RETURNING id`,
        [
            dados.descricao,
            dados.valor,
            dados.data_vencimento,
            dados.pago,
            dados.categoria_id
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount,
        id: resultado.rows[0].id
    };
};

// Atualizando uma conta existente.
const UpdateConta = async (contaID, dados) => {
    if (!(await CategoriaAtiva(dados.categoria_id))) {
        return {
            msg: "categoria_invalida",
            linhasAfetadas: 0
        };
    }

    const resultado = await db.query(
        `UPDATE contas
         SET descricao = $2,
             valor = $3,
             data_vencimento = $4,
             pago = $5,
             categoria_id = $6
         WHERE id = $1 AND removido = false`,
        [
            contaID,
            dados.descricao,
            dados.valor,
            dados.data_vencimento,
            dados.pago,
            dados.categoria_id
        ]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

// Exclusão lógica.
const DeleteConta = async (contaID) => {
    const resultado = await db.query(
        `UPDATE contas SET removido = true
         WHERE id = $1 AND removido = false`,
        [contaID]
    );

    return {
        msg: "ok",
        linhasAfetadas: resultado.rowCount
    };
};

// Disponibilizando as funções para o Controller.
module.exports = {
    GetAllContas,
    GetContaByID,
    InsertConta,
    UpdateConta,
    DeleteConta
};
