let editandoPedido = null;
let editandoProdutoPedido = null;

// document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-pedido');
    const btnIncluirPedido = document.getElementById('btn-incluir-pedido');
    const btnFecharModal = document.getElementById('fechar-modal');
    const formPedido = document.getElementById('form-pedido');
    const itensPedido = document.getElementById('itens-pedido');
    const valorTotalPedido = document.getElementById('valorTotalPedido');       

    let totalPedido = 0;            // Valor total do pedido    
    let seqProdutoPedido = 0;       // Sequencia de itens do pedido
    let produtosPedido = [];        // Armazena os produtos adicionados ao pedido   
    let contatosCadastrados = [];   // Lista de Contatos Cadastrados
    let produtosCadastrados = [];   // Lista de Produtos Cadastrados

    // Abrir o modal ao clicar no botão "Incluir Novo Pedido"
    btnIncluirPedido.addEventListener('click', () => {
        modal.style.display = 'block';

        // Preenche a data atual no campo de data do pedido
        const dataAtual = new Date().toLocaleString();
        document.getElementById('dataPedido').value = dataAtual;

        // Preenche o campo de usuário logado
        document.getElementById('usuarioPedido').value = usuarioLogado.userName;

        // Define a quantidade de produto para 1 unidade
        document.getElementById('qtdeProdutoPedido').value = 1;
       
        produtosPedido = [];    // Zerar os produtos adicionados ao pedido
        totalPedido = 0.0;      // Zerar o Valor total do pedido
        seqProdutoPedido = 0;   // Zerar a Sequencia de itens do pedido    
        carregarContatos();     // Carrega a lista de Contatos do BackEnd
        carregarProdutos();     // Carrega a lista de Produtos do BackEnd
        
        editandoPedido = null;
        editandoProdutoPedido = null;
        document.getElementById('numeroPedido').value = "";
        document.getElementById('stRegistroPedido').innerHTML = "Novo Pedido";
    });

    // Fechar o modal ao clicar no "X"
    btnFecharModal.addEventListener('click', () => {
        modal.style.display = 'none';
        limparFormulario();
    });

    //Fechar o modal ao clicar fora da área do modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            limparFormulario();
        }
    });
    
    // Função para adicionar ou editar um produto ao pedido
    document.getElementById('btn-add-produto-pedido').addEventListener('click', () => {
        const produtoSelect = document.getElementById('produtoPedido');
        const qtdeProduto = parseInt(document.getElementById('qtdeProdutoPedido').value);
        const produtoSelecionado = produtoSelect.value;
        const produtoOriginal = produtosCadastrados.find(p => p.codigo == produtoSelecionado);

        if (produtoOriginal) {
            // Cria uma cópia do objeto produto para evitar alterações no objeto original
            const produtoPedido = {
                ...produtoOriginal,
                quantidade: qtdeProduto,
                valorTotal: +((qtdeProduto * produtoOriginal.valor).toFixed(2)),
                item: editandoProdutoPedido ? editandoProdutoPedido.produtoPedido.item : ++seqProdutoPedido // Mantém o item se for edição
            };

            if (editandoProdutoPedido === null) {
                // Novo Registro: adiciona o produto à lista de itens do pedido
                produtosPedido.push(produtoPedido);

                // Atualiza o valor total do pedido
                totalPedido += produtoPedido.valorTotal;
                valorTotalPedido.value = totalPedido;

                // Adiciona o produto na tabela de visualização
                adicionarLinhaProdutoPedido(produtoPedido);

            } else {
                // Editando Registro: substitui o produto existente
                const index = produtosPedido.findIndex(p => p.item === editandoProdutoPedido.produtoPedido.item);

                if (index !== -1) {
                    // Subtrai o valor total anterior antes de atualizar o item
                    totalPedido -= produtosPedido[index].valorTotal;

                    // Substitui o produto na lista `produtosPedido`
                    produtosPedido[index] = produtoPedido;

                    // Atualiza o valor total do pedido com o novo valor do produto
                    totalPedido += produtoPedido.valorTotal;
                    valorTotalPedido.value = totalPedido;

                    // Atualiza a linha de exibição do produto
                    editandoProdutoPedido.linha.children[0].textContent = produtoPedido.item;
                    editandoProdutoPedido.linha.children[1].textContent = produtoPedido.codigo;
                    editandoProdutoPedido.linha.children[2].textContent = produtoPedido.descricao;
                    editandoProdutoPedido.linha.children[3].textContent = produtoPedido.quantidade;
                    editandoProdutoPedido.linha.children[4].textContent = produtoPedido.valor;
                    editandoProdutoPedido.linha.children[5].textContent = produtoPedido.valorTotal;
                }
                // Reseta a edição do produto
                editandoProdutoPedido = null;
            }

            // Limpa os campos de entrada após adicionar ou editar
            document.getElementById('qtdeProdutoPedido').value = 1;
            document.getElementById('produtoPedido').value = "";
        }
    });

    // Função para Iniciar a edição de um produto do pedido
    function editarProdutoPedido(linha, produtoPedido){
        document.getElementById('produtoPedido').value = produtoPedido.codigo;
        document.getElementById('qtdeProdutoPedido').value = produtoPedido.quantidade;                
        editandoProdutoPedido = {linha, produtoPedido};
    }   

    // Função para excluir um produto do pedido
    function excluirProdutoPedido(linha, produto) {
        const index = produtosPedido.findIndex(p => p.item === produto.item);

        if (index !== -1){
            produtosPedido.splice(index, 1); // remove o produto da lista
           
            itensPedido.removeChild(linha);            
            totalPedido -= produto.valorTotal;
            
            // Vamos garantir o arredondamento de casas decimais
            totalPedido = +(totalPedido.toFixed(2))
            
            valorTotalPedido.value = totalPedido;
        } else {
            alert("Não foi possivel remover o produto do pedido");
        }
    }

    // Função para limpar os campos do formulário
    function limparFormulario() {
        produtosPedido = [];
        totalPedido = 0;
        valorTotalPedido.value = '';
        itensPedido.innerHTML = ''; // Limpa a lista de itens do pedido
    }

    // Função para salvar o pedido
    formPedido.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const cpfContato = document.getElementById('contatoPedido').value;

        if (cpfContato == "" || totalPedido == 0){
            alert("Favor completar todos os dados");
            return;
        } else {
            const data = document.getElementById('dataPedido').value;
            const cpfContato = document.getElementById('contatoPedido').value;
            const userName = document.getElementById('usuarioPedido').value;
            const contatoOriginal  = contatosCadastrados.find(c => c.cpf == cpfContato);
    

            if (contatoOriginal ) {
                // Cria uma cópia do produto para evitar alterações no objeto original
                const contato = {
                    ...contatoOriginal
                };

                if (editandoPedido !== null){
                    // converter o número do pedido de string para inteiro
                    const numero = parseInt(document.getElementById('numeroPedido').value);

                    const response = await fetch("http://localhost:8000/pedido", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body : JSON.stringify({numero, data, userName, contato, valorTotal : totalPedido, produtos : produtosPedido }),
                    });
                    
                    if (response.status == 200){
                        editandoPedido.children[0].textContent = numero;
                        editandoPedido.children[1].textContent = data;
                        editandoPedido.children[2].textContent = contato.nome;
                        editandoPedido.children[3].textContent = userName;
                        editandoPedido.children[4].textContent = totalPedido;
                    } else {
                        const errorMessage = await response.text();
                        alert("Erro: "+errorMessage);
                    }            
                } else {
                    const response = await fetch("http://localhost:8000/pedido", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body : JSON.stringify({data, userName, contato, valorTotal: totalPedido, produtos : produtosPedido }),
                    });
                    
                    if (response.status == 200){
                        pedidoBack = await response.json();    
                        adicionarLinhaTabelaPedido(pedidoBack.numero, pedidoBack.data, pedidoBack.contato.nome, pedidoBack.userName, pedidoBack.valorTotal);
                    } else {
                        const errorMessage = await response.text();
                        alert("Erro: "+errorMessage);
                    }
                }

            }        
            
        }
        
        // Fecha o modal e limpa o formulário
        modal.style.display = 'none';
        limparFormulario();
    });

    async function carregarContatos(){
        const response = await fetch("http://localhost:8000/contato", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },        
        });
    
        if (response.status == 200){
            contatosCadastrados = await response.json();

            // Carrega as opções de contato no campo de seleção
            const contatoSelect = document.getElementById('contatoPedido');
            
            contatoSelect.innerHTML = ""; // Limpa/Reset os contatos anteriores

            // Adicionar o primeiro contato como sendo opção de orientação
            const option = document.createElement('option');
                option.value = "";
                option.textContent = "Selecionar um Contato";
                option.selected = true;
                option.disabled = true;    
                contatoSelect.appendChild(option);            

            contatosCadastrados.forEach(contato => {
                const option = document.createElement('option');
                option.value = contato.cpf;
                option.textContent = contato.nome;
                contatoSelect.appendChild(option);
            });

        } else {
            errorMessage = await response.text();
            console.log("Erro: ", errorMessage);
        }
    }

    async function carregarProdutos(){
        const response = await fetch("http://localhost:8000/produto", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },        
        });
    
        if (response.status == 200){
            produtosCadastrados = await response.json();
            
            // Carrega as opções de produtos no campo de seleção
            const produtoSelect = document.getElementById('produtoPedido');
            produtoSelect.innerHTML = "";

            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Selecionar Produto";
            option.selected = true;
            option.disabled = true;
            produtoSelect.appendChild(option);
        
            produtosCadastrados.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.codigo;
                option.textContent = `${produto.descricao} - R$ ${produto.valor}`;
                produtoSelect.appendChild(option);
            });
           
        } else {
            const errorMessage = response.text();
            console.log("Erro: ", errorMessage);
        }
    }

    function adicionarLinhaTabelaPedido(numero, data, contato, usuario, totalPedido){
        const corpoTabela = document.getElementById("tabela-pedido");
    
        // Adiciona o pedido à tabela
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${numero}</td>
            <td>${data}</td>
            <td>${contato}</td>
            <td>${usuario}</td>
            <td>${totalPedido}</td>
            <td>
                <button class="btn-acao btn-editar">Editar</button>
                <button class="btn-acao btn-excluir">Excluir</button>
            </td>
        `;
        
        // Adiciona evento de editar do pedido
        novaLinha.querySelector(".btn-editar").addEventListener("click", function(){
            editarRegistroPedido(novaLinha);
        });
    
        // Adiciona evento de exclusão do pedido
        novaLinha.querySelector(".btn-excluir").addEventListener("click", function(){
            excluirRegistroPedido(novaLinha);
        });
       
        corpoTabela.appendChild(novaLinha);
    }    

    // função que adiciona um produto na tabela de produtos
    function adicionarLinhaProdutoPedido(produtoPedido){        
        // Cria um elemento DOM de linha com os dados do produto
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${produtoPedido.item}</td>
            <td>${produtoPedido.codigo}</td>
            <td>${produtoPedido.descricao}</td>
            <td>${produtoPedido.quantidade}</td>
            <td>${produtoPedido.valor}</td>
            <td>${produtoPedido.valorTotal}</td>
            <td>
                <button type="button" class="btn-acao btn-editar">Editar</button>
                <button type="button" class="btn-acao btn-excluir">Excluir</button>
            </td>
        `;
        
        // Adiciona a função de edição de item do pedido
        novaLinha.querySelector('.btn-editar').addEventListener('click', () => {
            editarProdutoPedido(novaLinha, produtoPedido);
        });

        // Adiciona a função de exclusão de item do pedido
        novaLinha.querySelector('.btn-excluir').addEventListener('click', () => {
            excluirProdutoPedido(novaLinha, produtoPedido);
        });

        // Adiciona o produto na tabela para exibir os dados
        itensPedido.appendChild(novaLinha);
    }
// });

async function getPedidos(){
    const response = await fetch("http://localhost:8000/pedido", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-pedido"); 
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (pedido of data){
            adicionarLinhaTabelaPedido(pedido.numero, pedido.data, pedido.contato.nome, pedido.userName, pedido.valorTotal);    
        }
       
        console.log("Sucesso Pedido: ", data);
    } else {
        errorMessage = response.text();
        console.log("Erro Pedido: ", errorMessage);
    }

    const totais = await fetch("http://localhost:8000/home", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (totais.status == 200){
        const dataTotal = await totais.json();

        document.getElementById("card-pedido-pedido").innerHTML = dataTotal.pedidosCard.qtde + ' - ' +dataTotal.pedidosCard.valorTotal.toFixed(2);
        document.getElementById("card-contato-pedido").innerHTML = dataTotal.contatosCard.qtde;
        document.getElementById("card-produto-pedido").innerHTML = dataTotal.produtosCard.qtde;
        document.getElementById("card-classificacao-pedido").innerHTML = dataTotal.produtoClassesCard.qtde;
    } else {
        errorMessage = await totais.text();
        console.log("Erro: ", errorMessage);
    } 
    
}


// Excluir Pedido
async function excluirRegistroPedido(linha){
    if (confirm("Tem certeza que deseja excluir este pedido?")){
        const response = await fetch("http://localhost:8000/pedido", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({numero: parseInt(linha.children[0].textContent)}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

async function editarRegistroPedido(linha){
    const response = await fetch(`http://localhost:8000/pedido/${linha.children[0].textContent}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });
    
    if (response.status === 200){
        carregarContatos();
        carregarProdutos();

        const data = await response.json();
        const modal = document.getElementById('modal-pedido');
       
        totalPedido      = data.valorTotal;                                          // Valor total do pedido    
        seqProdutoPedido = Math.max(...data.produtos.map(produto => produto.item));  // Sequencia de itens do pedido
        produtosPedido   = [...data.produtos];                                       // Armazena os produtos adicionados ao pedido   
          
        editandoPedido = linha;
        editandoProdutoPedido = null;    

        document.getElementById('valorTotalPedido').value  = totalPedido;
        document.getElementById('numeroPedido').value      = data.numero;
        document.getElementById('usuarioPedido').value     = data.userName;
        document.getElementById('dataPedido').value        = data.data;
        document.getElementById('qtdeProdutoPedido').value = "1";
        document.getElementById('stRegistroPedido').innerHTML = "Editando Pedido Nº: "+data.numero;

        // Verifique os valores do CPF do contato e no select
        const contatoSelect = document.getElementById('contatoPedido');

        // Temporizador para definir o valor após garantir que o select foi atualizado
        setTimeout(() => {
            contatoSelect.value = data.contato.cpf;
            if (contatoSelect.value !== data.contato.cpf) {
                console.warn("Valor não encontrado no select.");
            }
        }, 100); // 1

         // Limpa a lista de itens do pedido
        itensPedido.innerHTML = "";

        // Vai percorrer a lista de itens do pedido e popular a tabela
        for (produto of data.produtos){
            adicionarLinhaProdutoPedido(produto);            
        }

        // exibe o Modal do Pedido na tela        
        modal.style.display = "block";        
    } else {
        const errorMessage = await response.text();
        alert("Erro: "+errorMessage);
    }
}
