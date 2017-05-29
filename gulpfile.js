var gulp = require('gulp');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');

var util = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var less = require('gulp-less');
var csslint = require('gulp-csslint');
var lessReporter = require('gulp-csslint-less-reporter');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var postcss = require('gulp-postcss');
var rtlcss = require('gulp-rtlcss');


// Inspriation: <https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e>

gulp.task('less', function () {
  return gulp.src(['./css/less/global.less'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(less().on('error', util.log))
    .pipe(csslint({
      'lookup': false, // allows overrites of rules (see rule below)
      'important': false
    }))
    .pipe(lessReporter())
    .pipe(postcss([ autoprefixer({ browsers: ['> 1%', 'last 3 versions'] }) ]))
    .pipe(rename('global.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./css/'))
    .pipe(notify({ message: 'Finished LESS Gulp Tasks'}));
});

// Docs: <https://github.com/postcss/autoprefixer>
gulp.task('autoprefixer', function () {
  return gulp.src('./css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css/'));
});

// Docs: <https://github.com/MohammadYounes/rtlcss>
gulp.task('rtlcss', function () {
  return gulp.src('./css/global.css')
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest('./css/'));
});

gulp.task('nodemon', function (cb) {
  return nodemon({
    script: 'app.js'
  }).on('start', function () {
      cb();
  });
});

gulp.task('watch', function () {
  // watch less files
  gulp.watch('./css/less/**/*.less', ['less']);

  // watch CSS and RTL it
  gulp.watch('./css/global.css', ['rtlcss']);

});

gulp.task('default', ['less', 'nodemon', 'watch']);
