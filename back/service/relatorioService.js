const fs = require("fs");
const path = require("path");

let pedidos = [];

const filePath = path.resolve("db/", "pedidos.json");

// Função que carrega os pedidos salvos na pasta
const loadPedidosFromFile = () => {
    if (fs.existsSync(filePath)){
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data.trim() !== "") {
            try {
                pedidos = JSON.parse(data);
                console.log("Pedidos carregados com sucesso");
            } catch (parseError) {
                console.error("Erro ao interpretar o JSON", parseError);
            }
        } else {
            pedidos = [];
            console.log("Arquivo de pedidos está vazio");
        }
    }
};

// Função que devolve a lista de pedidos
const relatorioVendasGeral = () => {
    loadPedidosFromFile();
    return pedidos;
};

// Função para gerar resumo de vendas por usuário
const relatorioVendasPorUsuario = () => {
    loadPedidosFromFile();
    const resumo = {};

    pedidos.forEach(pedido => {
        const { userName, valorTotal } = pedido;
        if (!resumo[userName]) {
            resumo[userName] = { quantidade: 0, valorTotal: 0 };
        }
        resumo[userName].quantidade += 1;
        resumo[userName].valorTotal += valorTotal;
    });

    // Convertendo para uma lista de objetos
    return Object.entries(resumo).map(([userName, data]) => ({
        usuario: userName,
        quantidade: data.quantidade,
        valorTotal: data.valorTotal
    }));
};

// Função para gerar resumo de vendas por contato
const relatorioVendasPorContato = () => {
    loadPedidosFromFile();
    const resumo = {};

    pedidos.forEach(pedido => {
        const { contato, valorTotal } = pedido;
        if (!resumo[contato.nome]) {
            resumo[contato.nome] = { quantidade: 0, valorTotal: 0 };
        }
        resumo[contato.nome].quantidade += 1;
        resumo[contato.nome].valorTotal += valorTotal;
    });

    // Convertendo para uma lista de objetos
    return Object.entries(resumo).map(([nome, data]) => ({
        contato: nome,
        quantidade: data.quantidade,
        valorTotal: data.valorTotal
    }));
};

// Função para gerar resumo de vendas por localidade
const relatorioVendasPorLocalidade = () => {
    loadPedidosFromFile();
    const resumo = {};

    pedidos.forEach(pedido => {
        const { contato, valorTotal } = pedido;
        if (!resumo[contato.localidade]) {
            resumo[contato.localidade] = { quantidade: 0, valorTotal: 0 };
        }
        resumo[contato.localidade].quantidade += 1;
        resumo[contato.localidade].valorTotal += valorTotal;
    });

    // Convertendo para uma lista de objetos
    return Object.entries(resumo).map(([localidade, data]) => ({
        localidade,
        quantidade: data.quantidade,
        valorTotal: data.valorTotal
    }));
};

// Função para gerar resumo de vendas por produto
const relatorioVendasPorProduto = () => {
    loadPedidosFromFile();
    const resumo = {};

    pedidos.forEach(pedido => {
        pedido.produtos.forEach(produto => {
            const { descricao, valorTotal } = produto;
            if (!resumo[descricao]) {
                resumo[descricao] = { quantidade: 0, valorTotal: 0 };
            }
            resumo[descricao].quantidade += produto.quantidade;
            resumo[descricao].valorTotal += valorTotal;
        });
    });

    // Convertendo para uma lista de objetos
    return Object.entries(resumo).map(([descricao, data]) => ({
        produto: descricao,
        quantidade: data.quantidade,
        valorTotal: data.valorTotal
    }));
};

// Função para gerar resumo de vendas por classificação de produto
const relatorioVendasPorClassificacao = () => {
    loadPedidosFromFile();
    const resumo = {};

    pedidos.forEach(pedido => {
        pedido.produtos.forEach(produto => {
            const { classificacao, valorTotal } = produto;
            if (!resumo[classificacao]) {
                resumo[classificacao] = { quantidade: 0, valorTotal: 0 };
            }
            resumo[classificacao].quantidade += produto.quantidade;
            resumo[classificacao].valorTotal += valorTotal;
        });
    });

    // Convertendo para uma lista de objetos
    return Object.entries(resumo).map(([classificacao, data]) => ({
        classificacao,
        quantidade: data.quantidade,
        valorTotal: data.valorTotal
    }));
};

// Exportando as funções
exports.relatorioVendasGeral = relatorioVendasGeral;
exports.relatorioVendasPorUsuario = relatorioVendasPorUsuario;
exports.relatorioVendasPorContato = relatorioVendasPorContato;
exports.relatorioVendasPorLocalidade = relatorioVendasPorLocalidade;
exports.relatorioVendasPorProduto = relatorioVendasPorProduto;
exports.relatorioVendasPorClassificacao = relatorioVendasPorClassificacao;
