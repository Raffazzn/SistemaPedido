const usuarioLogado = {};

// Função que faz a leitura do Token
function getToken(){
    const token = localStorage.getItem("authToken");
    if (token){
        console.log(token);
        return token;
        
    } else {
        return null;
    }
}

// Função que remove o token do localStorage
function removeToken(){
    localStorage.removeItem("authToken");
}

// Função para decodificar o token e validar se o token expirou
function isTokenValid(){
    const token = getToken();

    if (!token){
        console.log("Nenhum token encontrado");
        return false;
    }

    const decodedToken = jwt_decode(token);
    const currentTime = Math.floor(Date.now()/1000);

    if (decodedToken.exp < currentTime){
        console.log("Token Expirou");
        return false;
    }
    console.log("Token é válido!");
    return true;
}

// Função que inicializa o sistema
if (isTokenValid()){
    const token = getToken();
    const decoded = jwt_decode(token);

    usuarioLogado.userName = decoded.userName;
    usuarioLogado.userEmail = decoded.userEmail;

    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");

    userName.innerHTML = decoded.userName;
    userEmail.innerHTML = decoded.userEmail;
} else { 
    const userName = document.getElementById("user-name");
    const userLogout = document.getElementById("user-logout");
    userLogout.style = "display: none;";
    userName.style = "font-size: 2em;";
    userName.innerHTML = "Usuário não autenticado... Saindo em... 3..2..1";

    setTimeout(function(){
        window.location.href = "/front";
    }, 3000);
}

document.getElementById("user-logout").
    addEventListener("click", function(){
        removeToken();
        window.location.href = "/front";
})