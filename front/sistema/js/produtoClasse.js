let editandoProdutoClasse = null;

// Refatorar função para enviar os dados para o back-end
document.getElementById("btn-salvar-produtoClasse").addEventListener("click", async function(){
    const descricao = document.getElementById("descricaoProdutoClasse").value;
    const descricaoAnterior = document.getElementById("descricaoAnteriorProdutoClasse").value;

    if (descricao === ""){
        alert("Preencha a Descrição da Classificação");
        return;
    } else {
        if (editandoProdutoClasse !== null){
            const response = await fetch("http://localhost:8000/produtoClasse", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({descricao, descricaoAnterior}),
            });
            
            if (response.status == 200){
                editandoProdutoClasse.children[0].textContent = descricao;
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }            
        } else {
            const response = await fetch("http://localhost:8000/produtoClasse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({descricao}),
            });
            
            if (response.status == 200){
                adicionarLinhaTabelaProdutoClasse(descricao);
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }
        }
        
        limparFormularioProdutoClasse();
    }
})

function adicionarLinhaTabelaProdutoClasse(descricao){
    const corpoTabela = document.getElementById("tabela-produtoClasse");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${descricao}</td>
        <td>
            <button class="btn-acao btn-editar">Editar</button>
            <button class="btn-acao btn-excluir">Excluir</button>
        </td>
    `
    novaLinha.querySelector(".btn-editar").
        addEventListener("click", function(){
        editarRegistroProdutoClasse(novaLinha);
    });
    
    novaLinha.querySelector(".btn-excluir").
        addEventListener("click", function(){
        excluirRegistroProdutoClasse(novaLinha);
    });
    
    corpoTabela.appendChild(novaLinha);
}

function limparFormularioProdutoClasse(){
    document.getElementById("descricaoProdutoClasse").value = "";
    document.getElementById("descricaoAnteriorProdutoClasse").value = "";
}

// Refatorando - Exclui no back-end
async function excluirRegistroProdutoClasse(linha){
    if (confirm("Tem certeza que deseja excluir esta linha?")){
        const response = await fetch("http://localhost:8000/produtoClasse", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({descricao: linha.children[0].textContent}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

function editarRegistroProdutoClasse(linha){
    document.getElementById("descricaoProdutoClasse").value = linha.children[0].textContent;
    document.getElementById("descricaoAnteriorProdutoClasse").value = linha.children[0].textContent;
    
    editandoProdutoClasse = linha;
}


// Refatoração - Acessar o Back End
async function getProdutoClasses(){
    const response = await fetch("http://localhost:8000/produtoClasse", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-produtoClasse");
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (produtoClasse of data){
            adicionarLinhaTabelaProdutoClasse(produtoClasse.descricao);    
        }        
    } else {
        errorMessage = response.text();
        console.log("Erro: ", errorMessage);
    }
}