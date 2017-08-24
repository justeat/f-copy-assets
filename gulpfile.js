const gulp = require('gulp');
const { build } = require('@justeat/gulp-build-fozzie');

gulp.task('default', ['scripts:lint', 'scripts:test']);

build(gulp, {
    js: {
        jsDir: ''
    }
});
