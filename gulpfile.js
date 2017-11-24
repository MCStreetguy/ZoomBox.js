const gulp  = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const pump = require('pump');

function buildJQuery() {
  pump([
    plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }),
    gulp.src('src/jquery.js'),
    uglify(),
    rename('zoombox.jquery.min.js'),
    gulp.dest('dist/')
  ])
}
gulp.task('build-jQuery',buildJQuery);

function buildPlain() {
  pump([
    plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }),
    gulp.src('src/plain.js'),
    uglify(),
    rename('zoombox.min.js'),
    gulp.dest('dist/')
  ])
}
gulp.task('build-plain',buildPlain);

gulp.task('default', ['build-jQuery','build-plain'], function() {
  gulp.watch('src/jquery.js',['build-jQuery']);
  gulp.watch('src/plain.js',['build-plain']);
});
