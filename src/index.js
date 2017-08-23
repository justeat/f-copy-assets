import glob from 'glob';
import {
    getPackage,
    addManifestToPackage,
    copyPackages
} from './lib';
import config from './config';


/**
 * The main export - copies all assets found in pkgSrcGlob to the dest
 *
 * @param {object} options
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

        const promises = dirs.map(dir => getPackage(dir)
            .then(addManifestToPackage)
            .then(copyPackages));

        Promise
            .all(promises)
            .then(resolve)
            .catch(reject);
    });
});

module.exports = copyAssets;
