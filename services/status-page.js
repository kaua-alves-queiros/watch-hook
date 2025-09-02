const configurationService = require('./configuration');
const storageServcie = require('./storage');
const { log } = require('./configuration');

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
        const configuration = configurationService.loadConfiguration();

        const response = await fetch(configuration.statusPage.baseUrl + configuration.statusPage.pageId + '/incidents', {
            headers: {
                'Authorization': `OAuth ${configuration.statusPage.apiKey}`
            }
        });

        if(response.ok) {
            log('info', {message: 'Response Status:' + response.body});
            return await response.json()
        }
        else
        {
            log('warn', {response});
            return []
        }
    } catch (exception) {
        log('error', {exception})
        return []
    }
}

/**
 * Compara dois objetos e verifica se são profundamente iguais.
 *
 * @param {*} obj1 O primeiro valor para comparar.
 * @param {*} obj2 O segundo valor para comparar.
 * @returns {boolean} Retorna `true` se os objetos forem profundamente iguais, caso contrário, `false`.
 */
function areObjectsEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || !areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Compara uma nova lista de incidentes com a lista armazenada para detectar mudanças.
 *
 * A função itera sobre cada novo incidente, verifica se ele já foi armazenado
 * e, se sim, compara-o com a versão armazenada. Se alguma diferença for
 * encontrada, ela é registrada e retornada.
 *
 * @param {Array} newIncidents O array de novos incidentes obtidos da API.
 * @returns {Promise<Array>} Um array de objetos que descrevem os incidentes alterados e suas diferenças.
 */
async function detectChanges(newIncidents) {
    const differences = [];

    await Promise.all(newIncidents.map(async incident => {
        const storedIncident = await storageServcie.read(incident.id);

        if(storedIncident == null) {
            log('info', `Incident new: ${incident.id}`);
            differences.push(incident.id);
        } else if(areObjectsEqual(storedIncident, incident) === false) {
            log('info', `Incident changed: ${incident.id}`);
            differences.push(incident.id);
        } else {
            log('info', `Incident unchanged: ${incident.id}`);
            // Não adiciona ao differences
        }
    }));

    return differences;
}

module.exports = {
    getIncidents,
    detectChanges,
}