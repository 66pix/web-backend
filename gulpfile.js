'use strict';

var gulp = require('gulp');

var gulpFilter = require('gulp-filter');
var guppy = require('git-guppy')(gulp);
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');

function lintFiles(files) {
  return gulp.src(files)
    .pipe(gulpFilter(['*.js']))
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

gulp.task('lint', function() {
  return lintFiles([
    'src/**/*.js'
  ]);
});

gulp.task('pre-commit', guppy.src('pre-commit', function(filesBeingCommitted) {
  return lintFiles(filesBeingCommitted);
}));

