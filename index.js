const statusPageService = require('./services/status-page');
const storageServcie = require('./services/storage');
const modulesLoader = require('./services/module');
const { log } = require('./services/configuration');
const fs = require('fs/promises');
const configurationService = require('./services/configuration');
/**
 * @typedef {Object} Incident
 * @property {string} id - O ID único do incidente.
 * @property {string} name - O nome do incidente.
 * @property {string} status - O status atual do incidente (ex: "investigating", "resolved").
 * @property {string} impact - O nível de impacto do incidente.
 */

/**
 * Executa o loop principal de verificação de incidentes.
 *
 * A função opera em um loop infinito, monitorando continuamente a página de status.
 * Em caso de falha na requisição, ela usa uma estratégia de backoff exponencial
 * para evitar sobrecarregar a API externa.
 *
 * Na primeira execução, o sistema apenas salva o estado atual dos incidentes
 * sem enviar notificações. Isso evita alertas indesejados ao iniciar.
 */
async function main() {
    let attempts = 0;
    const modules = modulesLoader.loadModules();
    
    let isFirstRun = false;
    try {
        await fs.access('./database/database.json');
    } catch (error) {
        log('info', 'Database file not found. This is the first run, skipping notifications.');
        isFirstRun = true;
    }

    while (true) {
        try {
            const incidents = await statusPageService.getIncidents();
            const changeds = await statusPageService.detectChanges(incidents);

            const updates = {};
            
            changeds.forEach(changed => {
                const incident = incidents.filter(i => i.id == changed)[0];
                updates[changed] = incident;
            });

            if (Object.keys(updates).length > 0) {
                for (const [key, value] of Object.entries(updates)) {
                    await storageServcie.write(key, value);
                    if (!isFirstRun) {
                        for (const module of modules) {
                            await module.notifyUpdate(value);
                        }
                    } else {
                        log('info', `Incident ID ${key} stored, notifications skipped.`);
                    }
                }
            }
            
            isFirstRun = false;
            
            attempts = 0;
            await new Promise(resolve => setTimeout(resolve, configurationService.loadConfiguration().loopInterval));
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