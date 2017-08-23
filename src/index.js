const glob = require('glob');
const {
    getPkg,
    addManifestToPkg,
    copyOnePackage
} = require('./lib');
const config = require('./config');

/*
 * The main export - copies all assets found in pkgSrcGlob to the dest
 */
const copyAssets = options => new Promise((resolve, reject) => {

    if (options) {
        config.update(options);
    }

    if (typeof config.dest !== 'string') {
        reject(new Error('Provided destination directory must be a string'));
    }

    glob(config.pkgSrcGlob, (err, dirs) => {
        if (err) reject(err);

        const promises = dirs.map(dir =>
            getPkg(dir)
                .then(addManifestToPkg)
                .then(copyOnePackage)
        );

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });

});

module.exports = copyAssets;
