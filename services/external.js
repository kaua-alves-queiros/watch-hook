// Importa os módulos necessários.
// configurationService: Módulo para carregar a configuração da aplicação.
// storage: Módulo de armazenamento do SDK para persistência de dados.
const configurationService = require('./configuration');
const storage = require('../sdk/storage');

// Cria o objeto SDK com os serviços necessários, como o de armazenamento.
// Isso centraliza as dependências e facilita a injeção em outras funções.
const sdk = {
    storage,
}

/**
 * Dispara hooks para um incidente, esperando que todos terminem.
 * Falhas em hooks individuais são logadas, mas não impedem o processo de continuar.
 * O código mapeia cada hook para uma Promise, garantindo que o 'Promise.all'
 * espere a conclusão de todas as operações assíncronas.
 *
 * @param {object} incident O objeto do incidente a ser processado.
 * @param {object} sdk O objeto do SDK para a comunicação com serviços externos.
 */
async function hookIncidents(incident) {
    // Carrega a configuração da aplicação, incluindo a lista de hooks.
    const hooks = configurationService.loadConfiguration().hooks;

    // Mapeia cada hook para uma Promise assíncrona.
    // O uso de 'async' no callback do map garante que cada iteração retorne uma Promise.
    const hookPromises = hooks.map(async (hook) => {
        try {
            // Espera a execução de cada hook individualmente.
            await hook(incident, sdk);
        } catch (error) {
            // Se um hook falhar, a exceção é capturada aqui.
            // A falha é logada, mas o processo não para, permitindo que os outros hooks sejam executados.
            console.error({ error });
        }
    });

    // Espera que todas as Promises no array hookPromises sejam resolvidas (sejam bem-sucedidas ou falhem).
    await Promise.all(hookPromises);
    console.log('Todos os hooks foram processados.');
}

// Exporta a função hookIncidents para que possa ser usada em outros módulos.
module.exports = {
    hookIncidents,
}