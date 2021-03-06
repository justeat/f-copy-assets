import glob from 'glob';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import config from './config';


/**
 * Validates that the filepath contains a package and returns an object holding the package name
 *
 * @param {string} filepath
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


/**
 * Retrieves the package.json from each package object
 *
 * @param {object} pkg
 */
const getPackageJson = pkg => new Promise((resolve, reject) => {
    const jsonPath = path.join(pkg.filepath, 'package.json');

    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
});


/**
 * Turns package.json file data into the assets object defined within
 *
 * @param {object} pkgJsonData
 */
const getAssetsManifest = pkgJsonData => new Promise((resolve, reject) => {
    try {
        const contents = JSON.parse(pkgJsonData);
        resolve(contents.assets);
    } catch (err) {
        reject(err);
    }
});


/**
 * Adds the assets manifest from package.json to the package object
 *
 * @param {object} pkg
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


/**
 * Makes directories for an asset if they don't already exist
 *
 * @param {object} asset
 */
const makeDirectories = asset => new Promise((resolve, reject) => {
    mkdirp(path.dirname(asset.dest), err => {
        if (err) reject(err);
        resolve(asset);
    });
});


/**
 * Copies a single asset to the dest
 *
 * @param {object} asset
 */
const copyFile = asset => new Promise((resolve, reject) => {
    const input = fs.createReadStream(asset.absolutePath);
    const output = fs.createWriteStream(asset.dest);
    let isFinished = false;

    const finish = err => {
        if (!isFinished) {
            isFinished = true;
            if (err) reject(err);
            resolve();
        }
    };

    if (config.verbose) {
        config.logger(`Copying ${asset.absolutePath} to ${asset.dest}`);
    }

    input.pipe(output);
    input.on('error', finish);
    output.on('error', finish);
    output.on('finish', finish);
});


/**
 * Copies package assets to the dest directory
 *
 * @param {object} pkg
 */
const copyPackages = pkg => new Promise((resolve, reject) => {
    if (!pkg.assets) {
        return resolve(`No assets found for package ${pkg.name}`);
    }

    if (!Array.isArray(pkg.assets)) {
        pkg.assets = [pkg.assets];
    }

    return pkg.assets.forEach(pkgAsset => {
        const assetsRoot = path.join(pkg.filepath, pkgAsset.root); // e.g. node_modules/@justeat/fozzie/dist
        const assetsGlob = path.join(assetsRoot, pkgAsset.glob); // e.g. node_modules/@justeat/fozzie/dist/img/**/*.svg

        const assetDetails = file => {
            const relativePath = path.relative(assetsRoot, file); // e.g. img/sprite.svg
            const dest = pkgAsset.dest || config.dest;

            return {
                absolutePath: file, // e.g. node_modules/@justeat/fozzie/dist/img/sprite.svg
                relativePath,
                dest: path.join(dest, relativePath) // e.g. Assets/img/sprite.svg
            };
        };

        glob(assetsGlob, { nodir: true }, (err, files) => {
            if (err) reject(err);

            const makePromise = asset => makeDirectories(asset)
                .then(copyFile); // Using this due to the absence of promise.map

            const promises = files
                .map(assetDetails)
                .map(makePromise);

            return Promise
                .all(promises)
                .then(resolve)
                .catch(reject);
        });
    });
});

export {
    getPackage,
    getPackageJson,
    getAssetsManifest,
    addManifestToPackage,
    makeDirectories,
    copyFile,
    copyPackages
};
