
// MÓDULO CONTAS A PAGAR - LISTAGEM


(() => {
    "use strict";

    const raiz = document.getElementById("contasApp");

    if (!raiz) return;

    // Endereço do Back-End recebido pelo Nunjucks.
    const API = raiz.dataset.apiBackend ||
        "http://localhost:40000";

    // Token salvo na tela de login.
    const token = localStorage.getItem("token");

    const corpoTabela =
        document.getElementById("corpoContas");

    const busca =
        document.getElementById("buscaConta");

    const mensagem =
        document.getElementById("mensagemContas");

    let listaContas = [];

    // Mostra mensagem ao usuário.
    const Aviso = (texto, tipo = "danger") => {
        mensagem.textContent = texto;
        mensagem.className = "alert alert-" + tipo;
        mensagem.hidden = false;
    };

    // Converte valor numérico para reais.
    const Moeda = (valor) => {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    // Converte 2026-11-20 para 20/11/2026.
    const DataBR = (texto) => {
        if (!texto) return "";

        return texto.split("-").reverse().join("/");
    };

    // Envia requisições autenticadas ao Back-End.
    const Api = async (caminho, opcoes = {}) => {
        if (!token) {
            throw new Error("Faça login antes de acessar as contas.");
        }

        const resposta = await fetch(API + caminho, {
            ...opcoes,
            headers: {
                Authorization: "Bearer " + token,
                ...(opcoes.headers || {})
            }
        });

        const dados = await resposta.json()
            .catch(() => ({}));

        if (dados.auth === false) {
            throw new Error(
                dados.message || "Token inválido ou expirado."
            );
        }

        if (!resposta.ok || dados.status === "erro") {
            throw new Error(
                dados.mensagem ||
                dados.message ||
                "Erro ao consultar a API."
            );
        }

        return dados;
    };

    // Cria uma célula HTML de maneira segura.
    const Celula = (linha, texto) => {
        const td = document.createElement("td");

        td.textContent = String(texto);
        linha.appendChild(td);

        return td;
    };

    // Cria um link para uma ação.
    const LinkAcao = (texto, endereco, classe) => {
        const link = document.createElement("a");

        link.href = endereco;
        link.textContent = texto;
        link.className = classe;

        return link;
    };

    // Exibe todas as contas recebidas na tabela.
    const MostrarContas = (contas) => {
        corpoTabela.replaceChildren();

        if (contas.length === 0) {
            const linha = document.createElement("tr");

            const coluna = Celula(
                linha,
                "Nenhuma conta encontrada."
            );

            coluna.colSpan = 7;
            coluna.className = "text-center text-muted";

            corpoTabela.appendChild(linha);
            return;
        }

        contas.forEach((conta) => {
            const linha = document.createElement("tr");

            Celula(linha, conta.id);
            Celula(linha, conta.descricao);
            Celula(linha, Moeda(conta.valor));
            Celula(linha, DataBR(conta.data_vencimento));
            Celula(linha, conta.categoria_nome);
            Celula(linha, conta.pago ? "Paga" : "Pendente");

            const acoes = Celula(linha, "");

            acoes.className = "text-nowrap";

            // Botão Visualizar
            acoes.appendChild(
                LinkAcao(
                    "Visualizar",
                    "/contas/visualizar/" + conta.id,
                    "btn btn-sm btn-outline-info me-1"
                )
            );

            // Botão Editar
            acoes.appendChild(
                LinkAcao(
                    "Editar",
                    "/contas/editar/" + conta.id,
                    "btn btn-sm btn-outline-primary me-1"
                )
            );

            // Botão Excluir
            const excluir = document.createElement("button");

            excluir.type = "button";
            excluir.textContent = "Excluir";
            excluir.className = "btn btn-sm btn-outline-danger";

            excluir.addEventListener("click", () => {
                vwDeleteConta(conta);
            });

            acoes.appendChild(excluir);

            corpoTabela.appendChild(linha);
        });
    };

    // FUNÇÃO 1 - GET ALL
    // Busca as contas pela API.
    const vwGetAllContas = async () => {
        try {
            const dados = await Api("/getAllContas");

            listaContas = dados.registro || [];

            // Atualiza contador.
            document.getElementById("qtdContas").textContent =
                listaContas.length;

            // Soma apenas contas pendentes.
            const totalPendente = listaContas
                .filter((conta) => !conta.pago)
                .reduce(
                    (soma, conta) =>
                        soma + Number(conta.valor),
                    0
                );

            document.getElementById("valorPendente").textContent =
                Moeda(totalPendente);

            FiltrarContas();

        } catch (erro) {
            Aviso(erro.message);
        }
    };

    // Pesquisa local por descrição, categoria ou situação.
    const FiltrarContas = () => {
        const pesquisa = busca.value
            .toLocaleLowerCase("pt-BR")
            .trim();

        const resultado = listaContas.filter((conta) => {
            const descricao = conta.descricao
                .toLocaleLowerCase("pt-BR");

            const categoria = conta.categoria_nome
                .toLocaleLowerCase("pt-BR");

            const situacao = conta.pago
                ? "paga"
                : "pendente";

            return (
                descricao.includes(pesquisa) ||
                categoria.includes(pesquisa) ||
                situacao.includes(pesquisa)
            );
        });

        MostrarContas(resultado);
    };

    // FUNÇÃO 5 - DELETE
    // Chama a API de exclusão lógica.
    const vwDeleteConta = async (conta) => {
        const confirmar = confirm(
            `Deseja remover a conta "${conta.descricao}"?`
        );

        if (!confirmar) return;

        try {
            await Api("/deleteConta/" + conta.id, {
                method: "DELETE"
            });

            Aviso("Conta removida com sucesso.", "success");

            // Atualiza listagem após exclusão.
            await vwGetAllContas();

        } catch (erro) {
            Aviso(erro.message);
        }
    };

    // Pesquisa enquanto o usuário digita.
    busca.addEventListener("input", FiltrarContas);

    // Busca os registros ao carregar a página.
    vwGetAllContas();

})();
