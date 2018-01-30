/**
 * Default options
 */
let config = {
    pkgSrcGlob: 'node_modules/*/',
    dest: 'dist',
    verbose: false,
    logger: console.log,

    update: options => {
        config = Object.assign(config, options);
    }
};

module.exports = config;
