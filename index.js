const statusPageService = require('./services/status-page');
const storageServcie = require('./services/storage');
const modulesLoader = require('./services/module');
const { log } = require('./services/configuration');
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
    const modules = modulesLoader.loadModules();
    
    while (true) {
        try {
            const incidents = await statusPageService.getIncidents();

            const changeds = await statusPageService.detectChanges(incidents);

            const updates = {};
            
            changeds.forEach(changed => {
                const incident = incidents.filter(i => i.id == changed)[0]
                updates[changed] = incident;
            })

            if (Object.keys(updates).length > 0) {
                for (const [key, value] of Object.entries(updates)) {
                    await storageServcie.write(key, value);

                    // O loop for...of garante que a notificação de cada módulo seja aguardada
                    for (const module of modules) {
                        await module.notifyUpdate(value);
                    }
                }
            }
            
            attempts = 0;
            await new Promise(resolve => setTimeout(resolve, 30000));
        } catch (exception) {
            log('error', { exception });
            
            attempts++;
            const delay = Math.pow(2, attempts) * 1000;
            log('warn', { message: `Tentando novamente em ${delay / 1000} segundos...` });

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

main();
