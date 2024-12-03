const fs = require("fs");
const path = require("path");

let produtoClasses = [];

const filePath = path.resolve("db/", "produtoClasses.json");

// Função que salva a lista de produtoClasses na pasta db
const saveProdutoClassesToFile = () => {
    fs.writeFile(filePath, JSON.stringify(produtoClasses, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar produto Classes no arquivo:", err);
        } else {
            console.log("produto Classes Salvos com sucesso");
        }
    })
}
// Função que carrega os produtoClasses salvos na pasta
const loadProdutoClassesFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de produtoClasses", err);
            } else if (data.trim() === ""){
                produtoClasses = [];
                console.log("Arquivo de produtoClasses está vazio");
            } else {
                try {
                    produtoClasses = JSON.parse(data);
                    console.log("produtoClasses carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}

const addProdutoClasse = (value) => {
    const produtoClasse = {
        descricao : value.descricao
    }

    produtoClasses.push(produtoClasse);
    saveProdutoClassesToFile();
    console.log("produtoClasse Cadastrado: ", produtoClasse);
    return produtoClasse;
}

const findProdutoClasseByDescricao = (descricao) => {
    return produtoClasses.find(produtoClasse => produtoClasse.descricao === descricao) || null;
}

const updateProdutoClasse = (value) => {
    const produtoClasse = findProdutoClasseByDescricao(value.descricaoAnterior);
    if (produtoClasse){
        produtoClasse.descricao = value.descricao;
    
        saveProdutoClassesToFile();
        console.log("produto Classe atualizado: ", produtoClasse);
        
        return produtoClasse;
    } else {
        return null;
    }
}

const deleteProdutoClasse = (descricao) => {
    const index = produtoClasses.findIndex(produtoClasse => produtoClasse.descricao === descricao);

    if (index !== -1){
        produtoClasses.splice(index, 1); // remove o produto Classe da lista
        saveProdutoClassesToFile()
        console.log("produto Classe Deletado: ", descricao);
        return true;
    } else {
        return false;
    }
}

// Função que devolve a lista de produtoClasses
const listProdutoClasses = () => {
    return produtoClasses;
}

// Carrega os produtoClasses salvos no arquivo ao iniciar
loadProdutoClassesFromFile();

// Exportamos as funções para poder utilizar nos outros módulos
exports.findProdutoClasseByDescricao = findProdutoClasseByDescricao;
exports.addProdutoClasse = addProdutoClasse;
exports.updateProdutoClasse = updateProdutoClasse;
exports.deleteProdutoClasse = deleteProdutoClasse;
exports.listProdutoClasses = listProdutoClasses;