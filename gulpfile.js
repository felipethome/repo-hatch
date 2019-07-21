const gulp = require('gulp');
const gulpzip = require('gulp-zip');
const log = require('fancy-log');
const del = require('del');

const resourcesFolder = 'resources';
const outputFolder = 'build';
const outputFile = 'build.zip';

const clean = function () {
  return del([`${outputFolder}/**`, outputFile]);
};

const copy = function () {
  return gulp.src([`${resourcesFolder}/**/*`])
    .on('error', log)
    .pipe(gulp.dest('build'));
};

const zip = function () {
  return gulp.src(`${outputFolder}/**`)
    .pipe(gulpzip(outputFile))
    .pipe(gulp.dest('./'));
};

gulp.task('clean', clean);
gulp.task('copy', ['clean'], copy);
gulp.task('zip', ['clean', 'copy'], zip);
gulp.task('build', ['clean', 'copy', 'zip']);