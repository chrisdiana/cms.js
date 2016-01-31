var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var notify = require('gulp-notify');
var connect = require('gulp-connect');

gulp.task('watchify', function() {
  var args = watchify.args;

  args.debug = true;
  var bundler = watchify(browserify('./src/cms.js', args));

  function rebundle() {
    return bundler.bundle()
      .on('error', notify.onError())
      .on('end', console.log.bind(null, 'Bundled'))
      .pipe(source('cms.js'))
      .pipe(gulp.dest('./boilerplate/js'))
      .pipe(connect.reload());
  }

  bundler.on('update', rebundle);

  rebundle();
});

gulp.task('connect', () => {
  connect.server({
    root: './boilerplate',
    livereload: true,
    port: 8000
  });
});

gulp.task('default', ['connect', 'watchify']);
