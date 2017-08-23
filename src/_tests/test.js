import {
    copyAll,
    getPkg,
    getPackageJson,
    getAssetsManifest,
    copy
} from '../index';

describe('copyAll', () => {

    it('rejects if bad glob provided', () => {

        // Arrange
        const inputGlob = null;
        const inputDistDir = 'dist/';

        // Act
        const promise = copyAll(inputGlob, inputDistDir);

        // Assert
        expect(promise).rejects.toBeDefined();

    });

});

describe('getPkg', () => {

    it('can find module name', () => {

        // Arrange
        const input = 'node_modules/@justeat/fozzie/';
        const expected = {
            filepath: input,
            name: 'fozzie',
            assets: null
        };

        // Act
        const pkg = getPkg(input);

        // Assert
        expect(pkg).resolves.toEqual(expected);

    });

    it('rejects an org with a reason', () => {

        // Arrange
        const input = 'node_modules/@justeat/';

        // Act
        const pkg = getPkg(input);

        // Assert
        expect(pkg).rejects.toBeDefined();

    });

    it('rejects a malformed path with a reason', () => {

        // Arrange
        const input = 'node_modules@justeatfozzie';

        // Act
        const pkg = getPkg(input);

        // Assert
        expect(pkg).rejects.toBeDefined();

    });

});

describe('getPackageJson', () => {

    it('returns a package.json with the correct name', () => {

        // Arrange
        const input = { // is a mock package possible rather than a real one?
            filepath: 'node_modules/gulp/',
            name: 'gulp',
            assets: null
        };
        const expected = 'gulp';

        // Act
        const packageName = getPackageJson(input)
            .then(data => JSON.parse(data).name);

        // Assert
        expect(packageName).resolves.toEqual(expected);

    });

    it('rejects bad input', () => {

        // Arrange
        const input = {
            blah: 'blah'
        };

        // Act
        const packageName = getPackageJson(input);

        // Assert
        expect(packageName).rejects.toBeDefined();

    });

});

describe('getAssetsManifest', () => {

    it('parses JSON and retrieves the assets object', () => {

        // Arrange
        const input = `{
            name: 'test',
            assets: {
                data: 'data'
            }
        }`;
        const expected = {
            data: 'data'
        };

        // Act
        const assetsManifest = getAssetsManifest(input);

        // Assert
        expect(assetsManifest).resolves.toEqual(expected);

    });

    it('rejects bad input', () => {

        // Arrange
        const input = 'i aint json';

        // Act
        const assetsManifest = getAssetsManifest(input);

        // Assert
        expect(assetsManifest).rejects.toBeDefined();

    });

});

describe('copy', () => {

    it('rejects if package has no assets', () => {

        // Arrange
        const input = {
            filepath: 'something',
            name: 'test',
            assets: null
        };

        // Act
        const promise = copy(input);

        // Assert
        expect(promise).rejects.toBeDefined();

    });

});
