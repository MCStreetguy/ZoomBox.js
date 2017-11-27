const gulp  = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const pump = require('pump');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

function buildJQuery() {
  pump([
    plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }),
    gulp.src([
      'src/jquery.js'
    ]),
    concat('main.js'),
    uglify(),
    rename('zoombox.jquery.min.js'),
    gulp.dest('dist/')
  ])
}
gulp.task('build-jQuery',buildJQuery);

function buildPlain() {
  // pump([
  //   plumber({
  //     errorHandler: function(err) {
  //       console.log(err);
  //       this.emit('end');
  //     }
  //   }),
  //   gulp.src('src/plain.js'),
  //   uglify(),
  //   rename('zoombox.min.js'),
  //   gulp.dest('dist/')
  // ])
}
gulp.task('build-plain',buildPlain);

function buildCss() {
  pump([
    plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }),
    gulp.src([
      'src/styles.scss'
    ]),
    concat('main.scss'),
    sass(),
    cleanCSS(),
    autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    }),
    rename('zoombox.min.css'),
    gulp.dest('dist/')
  ])
}
gulp.task('build-css',buildCss);

gulp.task('build', ['build-jQuery','build-plain','build-css'])

gulp.task('default', ['build'], function() {
  gulp.watch('src/jquery.js',['build-jQuery']);
  gulp.watch('src/plain.js',['build-plain']);
  gulp.watch('src/styles.scss',['build-css']);
});
