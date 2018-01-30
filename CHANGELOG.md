# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


v0.6.0
------------------------------
*January 29, 2018*

## Added
- Added `dest` property to `assets` definition which allows users to override the default destination directory as set in the gulp build config.
- Added ability to specify multiple asset configurations in the `package.json` config.
- Added documentation for the `dest` asset option.
- Added documentation for the ability to specify multiple asset configurations.

## Changed
- `assets` property in `package.json` can now be specified as an array of assets.
- Renamed `copyOnePackage` function to `copyPackages`.
- Ignoring console lint warnings.

## Removed
- Removed babel `babel-minify` package.

## Fixed
- Correctly returning promises inside `copyPackages` function to prevent `undefined` values from being processed.


v0.5.0
------------------------------
*January 29, 2018*

## Changed
- Updated `.gitignore` rules.
- JavaScript is now transpiled using babel.
- Main script is now pointing at the `dist` directory.
- Using `import` keyword rather than `require` inside modules.


v0.4.0
------------------------------
*October 17, 2017*

### Fixed
- Fixed `EISDIR` error.

### Added
- Added changelog file.
- Added repository info and links to `package.json`.
- Added `prepare` npm script — using `concurrently` in order to run tasks concurrently.
- Added `jest` for unit testing.
- Added `eslint` for linting.

### Changed
- Moved tests folder into root of project.
- License file updated to shorter version.
- Updated Travis config file.
- Moved dev packages into `devDependencies` section.
- Tidied up `gulpfile.js`.
- Updated method names to be more consistent.

### Removed
- Removed `.babelrc` file.
- Removed `_build` directory and files.
- Removed sections from `package.json` which are not required.
- Removed `gulp-build-fozzie` dependency as we only require unit testing and linting.



v0.3.0
------------------------------
*August 24, 2017*

### Changed
- Reverted prepublish task which used `gulp scripts` task to compile the source JavaScript — un-transpiled code is now exosed.
