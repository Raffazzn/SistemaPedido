const express = require("express");
const bodyParser = require("body-parser");
const cors =  require("cors");
const userService = require("./service/userService");
const contatoService = require("./service/contatoService");
// const ContasClasseService  = require("./service/ContasClasseService");
const contaService = require("./service/contaService");
const pedidoService = require("./service/pedidoService");
const homeService = require("./service/homeService");
const relatorioService = require("./service/relatorioService");


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", async(req, res) => {
    res.status(200).send("Servidor Rodando");
})

// Rotas para Usuário
app.post("/auth/new", async(req, res) => {
    console.log(req.body);

    if(!userService.findUserByEmail(req.body.userEmail)){
        userService.addUser(req.body);
        res.status(200).send("Usuário cadastrado com Sucesso!");
    } else {
       res.status(400).send("Erro! Email já existe"); 
    }
})

app.post("/auth/login", async(req, res) => {
    console.log("Login: ", req.body);

    const token = await userService.login(req.body)

    console.log("Token: ", token);

    if (token){
        res.status(200).send(token);
    } else {
        res.status(401).send("Erro: Credenciais não conferem");
    }
})

// Rota para contatos
// ----------------------------------------------------------
app.get("/contato", async(req, res) => {
    const contatos = contatoService.listContatos();
    res.status(200).json(contatos);
});

app.post("/contato", async(req, res) => {
    let contato = contatoService.findContatoByCPF(req.body.cpf);
    if (!contato){
        contato = contatoService.addContato(req.body);    
        if (contato){
            res.status(200).json(contato);
        } else {
            res.status(500).send("Erro Interno");         
        }        
    } else {
        res.status(400).send("Erro! Já existe um contato com este CPF");     
    }   
});
// Atualiza os dados do contato
app.put("/contato", async(req, res) => {
    let contato = contatoService.findContatoByCPF(req.body.cpf);
    if (contato){
        contato = contatoService.updateContato(req.body);        
        if (contato){
            res.status(200).json(contato);
        } else {
            res.status(500).send("Erro Interno");         
        }
    } else {
        res.status(400).send("Erro! Não existe um contato com este Email");     
    }   
});
// Apagar o contato da lista
app.delete("/contato", async(req, res) => {
    const contato = contatoService.findContatoByCPF(req.body.cpf);
    if (contato){
        if (contatoService.deleteContato(req.body.cpf)){
            res.status(200).send("Contato excluido com sucesso");
        } else {
            res.status(500).send("Erro Interno");         
        }        
    } else {
        res.status(400).send("Erro! Não existe um contato com este CPF");     
    }     
})

// Rota de Contas
// -------------------------------------------------
app.get("/contas", async(req, res) => {
    const contas = contaService.listContas();
    res.status(200).json(contas);
});

app.post("/contas", async(req, res) => {
    const contas = contaService.findContasByNome(req.body.nome);
    if (!contas){
        contaService.addContas(req.body);
        const contas = contaService.listContas();
        res.status(200).json(contas);   
    } else {
        res.status(400).send("Erro! Já existe uma conta com este nome");     
    }   
});

app.put("/contas", async(req, res) => {
    const contas = contaService.findContasByNome(req.body.nome);
    if (contas){
        contaService.updateContas(req.body);
        const contas = contaService.listContas();
        res.status(200).json(contas);   
    } else {
        res.status(400).send("Erro! Não existe uma conta com este nome");     
    }   
});


app.delete("/contas", async(req, res) => {
    console.log("apagar: ",req.body);
    const contas = contaService.findContasByNome(req.body.nome);
    if (contas){
        contaService.deleteContas(req.body.nome);
        const contas = contaService.listContas();
        res.status(200).json(contas);   
    } else {
        res.status(400).send("Erro! Não existe uma conta com este nome");     
    }     
})

// Rota de Produto Classes
// -------------------------------------------------
app.get("/produtoClasse", async(req, res) => {
    const produtoClasses = produtoClasseService.listProdutoClasses();
    res.status(200).json(produtoClasses);
});

app.post("/produtoClasse", async(req, res) => {
    let produtoClasse = produtoClasseService.findProdutoClasseByDescricao(req.body.descricao);
    if (!produtoClasse){
        produtoClasse = produtoClasseService.addProdutoClasse(req.body);
        if (produtoClasse)
            res.status(200).json(produtoClasse);
        else
            res.status(500).send("Erro Interno");         
    } else {
        res.status(400).send("Erro! Já existe uma Classe de Produto com essa Descrição");     
    }   
});

// Atualiza os dados do produto
app.put("/produtoClasse", async(req, res) => {
    let produtoClasse = produtoClasseService.findProdutoClasseByDescricao(req.body.descricaoAnterior);
    if (produtoClasse){
        produtoClasse = produtoClasseService.updateProdutoClasse(req.body);
        if (produtoClasse)
            res.status(200).json(produtoClasse);   
        else
            res.status(500).send("Erro Interno");         
    } else {
        res.status(400).send("Erro! Não existe uma Classe de Produtos com essa Descrição");     
    }   
});

// Apagar o produto da lista
app.delete("/produtoClasse", async(req, res) => {
    let produtoClasse = produtoClasseService.findProdutoClasseByDescricao(req.body.descricao);
    if (produtoClasse){
        if (produtoClasseService.deleteProdutoClasse(req.body.descricao))
            res.status(200).send("Classe de Produto excluída com sucesso");   
        else
            res.status(500).send("Erro Interno");         
    } else {
        res.status(400).send("Erro! Não existe uma Classe de Produtos com essa Descrição");     
    }     
})


// Rota de Pedidos
// -------------------------------------------------
app.get("/pedido", async(req, res) => {
    const pedidos = pedidoService.listPedidos();
    res.status(200).json(pedidos);
});

app.post("/pedido", async(req, res) => {
    if (!req.body.numero){
        const pedido = pedidoService.addPedido(req.body);
        
        if (pedido){
            console.log("enviar pedido: ", pedido);
            res.status(200).json(pedido);
        } else {
            res.status(400).send("Erro no processamento do pedido");         
        }
        
    } else {
        res.status(400).send("Erro! Já existe um pedido com este Número");     
    }   
});

// Atualiza os dados do contato
app.put("/pedido", async(req, res) => {
    console.log("Editar Pedido: ", req.body);

    const pedido = pedidoService.findPedidoByNumero(req.body.numero);

    if (pedido){
        pedidoService.updatePedido(req.body);
        res.status(200).send("Pedido atualizado com sucesso!");   
    } else {
        res.status(400).send("Erro! Não existe um pedido com este número");     
    }   
});

// Apagar o contato da lista
app.delete("/pedido", async(req, res) => {
    const pedido = pedidoService.findPedidoByNumero(req.body.numero);
    if (pedido){
        pedidoService.deletePedido(req.body.numero);
        res.status(200).send("Pedido removido com sucesso!");   
    } else {
        res.status(400).send("Erro! Não existe um pedido com este número");     
    }   
});

// Obter pedido individual
app.get("/pedido/:id", async(req, res) => {
    if (req.params.id){
        // obter o número do pedido enviado como parâmetro na URL
        const id = parseInt(req.params.id);
        
        const pedido = pedidoService.findPedidoByNumero(id);
        if (pedido){
            res.status(200).json(pedido);   
        } else {
            res.status(400).send("Erro! Não existe um pedido com este número");     
        }   
    } else {
        res.status(400).send("Erro! Não foi passado o número do pedido");     
    }    
});


// Rota de Dashboard
// -------------------------------------------------
app.get("/home", async(req, res) => {
    const homeCard = homeService.homeCard();
    res.status(200).json(homeCard);
    
});


// Rota de Relatório
// -------------------------------------------------
app.get("/relatorio/geral", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasGeral();
    res.status(200).json(relatorio);
});
app.get("/relatorio/usuario", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasPorUsuario();
    res.status(200).json(relatorio);
});
app.get("/relatorio/contato", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasPorContato();
    res.status(200).json(relatorio);
});
app.get("/relatorio/localidade", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasPorLocalidade();
    res.status(200).json(relatorio);
});
app.get("/relatorio/produto", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasPorProduto();
    res.status(200).json(relatorio);
});
app.get("/relatorio/classificacao", async(req, res) => {
    const relatorio = relatorioService.relatorioVendasPorClassificacao();
    res.status(200).json(relatorio);
});


app.listen(8000, ()=> {
    console.log("Servidor rodando na porta 8000");
})