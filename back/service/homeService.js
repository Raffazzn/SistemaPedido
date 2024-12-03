const contatoService = require("./contatoService");
const produtoClasseService  = require("./produtoClasseService");
const produtoService = require("./contaService");
const pedidoService = require("./pedidoService");

const pedidosCard = () => {
    const pedidos = pedidoService.listPedidos();
    return {
        qtde: pedidos.length,
        valorTotal: pedidos.reduce((acc, pedido) => acc + pedido.valorTotal, 0)
    };
};

const contatosCard = () => {
    const contatos = contatoService.listContatos();
    return {
        qtde: contatos.length,
    };
};

const produtosCard = () => {
    const produtos = produtoService.listProdutos();
    return {
        qtde: produtos.length,
    };
};

const produtoClassesCard = () => {
    const produtoClasses = produtoClasseService.listProdutoClasses();
    return {
        qtde: produtoClasses.length,
    };
};

// Aqui vamos devolver o resumo de todos os indicadores do dashboard
const homeCard = () => {
    const homeDashboard = {
        pedidosCard : pedidosCard(),
        contatosCard : contatosCard(),
        produtosCard : produtosCard(),
        produtoClassesCard : produtoClassesCard(),
    }
    return homeDashboard;
}

exports.homeCard = homeCard;
