const gulp = require('gulp');
const { build } = require('@justeat/gulp-build-fozzie');

build(gulp, {
    js: {
        files: {
            main: {
                distFile: 'index.js',
                applyRevision: false
            }
        },
        jsDir: ''
    }
});
