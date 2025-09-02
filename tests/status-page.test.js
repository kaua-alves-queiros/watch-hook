const statusPageService = require('../services/status-page');

describe('StatusPage Service', () => {
    test('getIncidents retorna array de incidentes', async () => {
        const incidents = await statusPageService.getIncidents();
        expect(Array.isArray(incidents)).toBe(true);
    });

    test('detectChanges identifica mudanças', async () => {
        const incidents = [{ id: '1', name: 'Teste' }];
        const changes = await statusPageService.detectChanges(incidents);
        expect(Array.isArray(changes)).toBe(true);
    });
});
