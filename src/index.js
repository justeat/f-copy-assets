const glob = require('glob');
const fs = require('graceful-fs');
const path = require('path');

let dist = null;

/*
 * Validates that the filepath contains a package and returns an object holding the package name
 */
const getPkg = filepath => new Promise((resolve, reject) => {
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
const addManifestToPkg = pkg => new Promise(resolve => {
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
 * Copies a single package's assets to the distDir (the package must have )
 */
const copy = pkg => new Promise((resolve, reject) => {

    if (!pkg.assets) reject(new Error(`No assets found for package ${pkg}`));

    const assetsRoot = path.join(pkg.filepath, pkg.assets.root); // e.g. node_modules/@justeat/fozzie/dist
    const assetsGlob = path.join(assetsRoot, pkg.assets.glob); // e.g. node_modules/@justeat/fozzie/dist/img/**/*.svg

    const copyFile = file => new Promise((res, rej) => {

        const relativeAssetPath = path.relative(assetsRoot, file); // e.g. img/sprite.svg
        const input = fs.createReadStream(file); // e.g. node_modules/@justeat/fozzie/dist/img/sprite.svg
        const output = fs.createWriteStream(path.join(dist, relativeAssetPath)); // e.g. Assets/img/sprite.svg

        let isFinished = false;
        const finish = err => {
            if (!isFinished) {
                isFinished = true;
                if (err) rej(err);
                res();
            }
        };

        input.pipe(output);
        input.on('error', finish);
        output.on('error', finish);
        output.on('finish', finish);

    });

    glob(assetsGlob, (err, files) => {
        if (err) reject(err);
        const promises = files.map(copyFile);
        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });

});

const copyAll = (pkgSrcGlob, distDir) => new Promise((resolve, reject) => {

    if (typeof distDir !== 'string') {
        reject(new Error('Provided dist directory must be a string'));
    }
    dist = distDir;

    glob(pkgSrcGlob, (err, dirs) => {
        if (err) reject(err);

        const promises = dirs.map(dir =>
            getPkg(dir)
                .then(addManifestToPkg)
                .then(copy)
        );

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });

});

module.exports = {
    copyAll,
    getPkg,
    getPackageJson,
    getAssetsManifest,
    addManifestToPkg,
    copy
};
