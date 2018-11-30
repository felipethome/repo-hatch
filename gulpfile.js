const gulp = require('gulp');
const log = require('fancy-log');
const gulpif = require('gulp-if');
const gulpzip = require('gulp-zip');
const del = require('del');
const cleanCSS = require('gulp-clean-css');

// Don't transpile the tasks to ES5 and minify using a ES6+ compatible 'uglify'.
const uglify = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minify = composer(uglify, console);

const prod = process.env.NODE_ENV === 'production';

const clean = function () {
  return del(['build/**', 'build.zip']);
};

const copy = function () {
  return gulp.src(['src/**/!(*.js|*.css)'])
    .on('error', log)
    .pipe(gulp.dest('build'));
};

const scripts = function () {
  return gulp.src(['src/!(tests|test)/**/*.js'])
    .pipe(gulpif(prod, minify()))
    .on('error', log)
    .pipe(gulp.dest('build'));
};

const libStyles = function () {
  return gulp.src('src/lib/**/*.css')
    .pipe(gulpif(prod, cleanCSS()))
    .pipe(gulp.dest('build/lib'));
};

const styles = function () {
  return gulp.src('src/styles/**/*.css')
    .pipe(gulpif(prod, cleanCSS()))
    .pipe(gulp.dest('build/styles'));
};

const zip = function () {
  return gulp.src('build/**')
    .pipe(gulpzip('build.zip'))
    .pipe(gulp.dest('./'));
};

const watch = function () {
  gulp.watch('src/**/*', ['copy', 'libStyles', 'scripts', 'styles']);
};

gulp.task('clean', clean);
gulp.task('copy', ['clean'], copy);
gulp.task('libStyles', ['clean'], libStyles);
gulp.task('scripts', ['clean'], scripts);
gulp.task('styles', ['clean'], styles);
gulp.task('zip', ['clean', 'copy', 'scripts'], zip);
gulp.task('watch', ['clean', 'copy', 'scripts'], watch);

gulp.task('dev', ['clean', 'copy', 'libStyles', 'scripts', 'styles', 'watch']);
gulp.task('build', ['clean', 'copy', 'libStyles', 'scripts', 'styles', 'zip']);