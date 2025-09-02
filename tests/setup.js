const fs = require('fs');
const path = require('path');

// Garante que o diretório database existe
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Garante que o arquivo database.json existe
const dbFile = path.join(dbDir, 'database.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '{}');
}

// Garante que o diretório modules existe
const modulesDir = path.join(__dirname, '../modules');
if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir);
}

// Cria um módulo de teste se não existir
const testModuleFile = path.join(modulesDir, 'testLogger.js');
if (!fs.existsSync(testModuleFile)) {
    fs.writeFileSync(testModuleFile, `
        async function notifyUpdate(incident) {
            console.log('[TEST] Notificação recebida:', incident);
        }
        module.exports = {
            name: 'Test Logger',
            notifyUpdate,
        };
    `);
}
