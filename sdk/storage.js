const fs = require('fs').promises;
const path = require('path');

// Define o caminho para o arquivo database.json
const dbPath = path.join(__dirname, 'database.json');

/**
 * Lê o arquivo database.json e retorna o objeto inteiro.
 * Se o arquivo não existir, retorna um objeto vazio.
 * @returns {Promise<object>} O objeto de dados do banco de dados.
 */
async function readDbFile() {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, retorna um objeto vazio.
        if (error.code === 'ENOENT') {
            return {};
        }
        // Para qualquer outro erro, propaga a exceção.
        throw error;
    }
}

/**
 * Escreve um novo dado no arquivo database.json.
 * @param {string} name O nome (chave) do dado a ser salvo.
 * @param {*} data O valor a ser associado ao nome.
 */
async function write(name, data) {
    try {
        const dbData = await readDbFile();
        dbData[name] = data;
        const jsonContent = JSON.stringify(dbData, null, 2);
        await fs.writeFile(dbPath, jsonContent, 'utf8');
        console.log(`Dados para "${name}" salvos com sucesso.`);
    } catch (error) {
        console.error('Erro ao escrever no arquivo database.json:', error);
    }
}

/**
 * Lê um dado do arquivo database.json pelo nome.
 * @param {string} name O nome (chave) do dado a ser lido.
 * @returns {Promise<*|null>} O dado associado ao nome ou null se não for encontrado.
 */
async function read(name) {
    try {
        const dbData = await readDbFile();
        if (dbData.hasOwnProperty(name)) {
            console.log(`Dados para "${name}" lidos com sucesso.`);
            return dbData[name];
        } else {
            console.log(`Nenhum dado encontrado para "${name}".`);
            return null;
        }
    } catch (error) {
        console.error('Erro ao ler do arquivo database.json:', error);
        return null;
    }
}

module.exports = {
    write,
    read,
};