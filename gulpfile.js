const gulp = require('gulp');
const { build } = require('@justeat/gulp-build-fozzie');

build(gulp, {
    js: {
        jsDir: '',
        distFile: 'index.js',
        applyRevision: false
    }
});
