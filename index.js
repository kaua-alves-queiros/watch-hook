// Importa o serviço para buscar incidentes na página de status.
const statusPageService = require('./services/status-page');
// Importa o serviço para disparar hooks e notificar incidentes.
const externalService = require('./services/external');

/**
 * Função principal que executa o loop de verificação de incidentes.
 *
 * Esta função opera em um loop infinito (`while (true)`) para monitorar
 * continuamente a página de status. Ela implementa uma estratégia de
 * backoff exponencial em caso de falhas consecutivas, garantindo que
 * o sistema não sobrecarregue a API externa.
 *
 * O sistema espera 1 segundo entre as execuções bem-sucedidas.
 * Em caso de erro, o tempo de espera aumenta exponencialmente
 * (2, 4, 8, 16 segundos, etc.) para dar tempo aos serviços se recuperarem.
 */
async function main() {
    let attempts = 0;
    while (true) {
        try {
            // Busca a lista de incidentes da página de status.
            const incidents = await statusPageService.getIncidents();
            // Dispara os hooks para notificar os incidentes encontrados.
            await externalService.hookIncidents(incidents);
            
            // Se a operação for bem-sucedida, reinicia a contagem de tentativas.
            attempts = 0;
            // Espera 1 segundo antes da próxima execução.
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (exception) {
            // Em caso de erro, registra a exceção para depuração.
            console.error({ exception });
            
            // Incrementa o contador de tentativas e calcula o tempo de espera.
            attempts++;
            const delay = Math.pow(2, attempts) * 1000;
            console.log(`Tentando novamente em ${delay / 1000} segundos...`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

main();