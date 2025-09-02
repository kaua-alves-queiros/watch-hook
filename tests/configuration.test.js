const { log } = require('../services/configuration');

describe('Configuration Service', () => {
    test('log aceita diferentes níveis', () => {
        expect(() => log('info', { msg: 'teste info' })).not.toThrow();
        expect(() => log('error', { msg: 'teste error' })).not.toThrow();
        expect(() => log('debug', { msg: 'teste debug' })).not.toThrow();
    });
});
