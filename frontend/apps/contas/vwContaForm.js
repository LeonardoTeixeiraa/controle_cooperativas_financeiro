
// FORMULÁRIO DE CONTAS A PAGAR
// Operações: Create, Read e Update.

(() => {
    "use strict";

    const raiz = document.getElementById("contaFormApp");

    if (!raiz) return;

    const API = raiz.dataset.apiBackend ||
        "http://localhost:40000";

    const operacao = raiz.dataset.operacao;
    const contaID = raiz.dataset.id;

    const token = localStorage.getItem("token");

    const formulario =
        document.getElementById("formConta");

    const mensagem =
        document.getElementById("mensagemConta");

    const categoria =
        document.getElementById("categoria_id");

    const btnSalvar =
        document.getElementById("salvarConta");

    // Mostra mensagens ao usuário.
    const Aviso = (texto, tipo = "danger") => {
        mensagem.textContent = texto;
        mensagem.className = "alert alert-" + tipo;
        mensagem.hidden = false;
    };

    // Função compartilhada de requisições.
    const Api = async (caminho, opcoes = {}) => {
        if (!token) {
            throw new Error("Faça login para continuar.");
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
                "Erro ao acessar o servidor."
            );
        }

        return dados;
    };

    // Busca categorias cadastradas no módulo do Paulo.
    const PreencherCategorias = async () => {
        const dados = await Api("/getAllCategorias");

        categoria.replaceChildren();

        categoria.add(
            new Option("Selecione uma categoria", "")
        );

        for (const cat of (dados.registro || [])) {
            categoria.add(
                new Option(cat.nome, String(cat.id))
            );
        }
    };

    // FUNÇÃO 2 - GET BY ID
    // Busca a conta para visualizar ou editar.
    const vwGetContaByID = async (id) => {
        const dados = await Api("/getContaByID/" + id);

        const conta = dados.registro?.[0];

        if (!conta) {
            throw new Error("Conta não encontrada.");
        }

        document.getElementById("idConta").value =
            conta.id;

        document.getElementById("descricao").value =
            conta.descricao;

        document.getElementById("valor").value =
            Number(conta.valor).toFixed(2);

        document.getElementById("data_vencimento").value =
            conta.data_vencimento;

        document.getElementById("pago").checked =
            Boolean(conta.pago);

        // Permite visualizar contas cuja categoria
        // foi removida logicamente depois do cadastro.
        const categoriaEncontrada = [
            ...categoria.options
        ].some((opcao) => {
            return opcao.value === String(conta.categoria_id);
        });

        if (!categoriaEncontrada) {
            categoria.add(
                new Option(
                    conta.categoria_nome + " (categoria removida)",
                    String(conta.categoria_id)
                )
            );
        }

        categoria.value = String(conta.categoria_id);

        return conta;
    };

    // Lê os campos do formulário.
    const LerFormulario = () => {
        return {
            descricao: document
                .getElementById("descricao")
                .value.trim(),

            valor: Number(
                document.getElementById("valor").value
            ),

            data_vencimento: document
                .getElementById("data_vencimento")
                .value,

            pago: document
                .getElementById("pago")
                .checked,

            categoria_id: Number(categoria.value)
        };
    };

    // FUNÇÃO 3 - INSERT
    const vwInsertConta = async (dados) => {
        return Api("/insertConta", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });
    };

    // FUNÇÃO 4 - UPDATE
    const vwUpdateConta = async (id, dados) => {
        return Api("/updateConta/" + id, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });
    };

    // Inicializa a tela.
    const Iniciar = async () => {
        try {
            await PreencherCategorias();

            // Cadastro começa vazio.
            // Edição e visualização buscam dados pelo ID.
            if (operacao !== "novo") {
                await vwGetContaByID(contaID);
            }

            // Se a operação for visualização,
            // desabilita todos os campos.
            if (operacao === "visualizar") {
                const controles = formulario.querySelectorAll(
                    "input, select, textarea"
                );

                controles.forEach((controle) => {
                    controle.disabled = true;
                });

                btnSalvar.classList.add("d-none");
            }

        } catch (erro) {
            Aviso(erro.message);
            btnSalvar.disabled = true;
        }
    };

    // Quando o usuário clicar em Salvar.
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (operacao === "visualizar") return;

        const dados = LerFormulario();

        // Validação básica no navegador.
        if (
            !dados.descricao ||
            !dados.data_vencimento ||
            !dados.categoria_id ||
            !Number.isFinite(dados.valor) ||
            dados.valor <= 0
        ) {
            Aviso(
                "Preencha descrição, valor positivo, vencimento e categoria."
            );
            return;
        }

        btnSalvar.disabled = true;

        try {
            if (operacao === "novo") {
                await vwInsertConta(dados);
            } else {
                await vwUpdateConta(contaID, dados);
            }

            // Retorna para a listagem.
            window.location.href = "/contas";

        } catch (erro) {
            Aviso(erro.message);
            btnSalvar.disabled = false;
        }
    });

    // Carrega os dados quando a página inicia.
    Iniciar();

})();
