const fs = require("fs");
const path = require("path");

let pedidos = [];

const filePath = path.resolve("db/", "pedidos.json");

// Função que salva a lista de pedidos na pasta db
const savePedidosToFile = () => {
    fs.writeFile(filePath, JSON.stringify(pedidos, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar pedidos no arquivo:", err);
        } else {
            console.log("pedidos Salvos com sucesso")
        }
    })
}
// Função que carrega os pedidos salvos na pasta
const loadPedidosFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de pedidos", err);
            } else if (data.trim() === ""){
                pedidos = [];
                console.log("Arquivo de pedidos está vazio");
            } else {
                try {
                    pedidos = JSON.parse(data);
                    console.log("pedidos carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}

// Função para obter o próximo número do pedido
const getNextPedidoNumero = () => {
    if (pedidos.length === 0) {
        return 1; // Se não houver pedidos, começa do número 1
    }
    const maxNumero = Math.max(...pedidos.map(pedido => pedido.numero));
    return maxNumero + 1; // Incrementa o maior número existente
};

// Função para salvar o pedido
const addPedido = (value) => {
    const nroPedido = getNextPedidoNumero(); // Obtem o próximo numero de pedidos

    const pedido = {
        numero : nroPedido,
        data : value.data,        
        userName: value.userName,
        contato : value.contato,
        produtos : value.produtos,
        valorTotal : value.valorTotal,
    }

    pedidos.push(pedido);
    savePedidosToFile();
    console.log("pedido Cadastrado: ", pedido);
    return pedido;
}

const findPedidoByNumero = (numero) => {
    return pedidos.find(pedido => pedido.numero === numero) || null;
}

const updatePedido = (value) => {
    const pedido = findPedidoByNumero(value.numero);

    if (pedido){
        pedido.contato = value.contato,
        pedido.userName = value.userName,
        pedido.produtos = value.produtos,
        pedido.valorTotal = value.valorTotal;
    
        savePedidosToFile();
        console.log("pedido atualizado: ", pedido);
        
        return pedido;
    } else {
        return null;
    }
}

const deletePedido = (numero) => {
    const index = pedidos.findIndex(pedido => pedido.numero === numero);

    if (index !== -1){
        pedidos.splice(index, 1); // remove o pedido da lista
        savePedidosToFile()
        console.log("pedido Deletado: ", numero);
        return true;
    } else {
        return false;
    }
}

// Função que devolve a lista de pedidos
const listPedidos = () => {
    return pedidos;
}

// Carrega os pedidos salvos no arquivo ao iniciar
loadPedidosFromFile();

// Exportamos as funções para poder utilizar nos outros módulos
exports.findPedidoByNumero = findPedidoByNumero;
exports.addPedido = addPedido;
exports.updatePedido = updatePedido;
exports.deletePedido = deletePedido;
exports.listPedidos = listPedidos;