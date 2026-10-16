
// Identifica os elementos do formulário
const formulario = document.getElementById("formCategoria");
const mensagemForm = document.getElementById("mensagemFormulario");
const botaoSalvar = document.getElementById("btnSalvar");

// Recupera as informações enviadas pelo Nunjucks
const servidorDw3 = formulario.dataset.apiUrl;
const categoriaID = formulario.dataset.categoriaId;
// Identifica se a tela está em modo consulta
const somenteLeitura = formulario.dataset.somenteLeitura === "true";

// Função auxiliar para chamar as APIs protegidas
const RequisicaoCategoria = async (url, metodo, registro = null) => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        throw new Error("Usuário não autenticado.");
    }

    // Configura método e autenticação
    const opcoes = {
        method: metodo,
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    // Acrescenta JSON somente quando houver dados para enviar
    if (registro !== null) {
        opcoes.headers["Content-Type"] = "application/json";
        opcoes.body = JSON.stringify(registro);
    }

    const resposta = await fetch(servidorDw3 + url, opcoes);
    const dados = await resposta.json();

    if (dados.auth === false) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Sessão expirada.");
    }

    if (!resposta.ok || dados.status !== "ok") {
        throw new Error("Erro ao executar a operação.");
    }

    return dados;
};

// 2. GET BY ID - Consulta uma categoria pelo ID
const GetCategoriaByID = async (id) => {

    const dados = await RequisicaoCategoria(
        "/getCategoriaByID/" + id,
        "GET"
    );

    return dados.registro;
};

// 3. INSERT - Cadastra uma categoria
const InsertCategoria = async (registro) => {

    return await RequisicaoCategoria(
        "/insertCategoria",
        "POST",
        registro
    );
};

// 4. UPDATE - Atualiza uma categoria
const UpdateCategoria = async (id, registro) => {

    return await RequisicaoCategoria(
        "/updateCategoria/" + id,
        "PUT",
        registro
    );
};

// Exibe mensagens de erro
const MostrarErro = (texto) => {
    mensagemForm.textContent = texto;
    mensagemForm.classList.remove("d-none");
};

// Carrega os dados quando estamos editando
const CarregarCategoria = async () => {

    try {
        const registros = await GetCategoriaByID(categoriaID);

        if (!Array.isArray(registros) || registros.length === 0) {
            throw new Error("Categoria não encontrada.");
        }

        document.getElementById("nome").value = registros[0].nome;
        document.getElementById("descricao").value =
            registros[0].descricao;
        // Na visualização, também exibe ID e situação do registro
        if (somenteLeitura) {

            const categoria = registros[0];

            document.getElementById("idDetalhe").value = categoria.id;

            document.getElementById("removidoDetalhe").value =
                categoria.removido === true ? "Sim" : "Não";
        }

    } catch (erro) {
        MostrarErro(erro.message);
        botaoSalvar.disabled = true;
    }
};

// Controla o envio do formulário
formulario.addEventListener("submit", async (event) => {

    event.preventDefault();
    // Impede operações de gravação no modo visualização
    if (somenteLeitura) return;

    mensagemForm.classList.add("d-none");
    botaoSalvar.disabled = true;

    // Recupera os campos informados pelo usuário
    const registro = {
        nome: document.getElementById("nome").value.trim(),
        descricao: document.getElementById("descricao").value.trim()
    };

    try {

        if (!registro.nome || !registro.descricao) {
            throw new Error("Preencha todos os campos.");
        }

        let resultado;

        // Decide entre cadastrar ou atualizar
        if (categoriaID) {
            resultado = await UpdateCategoria(categoriaID, registro);
        } else {
            resultado = await InsertCategoria(registro);
        }

        if (resultado.linhasAfetadas !== 1) {
            throw new Error("Nenhum registro foi alterado.");
        }

        // Volta para a listagem após salvar
        window.location.href = "/categorias";

    } catch (erro) {

        MostrarErro(erro.message);
        botaoSalvar.disabled = false;

    }

});

// Configura o formulário quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {

    // Se estivermos visualizando, bloqueia os campos
    if (somenteLeitura) {

        document.getElementById("nome").readOnly = true;
        document.getElementById("descricao").readOnly = true;

    }

    // Se houver ID, consulta os dados no Back-End
    if (categoriaID) {
        CarregarCategoria();
    }

});
