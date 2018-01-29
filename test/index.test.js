import copyAssets from '../src/index';


describe('copyAssets', () => {

    it('rejects if bad glob provided', () => {
        // Arrange
        const inputGlob = null;
        const inputDistDir = 'dist/';

        // Act
        const promise = copyAssets(inputGlob, inputDistDir);

        // Assert
        expect(promise).rejects.toBeDefined();
    });

});
