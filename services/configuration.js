// O estado de 'carregado' deve ser mantido dentro do escopo do módulo
// para evitar poluir o escopo global.
let loaded = false;
let configuration = null;

function loadConfiguration() {
    if (loaded && configuration) {
        return configuration;
    }

    require('dotenv').config();

    let hooks = [];
    try {
        // Tenta fazer o parse da variável de ambiente HOOKS como JSON.
        // Usa '[]' como fallback seguro se a variável não estiver definida.
        const hooksString = process.env.HOOKS || '[]';
        hooks = JSON.parse(hooksString);
    } catch (error) {
        // Loga um erro se o formato JSON for inválido.
        console.error({'Erro ao fazer o parse da variável de ambiente HOOKS. Certifique-se de que é um JSON válido.', error});
    }

    configuration = {
        statusPage: {
            baseUrl: process.env.STATUS_PAGE_BASE_URL,
            pageId: process.env.STATUS_PAGE_PAGE_ID,
            apiKey: process.env.STATUS_PAGE_API_KEY,
        },
        hooks: hooks
    };

    loaded = true;
    
    return configuration;
}

module.exports = {
    loadConfiguration
};