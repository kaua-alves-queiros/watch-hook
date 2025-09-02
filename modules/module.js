const { log } = require('../services/configuration');

/**
 * Carrega dinamicamente módulos a partir de um array de strings.
 *
 * A função itera sobre a lista de nomes de módulos, tenta importá-los
 * usando `require()` e armazena os módulos carregados em um novo array.
 * Em caso de falha ao carregar um módulo, um erro é registrado,
 * mas o processo continua.
 *
 * @param {string[]} modulesToLoad Um array de strings com os nomes dos módulos a serem carregados.
 * @returns {Array} Um array contendo os módulos carregados com sucesso.
 */
function loadModules() {
    const modulesToLoad = [
    ]
    const loadedModules = [];
    log('info', {message: "Iniciando o carregamento dinâmico de módulos..."});

    for (const moduleName of modulesToLoad) {
        try {
            const module = require(moduleName);
            loadedModules.push(module);
            log('info', {message: `Módulo '${moduleName}' carregado com sucesso.`});
        } catch (error) {
            log('error', `Erro ao carregar o módulo '${moduleName}': ${error.message}`);
        }
    }

    return loadedModules;
}

module.exports = {
    loadModules,
};
