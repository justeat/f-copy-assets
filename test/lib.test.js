import {
    getPackage,
    getPackageJson,
    getAssetsManifest,
    makeDirectories,
    copyFile,
    copyOnePackage
} from '../src/lib';


describe('getPackage', () => {

    it('can find module name', () => {
        // Arrange
        const input = 'node_modules/@justeat/fozzie/';
        const expected = {
            filepath: input,
            name: 'fozzie',
            assets: null
        };

        // Act
        const pkg = getPackage(input);

        // Assert
        expect(pkg).resolves.toEqual(expected);
    });

    it('rejects an org with a reason', () => {
        // Arrange
        const input = 'node_modules/@justeat/';

        // Act
        const pkg = getPackage(input);

        // Assert
        expect(pkg).rejects.toBeDefined();
    });

    it('rejects a malformed path with a reason', () => {
        // Arrange
        const input = 'node_modules@justeatfozzie';

        // Act
        const pkg = getPackage(input);

        // Assert
        expect(pkg).rejects.toBeDefined();
    });

});

describe('getPackageJson', () => {

    it('returns a package.json with the correct name', () => {
        // Arrange
        const input = { filepath: '' };
        const expected = '@justeat/f-copy-assets';

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
            "name": "test",
            "assets": {
                "data": "data"
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

describe('makeDirectories', () => {

    it('rejects bad input', () => {
        // Arrange
        const input = null;

        // Act
        const promise = makeDirectories(input);

        // Assert
        expect(promise).rejects.toBeDefined();
    });

});

describe('copyFile', () => {

    it('rejects bad input', () => {
        // Arrange
        const input = null;

        // Act
        const promise = copyFile(input);

        // Assert
        expect(promise).rejects.toBeDefined();
    });

});

describe('copyOnePackage', () => {

    it('resolves if package has no assets', () => {
        // Arrange
        const input = {
            filepath: 'something',
            name: 'test',
            assets: null
        };

        // Act
        const promise = copyOnePackage(input);

        // Assert
        expect(promise).resolves.toBeDefined();
    });

});
