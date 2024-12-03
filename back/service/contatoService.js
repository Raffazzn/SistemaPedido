const fs = require("fs");
const path = require("path");

let contatos = [];

const filePath = path.resolve("db/", "contatos.json");

// Função que salva a lista de contatos na pasta db
const saveContatosToFile = () => {
    fs.writeFile(filePath, JSON.stringify(contatos, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar contatos no arquivo:", err);
        } else {
            console.log("Contatos Salvos com sucesso")
        }
    })
}
// Função que carrega os contatos salvos na pasta
const loadContatosFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de contatos", err);
            } else if (data.trim() === ""){
                contatos = [];
                console.log("Arquivo de contatos está vazio");
            } else {
                try {
                    contatos = JSON.parse(data);
                    console.log("Contatos carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}

const addContato = (value) => {
    const contato = {
        cpf: value.cpf,
        nome : value.nome,
        email : value.email,
        telefone : value.telefone,
        localidade : value.localidade
    }

    contatos.push(contato);
    saveContatosToFile();
    console.log("Contato Cadastrado: ", contato);
    return contato;
}

const findContatoByEmail = (email) => {
    return contatos.find(contato => contato.email === email) || null;
}

const findContatoByCPF = (cpf) => {
    return contatos.find(contato => contato.cpf === cpf) || null;
}

const updateContato = (value) => {
    const contato = findContatoByCPF(value.cpf);
    if (contato){
        contato.cpf = value.cpf;
        contato.nome = value.nome;
        contato.telefone = value.telefone;
        contato.email = value.email;
        contato.localidade = value.localidade;
    
        saveContatosToFile();
        console.log("Contato atualizado: ", contato);
        
        return contato;
    } else {
        return null;
    }
}

const deleteContato = (cpf) => {
    const index = contatos.findIndex(contato => contato.cpf === cpf);

    if (index !== -1){
        contatos.splice(index, 1); // remove o contato da lista
        saveContatosToFile()
        console.log("Contato Deletado: ", email);
        return true;
    } else {
        return false;
    }
}

// Função que devolve a lista de contatos
const listContatos = () => {
    return contatos;
}

// Carrega os contatos salvos no arquivo ao iniciar
loadContatosFromFile();

// Exportamos as funções para poder utilizar nos outros módulos
exports.findContatoByEmail = findContatoByEmail;
exports.findContatoByCPF = findContatoByCPF;
exports.addContato = addContato;
exports.updateContato = updateContato;
exports.deleteContato = deleteContato;
exports.listContatos = listContatos;