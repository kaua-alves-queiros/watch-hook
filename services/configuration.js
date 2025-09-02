let loaded = false;
let configuration = null;

const logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

/**
 * Carrega e retorna as configurações do ambiente para integração com StatusPage.
 * Utiliza variáveis de ambiente definidas no arquivo .env.
 * As configurações são carregadas apenas uma vez e reutilizadas em chamadas subsequentes.
 * 
 * @returns {Object} Objeto de configuração contendo baseUrl, pageId e apiKey do StatusPage.
 */
function loadConfiguration() {
    if (loaded && configuration) {
        return configuration;
    }

    require('dotenv').config();

    configuration = {
        statusPage: {
            baseUrl: process.env.STATUS_PAGE_BASE_URL,
            pageId: process.env.STATUS_PAGE_PAGE_ID,
            apiKey: process.env.STATUS_PAGE_API_KEY,
            logLevel: process.env.LOG_LEVEL || 'info',
        },
    };

    loaded = true;
    
    return configuration;
}

/**
 * Loga mensagens respeitando o nível de log definido em LOG_LEVEL.
 * @param {'error'|'warn'|'info'|'verbose'|'debug'|'silly'} level
 * @param {...any} args
 */
function log(level, message) {
    const config = configuration || loadConfiguration();
    const currentLevel = config.statusPage.logLevel || 'info';
    if (logLevels.indexOf(level) <= logLevels.indexOf(currentLevel)) {
        const logEntry = {
            logLevel: level,
            dateTime: new Date().toISOString(),
            message: typeof message === 'string' ? message : JSON.stringify(message)
        };
        switch (level) {
            case 'error':
                console.error(logEntry);
                break;
            case 'warn':
                console.warn(logEntry);
                break;
            default:
                console.log(logEntry);
        }
    }
}

module.exports = {
    loadConfiguration,
    log
};