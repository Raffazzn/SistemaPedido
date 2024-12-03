let editando = null;

// Refatorar função para enviar os dados para o back-end
document.getElementById("btn-salvar-contato").addEventListener("click", async function(){
    const cpf = document.getElementById("cpf").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const localidade = document.getElementById("localidade").value;

    if (cpf === "" || nome === "" || email === "" || telefone === "" || localidade === "" ){
        alert("Preencha todos os campos");
        return;
    } else {
        if (editando !== null){
            const response = await fetch("http://localhost:8000/contato", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({cpf, nome, email, telefone, localidade}),
            });
            
            if (response.status == 200){
                editando.children[0].textContent = cpf;
                editando.children[1].textContent = nome;
                editando.children[2].textContent = email;
                editando.children[3].textContent = telefone;
                editando.children[4].textContent = localidade;
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }            
        } else {
            const response = await fetch("http://localhost:8000/contato", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({cpf, nome, email, telefone, localidade}),
            });
            
            if (response.status == 200){
                adicionarLinhaTabela(cpf, nome, email, telefone, localidade);
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }
        }
        
        limparFormulario();
    }
})

function adicionarLinhaTabela(cpf, nome, email, telefone, localidade){
    const corpoTabela = document.getElementById("tabela-contato");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${cpf}</td>
        <td>${nome}</td>
        <td>${email}</td>
        <td>${telefone}</td>
        <td>${localidade}</td>
        <td>
            <button class="btn-acao btn-editar">Editar</button>
            <button class="btn-acao btn-excluir">Excluir</button>
        </td>
    `
    novaLinha.querySelector(".btn-editar").
        addEventListener("click", function(){
        editarRegistro(novaLinha);
    });
    
    novaLinha.querySelector(".btn-excluir").
        addEventListener("click", function(){
        excluirRegistro(novaLinha);
    });
    
    corpoTabela.appendChild(novaLinha);
}

function limparFormulario(){
    document.getElementById("cpf").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("localidade").value = "";
}

// Refatorando - Exclui no back-end
async function excluirRegistro(linha){
    if (confirm("Tem certeza que deseja excluir esta linha?")){
        const response = await fetch("http://localhost:8000/contato", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({cpf: linha.children[0].textContent}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

function editarRegistro(linha){
    document.getElementById("cpf").value = linha.children[0].textContent;
    document.getElementById("nome").value = linha.children[1].textContent;
    document.getElementById("email").value = linha.children[2].textContent;
    document.getElementById("telefone").value = linha.children[3].textContent;
    document.getElementById("localidade").value = linha.children[4].textContent;
    
    editando = linha;
}


// Refatoração - Acessar o Back End
async function getContatos(){
    const response = await fetch("http://localhost:8000/contato", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-contato");
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (contato of data){
            adicionarLinhaTabela(contato.cpf, contato.nome, contato.email, contato.telefone, contato.localidade);    
        }
        console.log("Sucesso: ", response);
    } else {
        console.log("Erro: ", response);
    }
}