# f-copy-assets :bear:

[![npm version](https://badge.fury.io/js/%40justeat%2Ff-copy-assets.svg)](https://badge.fury.io/js/%40justeat%2Ff-copy-assets)

A module that copies assets from node_modules to a specified destination directory, using promises


## Usage

```js
const copyAssets = require('@justeat/f-copy-assets');

const options = {
  pkgSrcGlob: 'node_modules/@justeat/*/',
  dest: 'assets/',
  verbose: true,
  logger: gutil.log
};

copyAssets(options)
```

## Module Options

### `pkgSrcGlob`

default: `"node_modules/*/"`

Glob to match directory (or directories) containing packages from which will be copied if they are found.

### `dest`

default: `"dist"`

The directory to copy files to.

### `verbose`

default: `false`

Whether or not to log the files that are being copied.

### `logger`

default: `console.log`

If `verbose`, the function to use for logging.


## Specifying assets to be copied

There are a few different ways this can be configured.

### Basic

```json
{
  "assets": {
    "root": "dist/",
    "glob": "img/**/*.{png,svg}"
  }
}
```

All files matching the glob `"dist/img/**/*.{png,svg}"` will be copied into an `img` directory in the `dest` directory.

## Specify a "dest" directory

```json
{
  "assets": {
    "root": "dist/",
    "glob": "img/**/*.{png,svg}",
    "dest": "./"
  }
}
```

All files matching the glob `"dist/img/**/*.{png,svg}"` will be copied into an `img` directory in the root of the project.

## Multiple asset configurations

```json
{
  "assets": [
    {
      "root": "dist/",
      "glob": "img/**/*.{png,svg}"
    },
    {
      "root": "src/",
      "glob": "templates/**/*",
      "dest": "./"
    }
  ]
}
```

All files matching the glob `"dist/img/**/*.{png,svg}"` will be copied into an `img` directory in the `dest` directory, _**and**_ all files matching the glob `"src/templates/**/*"` will be copied into a `templates` directory in the root of the project.

## Assets Options

### `root`

Root directory to search for assets. The file structure under `"root"` will be preserved, so in this example, copied assets would be found in `"assets/img/..."`.

### `glob`

Specify a glob pattern to search for assets which should be copied.

### `dest`

Specify the directory that the matched assets should be copied into. This option is not required — it will default to [the `dist` option within the module options](#module-options).
