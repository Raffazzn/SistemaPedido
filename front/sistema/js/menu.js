async function showSection(sectionId, callback) {
    // Seleciona todas as seções dentro da div com a classe 'container'
    const sections = document.querySelectorAll('main section');
    
    // Oculta todas as seções
    sections.forEach((section) => {
        section.style.display = 'none';
    });
    
    // Exibe a seção específica com o ID passado como parâmetro
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Executa a função de callback, se fornecida
    if (typeof callback === 'function') {
        await callback();
    }
}

function startApp(){
    showSection("frm-home", getHome());
}

startApp();