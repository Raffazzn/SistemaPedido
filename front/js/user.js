// Função que salva o token no navegador
function storeToken(token){
    localStorage.setItem("authToken", token);
    console.log("Token armazenado com sucesso");
}


document.getElementById("frm-cadastrar")
    .addEventListener("submit",
    async function(event) {      
        event.preventDefault(); //impede o envio padrão do formulário

        const userName = document.getElementById("userName").value;
        const userEmail = document.getElementById("userEmail").value;
        const password = document.getElementById("cad-password").value;
        const msgCadastro = document.getElementById("msg-cadastro");
        const msgLogin = document.getElementById("msg-login");

        const response = await fetch("http://127.0.0.1:8000/auth/new", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({userName, userEmail, password}),
        })

        if (response.status == 200){           
            const message = await response.text();           
            msgCadastro.classList.remove("msg-error");
            msgCadastro.classList.add("msg-sucesso");            
            msgCadastro.innerHTML = message;            
            console.log(message);
        } else {
            const errorMessage = await response.text();            
            msgCadastro.classList.add("msg-error");
            msgCadastro.classList.remove("msg-sucesso")
            msgCadastro.innerHTML = errorMessage;            
            console.log(errorMessage);
        }
})

// Login
document.getElementById("frm-login")
    .addEventListener("submit",
    async function(event) {      
        event.preventDefault(); //impede o envio padrão do formulário

        const userEmail = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const msgLogin = document.getElementById("msg-login");

        const response = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({userEmail, password}),
        })

        if (response.status == 200){           
            const token = await response.text();           
            msgLogin.classList.remove("msg-error");
            msgLogin.classList.add("msg-sucesso");            
            msgLogin.innerHTML = "Usuário Autenticado com sucesso!";                       

            storeToken(token);

            setTimeout(function(){
                window.location.href = "/front/sistema";
            }, 3000); // vai aguardar 3 segundos e vai entrar no sistema
        } else {
            const errorMessage = await response.text();            
            msgLogin.classList.add("msg-error");
            msgLogin.classList.remove("msg-sucesso")
            msgLogin.innerHTML = errorMessage;            
            console.log(errorMessage);
        }
    })