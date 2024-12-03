const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let users = [];

const filePath = path.resolve("db/", "users.json");

// Chave Secreta para assinar o JWT
const secretKey = "@ads_senai_sesi_2024#";

// Função que salva a lista de usuários na pasta db
const saveUsersToFile = () => {
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar usuário no arquivo:", err);
        } else {
            console.log("Usuários Salvos com sucesso")
        }
    })
}
// Função que carrega os usuários salvos na pasta
const loadUsersFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de usuários", err);
            } else if (data.trim() === ""){
                users = [];
                console.log("Arquivo de usuários está vazio");
            } else {
                try {
                    users = JSON.parse(data);
                    console.log("Usuários carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}



// Função que procura usuário pelo e-mail
const findUserByEmail = (value) => {
    return users.find(user => user.userEmail === value) || null;
}

// Função que cadastra um novo usuário
const addUser = async (value) => {
    const hashedPassword = await bcrypt.hash(value.password, 10);
    
    const user = {
        userName : value.userName,
        userEmail : value.userEmail,
        password : hashedPassword,
    }

    users.push(user);

    saveUsersToFile();
    console.log("Usuário Cadastrado: ", user);
    return user;
}

const login = async (value) => {
    const user = findUserByEmail(value.userEmail);
    console.log("usuário: ", user);
    if (user){
        
        const isPasswordValid = await bcrypt.compare(
            value.password,
            user.password
        );

        if (isPasswordValid){
            const token = jwt.sign(
                {userEmail: user.userEmail, userName: user.userName},
                secretKey,
                { expiresIn: "1h" }
            );

            return token;
        } else {
            return null;
        }
    } else {
        return null;
    }
}


loadUsersFromFile();

exports.findUserByEmail = findUserByEmail;
exports.addUser = addUser;
exports.login = login;