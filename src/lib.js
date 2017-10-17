const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const config = require('./config');

/*
 * Validates that the filepath contains a package and returns an object holding the package name
 */
const getPackage = filepath => new Promise((resolve, reject) => {
    const split = filepath.split('/'); // e.g. [...'@justeat', '', 'fozzie', '']
    const name = split[split.length - 2];
    if (!name || name.charAt(0) === '@') {
        reject(new Error(`Error parsing package at ${filepath} with package name ${name}`));
    }
    resolve({
        filepath,
        name,
        assets: null
    });
});

/*
 * Retrieves the package.json from each package object
 */
const getPackageJson = pkg => new Promise((resolve, reject) => {
    const jsonPath = path.join(pkg.filepath, 'package.json');
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
});

/*
 * Turns package.json file data into the assets object defined within
 */
const getAssetsManifest = pkgJsonData => new Promise((resolve, reject) => {
    try {
        const contents = JSON.parse(pkgJsonData);
        resolve(contents.assets);
    } catch (err) {
        reject(err);
    }
});

/*
 * Adds the assets manifest from package.json to the package object
 */
const addManifestToPackage = pkg => new Promise(resolve => {
    if (pkg.assets) {
        resolve(pkg);
    }
    getPackageJson(pkg)
        .then(getAssetsManifest)
        .then(assets => {
            pkg.assets = assets;
            resolve(pkg);
        });
});

/*
 * Makes directories for an asset if they don't already exist
 */
const makeDirectories = asset => new Promise((resolve, reject) => {
    mkdirp(path.dirname(asset.dest), err => {
        if (err) reject(err);
        resolve(asset);
    });
});

/*
 * Copies a single asset to the dest
 */
const copyFile = asset => new Promise((resolve, reject) => {

    const input = fs.createReadStream(asset.absolutePath);
    const output = fs.createWriteStream(asset.dest);

    const finish = err => {
        if (err) reject(err);
        resolve();
    };

    if (config.verbose) {
        config.logger(`Copying ${asset.absolutePath} to ${asset.dest}`);
    }

    input.pipe(output);
    input.on('error', finish);
    output.on('error', finish);
    output.on('finish', finish);

});


/*
 * Copies a single package's assets to the dest
 */
const copyOnePackage = pkg => new Promise((resolve, reject) => {

    if (!pkg.assets) resolve(`No assets found for package ${pkg.name}`);

    const assetsRoot = path.join(pkg.filepath, pkg.assets.root); // e.g. node_modules/@justeat/fozzie/dist
    const assetsGlob = path.join(assetsRoot, pkg.assets.glob); // e.g. node_modules/@justeat/fozzie/dist/img/**/*.svg

    const assetDetails = file => {
        const relativePath = path.relative(assetsRoot, file); // e.g. img/sprite.svg

        return {
            absolutePath: file, // e.g. node_modules/@justeat/fozzie/dist/img/sprite.svg
            relativePath,
            dest: path.join(config.dest, relativePath) // e.g. Assets/img/sprite.svg
        };
    };

    glob(assetsGlob, { nodir: true }, (err, files) => {
        if (err) reject(err);

        const makePromise = asset => makeDirectories(asset).then(copyFile); // Using this due to the absence of promise.map

        const promises = files
            .map(assetDetails)
            .map(makePromise);

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });

});

module.exports = {
    getPackage,
    getPackageJson,
    getAssetsManifest,
    addManifestToPackage,
    makeDirectories,
    copyFile,
    copyOnePackage
};
