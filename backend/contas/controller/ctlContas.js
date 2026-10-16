
const mdlContas = require("../model/mdlContas");

// Verificando se o ID é um número inteiro positivo.
// Rejeitando valores como 0, -1 e 2abc.
const LerID = (valor) => {
    if (!/^[1-9]\d*$/.test(String(valor))) {
        return null;
    }

    const id = Number(valor);

    return Number.isSafeInteger(id) ? id : null;
};

// Validando os dados enviados pelo usuário.
const ValidarConta = (body) => {
    const descricao =
        typeof body?.descricao === "string"
            ? body.descricao.trim()
            : "";

    const valor = Number(body?.valor);
    const categoria_id = LerID(body?.categoria_id);
    const data_vencimento = body?.data_vencimento;
    const pago = body?.pago === true;

    if (!descricao || descricao.length > 255) {
        return {
            erro: "Informe a descrição (até 255 caracteres)."
        };
    }

    if (
        body?.valor === "" ||
        body?.valor === null ||
        body?.valor === undefined ||
        !Number.isFinite(valor) ||
        valor <= 0 ||
        Math.abs(valor * 100 - Math.round(valor * 100)) > 1e-7
    ) {
        return {
            erro: "Informe um valor positivo com até duas casas decimais."
        };
    }

    if (valor > 99999999.99) {
        return {
            erro: "Valor excede o limite permitido."
        };
    }

    if (
        typeof data_vencimento !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data_vencimento)
    ) {
        return {
            erro: "Vencimento deve estar no formato AAAA-MM-DD."
        };
    }

    const data = new Date(data_vencimento + "T00:00:00Z");

    if (
        Number.isNaN(data.getTime()) ||
        data.toISOString().slice(0, 10) !== data_vencimento
    ) {
        return {
            erro: "Data de vencimento inválida."
        };
    }

    if (
        body?.pago !== undefined &&
        typeof body.pago !== "boolean"
    ) {
        return {
            erro: "O campo pago deve ser verdadeiro ou falso."
        };
    }

    if (!categoria_id) {
        return {
            erro: "Selecione uma categoria válida."
        };
    }

    return {
        dados: {
            descricao,
            valor,
            data_vencimento,
            pago,
            categoria_id
        }
    };
};


const ErroInterno = (res, erro) => {
    console.error("[Contas]", erro);

    return res.status(500).json({
        status: "erro",
        mensagem: "Erro interno no módulo de contas."
    });
};

//GET ALL
const GetAllContas = async (req, res) => {
    try {
        const registro = await mdlContas.GetAllContas();

        return res.status(200).json({
            status: "ok",
            registro
        });
    } catch (erro) {
        return ErroInterno(res, erro);
    }
};

//GET BY ID
const GetContaByID = async (req, res) => {
    const id = LerID(req.params.contaid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID da conta inválido."
        });
    }

    try {
        const registro = await mdlContas.GetContaByID(id);

        if (registro.length === 0) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Conta não encontrada."
            });
        }

        return res.status(200).json({
            status: "ok",
            registro
        });
    } catch (erro) {
        return ErroInterno(res, erro);
    }
};

//INSERT
const InsertConta = async (req, res) => {
    const { erro, dados } = ValidarConta(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlContas.InsertConta(dados);

        if (resultado.msg === "categoria_invalida") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Categoria inexistente ou removida."
            });
        }

        return res.status(201).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas,
            id: resultado.id
        });
    } catch (erroBanco) {
        return ErroInterno(res, erroBanco);
    }
};

//UPDATE
const UpdateConta = async (req, res) => {
    const id = LerID(req.params.contaid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID da conta inválido."
        });
    }

    const { erro, dados } = ValidarConta(req.body);

    if (erro) {
        return res.status(400).json({
            status: "erro",
            mensagem: erro
        });
    }

    try {
        const resultado = await mdlContas.UpdateConta(id, dados);

        if (resultado.msg === "categoria_invalida") {
            return res.status(400).json({
                status: "erro",
                mensagem: "Categoria inexistente ou removida."
            });
        }

        if (!resultado.linhasAfetadas) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Conta não encontrada."
            });
        }

        return res.status(200).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas
        });
    } catch (erroBanco) {
        return ErroInterno(res, erroBanco);
    }
};

//DELETE - Exclusão lógica
const DeleteConta = async (req, res) => {
    const id = LerID(req.params.contaid);

    if (!id) {
        return res.status(400).json({
            status: "erro",
            mensagem: "ID da conta inválido."
        });
    }

    try {
        const resultado = await mdlContas.DeleteConta(id);

        if (!resultado.linhasAfetadas) {
            return res.status(404).json({
                status: "erro",
                mensagem: "Conta não encontrada."
            });
        }

        return res.status(200).json({
            status: "ok",
            linhasAfetadas: resultado.linhasAfetadas
        });
    } catch (erro) {
        return ErroInterno(res, erro);
    }
};

module.exports = {
    GetAllContas,
    GetContaByID,
    InsertConta,
    UpdateConta,
    DeleteConta
};
