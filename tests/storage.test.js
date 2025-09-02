const storageService = require('../services/storage');

describe('Storage Service', () => {
    const key = 'incident_test';
    const value = { id: key, name: 'Teste' };

    test('write armazena dados', async () => {
        await storageService.write(key, value);
        const stored = await storageService.read(key);
        expect(stored).toEqual(value);
    });

    test('read retorna undefined para chave inexistente', async () => {
        const result = await storageService.read('chave_inexistente');
        expect(result).toBeUndefined();
    });
});
