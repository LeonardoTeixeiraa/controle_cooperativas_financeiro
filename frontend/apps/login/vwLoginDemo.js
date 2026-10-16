
// Identifica o formulário quando a página terminar de carregar
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formLogin");
    const mensagem = document.getElementById("mensagemLogin");
    const botao = document.getElementById("btnEntrar");

    // Recupera o endereço do Back-End enviado pelo Nunjucks
    const servidorDw3 = form.dataset.backendUrl;

    // Escuta quando o usuário clicar em Entrar
    form.addEventListener("submit", async (event) => {

        // Evita que o formulário recarregue a página
        event.preventDefault();

        mensagem.classList.add("d-none");
        botao.disabled = true;
        botao.textContent = "Entrando...";

        // Recupera os valores digitados
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {

            // Envia as credenciais para o Back-End do Leo
            const resposta = await fetch(servidorDw3 + "/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Converte a resposta do servidor para JSON
            const dados = await resposta.json();

            // Verifica se a autenticação funcionou
            if (!resposta.ok || dados.auth !== true || !dados.token) {
                throw new Error(dados.message || "Login inválido.");
            }

            // Guarda o JWT para as próximas requisições
            localStorage.setItem("token", dados.token);
            localStorage.setItem("username", username);

            // Redireciona para nosso painel
            window.location.href = "/home";

        } catch (erro) {

            // Mostra a mensagem ao usuário
            mensagem.textContent = erro.message;
            mensagem.classList.remove("d-none");

        } finally {

            // Libera o botão novamente
            botao.disabled = false;
            botao.textContent = "Entrar";
        }

    });

});
