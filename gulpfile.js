//https://css-tricks.com/gulp-for-beginners/

var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref'); //combine js and css files
var gulpIf = require('gulp-if'); //helper for useref
var htmlmin = require('gulp-htmlmin'); //minimize html
var uglify = require('gulp-uglify'); //minimize js
var cssnano = require('gulp-cssnano'); //minimize css
var ngAnnotate = require('gulp-ng-annotate'); // So we can minimize angular apps.
var rev = require('gulp-rev'); //appends content hashes
var revReplace = require('gulp-rev-replace'); //updates references to hashed files

var del = require('del'); //delete stuff
var bower = require('gulp-bower'); //runs bower

gulp.task('less', function(){
  return gulp.src('src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});

gulp.task('useref', ['less'], function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', ngAnnotate()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.js', rev()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.css', rev()))
    .pipe(revReplace())
    .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
  return gulp.src('src/components/font-awesome/fonts/*.woff2')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('default', function() {
  console.log("No default task defined!");
});

gulp.task('watch', ['browserSync', 'less', 'useref', 'fonts'], function(){
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch('src/**/*.html');
  gulp.watch('src/**/*.js');
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('clean:all', function() {
  return del.sync(['src/css', 'dist', 'node_modules', 'src/components']);
})
gulp.task('init', function() {
  return bower();
});
gulp.task('build:dist', ['useref', 'fonts'], function() {
})
