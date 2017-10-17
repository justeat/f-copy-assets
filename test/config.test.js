const config = require('../src/config');


describe('config', () => {

    it('has default glob', () => {
        expect(config.pkgSrcGlob).toEqual('node_modules/*/');
    });

    it('has default dest', () => {
        expect(config.dest).toEqual('dist');
    });

    it('has default verbose', () => {
        expect(config.verbose).toEqual(false);
    });

    it('has default logger', () => {
        expect(config.logger).toEqual(console.log);
    });

    it('can be updated', () => {
        // Arrange
        const newOpts = {
            verbose: true,
            dest: 'Assets'
        };

        // Act
        config.update(newOpts);

        // Assert
        expect(config.dest).toBe('Assets');
        expect(config.verbose).toBe(true);
        expect(config.logger).toBe(console.log); // not updated or deleted
    });

});
