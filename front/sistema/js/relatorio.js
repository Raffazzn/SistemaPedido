document.getElementById("btn-gerar-relatorio").addEventListener("click", async function() {
    const relatorioSelecionado = {
        geral: document.getElementById("venda-geral").checked,
        usuario: document.getElementById("venda-usuario").checked,
        contato: document.getElementById("venda-contato").checked,
        localidade: document.getElementById("venda-localidade").checked,
        produto: document.getElementById("venda-produto").checked,
        classificacao: document.getElementById("venda-classificacao").checked,
    };

    if (relatorioSelecionado.geral) {
        await relatorioVendaGeral();
    } else if (relatorioSelecionado.usuario) {
        await relatorioVendaUsuario();
    } else if (relatorioSelecionado.contato) {
        await relatorioVendaContato();
    } else if (relatorioSelecionado.localidade) {
        await relatorioVendaLocalidade();
    } else if (relatorioSelecionado.produto) {
        await relatorioVendaProduto();
    } else if (relatorioSelecionado.classificacao) {
        await relatorioVendaClassificacao();
    }
});

// Gerar Relatório de Vendas Geral
async function relatorioVendaGeral(){
    const response = await fetch("http://localhost:8000/relatorio/geral", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Número", "Data", "Contato", "Usuário", "Valor Pedido"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(pedido => {
            adicionarLinhaDados([
                pedido.numero, 
                pedido.data, 
                pedido.contato.nome, 
                pedido.userName, 
                pedido.valorTotal
            ]);
            totalValor += pedido.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}


// Gerar Relatório de Vendas por Usuário
async function relatorioVendaUsuario(){
    const response = await fetch("http://localhost:8000/relatorio/usuario", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Usuário", "Quantidade", "Valor Total"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(resumo => {
            adicionarLinhaDados([
                resumo.usuario, 
                resumo.quantidade, 
                resumo.valorTotal
            ]);
            totalValor += resumo.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}

// Gerar Relatório de Vendas por Contato
async function relatorioVendaContato(){
    const response = await fetch("http://localhost:8000/relatorio/contato", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Contato", "Quantidade", "Valor Total"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(resumo => {
            adicionarLinhaDados([
                resumo.contato, 
                resumo.quantidade, 
                resumo.valorTotal
            ]);
            totalValor += resumo.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}

// Gerar Relatório de Vendas por Localidade
async function relatorioVendaLocalidade(){
    const response = await fetch("http://localhost:8000/relatorio/localidade", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Localidade", "Quantidade", "Valor Total"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(resumo => {
            adicionarLinhaDados([
                resumo.localidade, 
                resumo.quantidade, 
                resumo.valorTotal
            ]);
            totalValor += resumo.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}

// Gerar Relatório de Vendas por Produto
async function relatorioVendaProduto(){
    const response = await fetch("http://localhost:8000/relatorio/produto", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Produto", "Quantidade", "Valor Total"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(resumo => {
            adicionarLinhaDados([
                resumo.produto, 
                resumo.quantidade, 
                resumo.valorTotal
            ]);
            totalValor += resumo.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}

// Gerar Relatório de Vendas por Classificação
async function relatorioVendaClassificacao(){
    const response = await fetch("http://localhost:8000/relatorio/classificacao", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status === 200){
        const headerTabela = document.getElementById("tabela-relatorio-header"); 
        const corpoTabela = document.getElementById("tabela-relatorio"); 
        const rodapeTabela = document.getElementById("tabela-relatorio-footer");

        headerTabela.innerHTML = "";
        corpoTabela.innerHTML = "";
        rodapeTabela.innerHTML = "";

        // Definindo os cabeçalhos e adicionando a linha de cabeçalho
        const headers = ["Classificação", "Quantidade", "Valor Total"];
        adicionarLinhaHeader(headers);

        // Obter dados e adicionar linhas de dados
        const data = await response.json();
        let totalValor = 0;  // Totalizador para a última coluna

        data.forEach(resumo => {
            adicionarLinhaDados([
                resumo.classificacao, 
                resumo.quantidade, 
                resumo.valorTotal
            ]);
            totalValor += resumo.valorTotal;
        });

        // Adiciona o rodapé com o totalizador na última coluna
        adicionarRodapeTabela(headers.length - 1, totalValor);

        // Função para adicionar ordenação aos cabeçalhos
        headers.forEach((header, index) => {
            headerTabela.children[0].children[index].addEventListener("click", () => ordenarPorColuna(index));
        });
        
    } else {
        console.error("Erro ao gerar o relatório: ", await response.text());
    }
}


// Função para adicionar uma linha de cabeçalho
function adicionarLinhaHeader(headers) {
    const headerTabela = document.getElementById("tabela-relatorio-header");
    const novaLinha = document.createElement("tr");

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.cursor = "pointer"; // Indicativo de que é clicável
        novaLinha.appendChild(th);
    });

    headerTabela.appendChild(novaLinha);
}

// Função para adicionar uma linha de dados
function adicionarLinhaDados(dados) {
    const corpoTabela = document.getElementById("tabela-relatorio");
    const novaLinha = document.createElement("tr");

    dados.forEach(dado => {
        const td = document.createElement("td");
        td.textContent = dado;
        novaLinha.appendChild(td);
    });

    corpoTabela.appendChild(novaLinha);
}

// Função para adicionar uma linha de rodapé com o totalizador
function adicionarRodapeTabela(colIndex, total) {
    const rodapeTabela = document.getElementById("tabela-relatorio-footer");
    const novaLinha = document.createElement("tr");

    for (let i = 0; i < colIndex; i++) {
        const td = document.createElement("td");
        novaLinha.appendChild(td);
    }

    const tdTotal = document.createElement("td");
    tdTotal.textContent = `Total: ${total.toFixed(2)}`;
    novaLinha.appendChild(tdTotal);

    rodapeTabela.appendChild(novaLinha);
}

// Função para ordenar a tabela com base na coluna clicada
function ordenarPorColuna(colIndex) {
    const corpoTabela = document.getElementById("tabela-relatorio");
    const linhas = Array.from(corpoTabela.querySelectorAll("tr"));

    // Verifica se a coluna é de número (última coluna é o total)
    const isNumericColumn = colIndex === linhas[0].children.length - 1;
    const sortedLinhas = linhas.sort((a, b) => {
        const aValue = a.children[colIndex].textContent;
        const bValue = b.children[colIndex].textContent;

        if (isNumericColumn) {
            return parseFloat(aValue) - parseFloat(bValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });

    // Limpa o corpo da tabela e insere as linhas ordenadas
    corpoTabela.innerHTML = "";
    sortedLinhas.forEach(linha => corpoTabela.appendChild(linha));
}
