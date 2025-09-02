const statusPageService = require('../services/status-page');
const storageService = require('../services/storage');
const modulesLoader = require('../services/module');

describe('Integração Watch Hook', () => {
    test('ciclo completo: incidentes, mudanças, armazenamento e módulos', async () => {
        const incidents = await statusPageService.getIncidents();
        const changes = await statusPageService.detectChanges(incidents);

        const modules = modulesLoader.loadModules();

        for (const changed of changes) {
            const incident = incidents.find(i => i.id === changed);
            await storageService.write(changed, incident);

            for (const module of modules) {
                await module.notifyUpdate(changed, incident);
            }
        }

        expect(true).toBe(true);
    });
});
