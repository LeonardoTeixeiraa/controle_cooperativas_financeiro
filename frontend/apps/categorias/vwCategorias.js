
// Lista que armazena as categorias recebidas do Back-End
let listaCategorias = [];

// Identifica os elementos da página
const painel = document.getElementById("painelCategorias");
const corpoTabela = document.getElementById("corpoCategorias");
const mensagem = document.getElementById("mensagemCategorias");

// Endereço da API recebido do servidor Front-End
const servidorDw3 = painel.dataset.apiUrl;

// Consulta as categorias no Back-End (GET ALL)
const GetAllCategorias = async () => {

    // Recupera o token gerado durante o login
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {

        // Faz a requisição à nossa API de Categorias
        const resposta = await fetch(
            servidorDw3 + "/getAllCategorias",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        // Converte a resposta para objeto JavaScript
        const dados = await resposta.json();

        // O Back-End retorna auth:false quando o JWT falha
        if (dados.auth === false) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "/login";
            return;
        }

        if (!resposta.ok ||
            dados.status !== "ok" ||
            !Array.isArray(dados.registro)) {
            throw new Error("Não foi possível consultar as categorias.");
        }

        // Guarda os registros recebidos
        listaCategorias = dados.registro;

        // Atualiza a quantidade de categorias
        document.getElementById("totalCategorias").textContent =
            listaCategorias.length;

        // Exibe os registros na tabela
        MostrarCategorias(listaCategorias);

    } catch (erro) {

        mensagem.textContent = erro.message;
        mensagem.classList.remove("d-none");
    }
};

// Realiza a exclusão lógica da categoria (DELETE)
const DeleteCategoria = async (categoriaID) => {

    // Recupera o token do login
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        throw new Error("Usuário não autenticado.");
    }

    // Envia o DELETE para o Back-End
    const resposta = await fetch(
        servidorDw3 + "/deleteCategoria/" + categoriaID,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const dados = await resposta.json();

    // Verifica se o token continua válido
    if (dados.auth === false) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Sessão expirada.");
    }

    // Confirma se um registro foi removido
    if (!resposta.ok ||
        dados.status !== "ok" ||
        dados.linhasAfetadas !== 1) {

        throw new Error("Não foi possível remover a categoria.");
    }

    return dados;
};

// Exibe os registros na tabela HTML
const MostrarCategorias = (categorias) => {

    // Limpa as linhas anteriores
    corpoTabela.replaceChildren();

    // Caso nenhuma categoria seja encontrada
    if (categorias.length === 0) {

        const linha = document.createElement("tr");
        const coluna = document.createElement("td");

        coluna.colSpan = 4;
        coluna.className = "text-center text-muted";
        coluna.textContent = "Nenhuma categoria encontrada.";

        linha.appendChild(coluna);
        corpoTabela.appendChild(linha);
        return;
    }

    // Percorre os registros recebidos do banco
    categorias.forEach((categoria) => {

        const linha = document.createElement("tr");

        // Cria as colunas ID, Nome e Descrição
        [categoria.id, categoria.nome, categoria.descricao]
            .forEach((valor) => {

                const coluna = document.createElement("td");

                // textContent exibe texto sem interpretar HTML
                coluna.textContent = valor ?? "";

                linha.appendChild(coluna);
            });
        // Cria a coluna de ações
        const colunaAcoes = document.createElement("td");
        colunaAcoes.className = "text-end";

        // Botão Visualizar - Consulta a categoria em modo leitura
        const botaoVisualizar = document.createElement("a");

        botaoVisualizar.href = "/categorias/visualizar/" + categoria.id;
        botaoVisualizar.className = "btn btn-sm btn-outline-info me-2";
        botaoVisualizar.textContent = "Visualizar";

        // Botão Editar
        const botaoEditar = document.createElement("a");

        botaoEditar.href = "/categorias/editar/" + categoria.id;
        botaoEditar.className = "btn btn-sm btn-outline-primary me-2";
        botaoEditar.textContent = "Editar";

        // Botão Excluir
        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.className = "btn btn-sm btn-outline-danger";
        botaoExcluir.textContent = "Excluir";

        // Define o que acontece quando o usuário clica em Excluir
        botaoExcluir.addEventListener("click", async () => {

            const confirmar = confirm(
                "Deseja remover a categoria " + categoria.nome + "?"
            );

            if (!confirmar) return;

            try {
                await DeleteCategoria(categoria.id);

                // Recarrega a tabela após a exclusão
                await GetAllCategorias();

            } catch (erro) {
                mensagem.textContent = erro.message;
                mensagem.classList.remove("d-none");
            }

        });

        // Adiciona os botões à coluna
        colunaAcoes.appendChild(botaoVisualizar);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoExcluir);

        // Adiciona a coluna à linha da tabela
        linha.appendChild(colunaAcoes);
        corpoTabela.appendChild(linha);
    });
};

// Filtra as categorias pelo texto pesquisado
const FiltrarCategorias = () => {

    const pesquisa = document
        .getElementById("buscaCategoria")
        .value.toLowerCase();

    const resultado = listaCategorias.filter((categoria) => {

        return categoria.nome.toLowerCase().includes(pesquisa) ||
            categoria.descricao.toLowerCase().includes(pesquisa);

    });

    MostrarCategorias(resultado);
};

// Quando a página carregar, busca as categorias
document.addEventListener("DOMContentLoaded", () => {

    GetAllCategorias();

    // Escuta a digitação na caixa de pesquisa
    document
        .getElementById("buscaCategoria")
        .addEventListener("input", FiltrarCategorias);

});
