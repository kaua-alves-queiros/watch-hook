const configurationService = require('./configuration');
const storageServcie = require('./storage');
const { log } = require('./configuration');

/**
 * @typedef {Object} Incident
 * @property {string} id - O ID único do incidente.
 * @property {string} name - O nome do incidente.
 * @property {string} status - O status atual do incidente (ex: "investigating", "resolved").
 * @property {string} impact - O nível de impacto do incidente.
 * @property {string} body - O corpo da mensagem do incidente.
 */

/**
 * Obtém a lista de incidentes da API de status page.
 * @returns {Promise<Incident[]>} Um array de objetos de incidentes, ou um array vazio em caso de falha.
 */
async function getIncidents() {
    try {
        const configuration = configurationService.loadConfiguration();
        const url = `${configuration.statusPage.baseUrl}${configuration.statusPage.pageId}/incidents`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `OAuth ${configuration.statusPage.apiKey}`
            }
        });

        if (response.ok) {
            log('info', { message: 'Response Status: ' + response.body });
            return await response.json();
        } else {
            log('warn', { response });
            return [];
        }
    } catch (exception) {
        log('error', { exception });
        return [];
    }
}

/**
 * Filtra um objeto de incidente, removendo campos irrelevantes para a detecção de mudanças.
 * @param {Incident} incident - O objeto de incidente a ser filtrado.
 * @returns {Object} Um novo objeto contendo apenas os campos relevantes.
 */
function sanitizeIncident(incident) {
    if (!incident) {
        return null;
    }
    return {
        id: incident.id,
        name: incident.name,
        status: incident.status,
        impact: incident.impact,
        updated_at: incident.updated_at,
        // Adicione outros campos relevantes aqui, como `body` ou `components`.
    };
}

/**
 * Compara dois objetos e verifica se são profundamente iguais.
 * @param {*} obj1 - O primeiro valor para comparar.
 * @param {*} obj2 - O segundo valor para comparar.
 * @returns {boolean} Retorna `true` se os objetos forem profundamente iguais, caso contrário, `false`.
 */
function areObjectsEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!Object.prototype.hasOwnProperty.call(obj2, key) || !areObjectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Compara a nova lista de incidentes com a lista armazenada para detectar mudanças.
 * @param {Incident[]} newIncidents - O array de novos incidentes obtidos da API.
 * @returns {Promise<string[]>} Um array contendo os IDs dos incidentes alterados.
 */
async function detectChanges(newIncidents) {
    const differences = [];

    await Promise.all(newIncidents.map(async incident => {
        const storedIncident = await storageServcie.read(incident.id);

        const sanitizedNewIncident = sanitizeIncident(incident);
        const sanitizedStoredIncident = sanitizeIncident(storedIncident);

        if (sanitizedStoredIncident === null) {
            log('info', `New incident detected: ${incident.id}`);
            differences.push(incident.id);
        } else if (!areObjectsEqual(sanitizedStoredIncident, sanitizedNewIncident)) {
            log('info', `Incident changed: ${incident.id}`);
            differences.push(incident.id);
        } else {
            log('info', `Incident unchanged: ${incident.id}`);
        }
    }));

    return differences;
}

module.exports = {
    getIncidents,
    detectChanges,
};