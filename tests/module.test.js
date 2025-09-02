const modulesLoader = require('../services/module');

describe('Modules Loader', () => {
    test('loadModules retorna array de módulos', () => {
        const modules = modulesLoader.loadModules();
        expect(Array.isArray(modules)).toBe(true);
    });

    test('módulo possui método notifyUpdate', () => {
        const modules = modulesLoader.loadModules();
        modules.forEach(module => {
            expect(typeof module.notifyUpdate).toBe('function');
        });
    });
});
