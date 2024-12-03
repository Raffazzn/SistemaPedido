let editandoConta = null;

// Refatorar função para enviar os dados para o back-end
document.getElementById("btn-salvar-contas").addEventListener("click", async function(){
    const contaInst = document.getElementById("instituiçãoFinanceira").value;
    const contaTipo = document.getElementById("tipoConta").value;
    const descricao = document.getElementById("descricaoConta").value;
    const nome = document.getElementById("nomeConta").value;
    const cpf = parseFloat(document.getElementById("cpfUsuario").value);

    if (contaInst === "" || contaTipo === "" || descricao === "" || cpf === "" || nome === "" ){
        alert("Preencha todos os campos");
        return;
    } else {
        if (editandoConta !== null){
            const response = await fetch("http://localhost:8000/contas", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({contaInst, contaTipo, descricao, cpf, nome}),
            });
            
            if (response.status == 200){
                editandoConta.children[0].textContent = contaInst;
                editandoConta.children[1].textContent = contaTipo;
                editandoConta.children[2].textContent = descricao;
                editandoConta.children[3].textContent = cpf;
                editandoConta.children[4].textContent = nome;
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }            
        } else {
            const response = await fetch("http://localhost:8000/contas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({contaInst, contaTipo, descricao, cpf, nome}),
            });
            
            if (response.status == 200){
                adicionarLinhaTabelaConta(contaInst, contaTipo, descricao, cpf, nome);
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }
        }
        
        limparFormularioConta();
    }
})

function adicionarLinhaTabelaConta(contaInst, contaTipo, descricao, cpf, nome){
    const corpoTabela = document.getElementById("tabela-contas");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${contaInst}</td>
        <td>${contaTipo}</td>
        <td>${descricao}</td>
        <td>${cpf}</td>
        <td>${nome}</td>
        <td>
            <button type="button" class="btn-acao btn-editar">Editar</button>
            <button type="button" class="btn-acao btn-excluir">Excluir</button>
        </td>
    `
    novaLinha.querySelector(".btn-editar").
        addEventListener("click", function(){
        editarRegistroProduto(novaLinha);
    });
    
    novaLinha.querySelector(".btn-excluir").
        addEventListener("click", function(){
        excluirRegistroProduto(novaLinha);
    });
    
    corpoTabela.appendChild(novaLinha);
}

function limparFormularioProduto(){
    document.getElementById("instituiçãoFinanceira").value = "";
    document.getElementById("tipoConta").value = "";
    document.getElementById("descricaoConta").value = "";
    document.getElementById("cpfUsuario").value = "";
    document.getElementById("nomeConta").value = "";
}

// Refatorando - Exclui no back-end
async function excluirRegistroProduto(linha){
    if (confirm("Tem certeza que deseja excluir esta linha?")){
        const response = await fetch("http://localhost:8000/contas", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nome: linha.children[4].textContent}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

function editarRegistroProduto(linha){
    document.getElementById("instituiçãoFinanceira").value = linha.children[0].textContent;
    document.getElementById("tipoConta").value = linha.children[1].textContent;
    document.getElementById("descricaoConta").value = linha.children[2].textContent;
    document.getElementById("cpfUsuario").value = linha.children[3].textContent;
    document.getElementById("nomeConta").value = linha.children[4].textContent;
    
    editandoConta = linha;
}


// Refatoração - Acessar o Back End
async function getContas(){
    const response = await fetch("http://localhost:8000/contas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-contas");
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (produto of data){
            adicionarLinhaTabelaConta(produto.contaInst, produto.contaTipo, produto.descricao, produto.cpf, produto.nome);    
        }        
    } else {
        errorMessage = await response.text();
        console.log("Erro: ", errorMessage);
    }
}
