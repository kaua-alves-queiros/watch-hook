// Importa o serviço de configuração para acessar as variáveis de ambiente necessárias.
const configurationService = require('./configuration');

/**
 * Obtém a lista de incidentes de uma página de status usando a API.
 *
 * A função constrói a URL da API com base na configuração e usa a chave
 * de API para autenticação. Em caso de sucesso, retorna um array com
 * os incidentes; caso contrário, retorna um array vazio e registra o erro.
 *
 * @returns {Promise<Array>} Um array de objetos de incidentes, ou um array vazio em caso de falha.
 */
async function getIncidents() {
    try {
        // Carrega as configurações da API de status.
        const configuration = configurationService.loadConfiguration();

        // Faz a requisição à API usando a URL base, o ID da página e o endpoint de incidentes.
        const response = await fetch(configuration.statusPage.baseUrl + configuration.statusPage.pageId + '/incidents', {
            headers: {
                'Authorization': `OAuth ${configuration.statusPage.apiKey}`
            }
        });

        // Verifica se a resposta HTTP foi bem-sucedida (status 200-299).
        if(response.ok) {
            console.log('Response Status:', response.body);
            // Retorna os dados do JSON da resposta.
            return await response.json()
        }
        else
        {
            // Se a resposta não for OK, registra a resposta completa para fins de depuração.
            console.log(response);
            // Retorna um array vazio para que o processo não pare.
            return []
        }
    } catch (exception) {
        // Captura qualquer erro que ocorra durante a requisição ou processamento.
        console.log(exception)
        // Retorna um array vazio para garantir um valor de retorno seguro.
        return []
    }
}

// Exporta a função para que ela possa ser usada por outros módulos.
module.exports = {
    getIncidents
}
