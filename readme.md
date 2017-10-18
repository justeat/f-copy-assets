# f-copy-assets
 
[![npm version](https://badge.fury.io/js/%40justeat%2Ff-copy-assets.svg)](https://badge.fury.io/js/%40justeat%2Ff-copy-assets)

A module that copies assets from node_modules to a specified destination directory, using promises

## Usage
```js
const copyAssets = require('@justeat/f-copy-assets');

const options = {
    pkgSrcGlob: 'node_modules/@justeat/*/', 
    dest: 'Assets/',
    verbose: true,
    logger: gutil.log
};

copyAssets(options)
```

Assets are defined in packages' `package.json` like so:
```json
{
    "name": "my-package",
    "assets": {
        "root": "dist/",
        "glob": "img/**/*.svg"
    }
}
```
All files matching the glob `"dist/img/**/*.svg"` will be copied to the dest directory. File structure below `"root"` will be preserved, so in this example, copied assets would be found in `"Assets/img/..."`.

## Options

### pkgSrcGlob:
default: `'node_modules/*/'`
Glob to match directory (or directories) containing packages from which will be copied if they are found

### dest
default: `'dist'`
The directory to copy files to

### verbose
default: `false`
Whether or not to log the files that are being copied

### logger
default: `console.log`
If `verbose`, the function to use for logging
