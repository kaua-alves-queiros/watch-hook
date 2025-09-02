const fs = require('fs');
const path = require('path');
const { log } = require('./configuration');

function loadModules() {
    const modulesDir = path.join(__dirname, '../modules');
    const loadedModules = [];

    log('info', {message: "Starting dynamic module loading..."});

    fs.readdirSync(modulesDir).forEach(file => {
        if (
            file.endsWith('.js')
        ) {
            const modulePath = path.join(modulesDir, file);
            try {
                const module = require(modulePath);
                loadedModules.push(module);
                log('info', {message: `Module '${file}' loaded successfully.`});
            } catch (error) {
                log('error', `Error loading module '${file}': ${error.message}`);
            }
        }
    });

    return loadedModules;
}

module.exports = {
    loadModules,
};
