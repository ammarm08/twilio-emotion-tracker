var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var notify = require('gulp-notify');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var options = {
    entries: ['./src/' + file],
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    plugin: [watchify]
  };

  var bundler = watch ? watchify(options) : browserify(options);

  function rebundle() {
    var stream = bundler.bundle();

    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./public/'));
  }

  bundler.on('update', function() {
    rebundle();
    console.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('build', function() {
  return buildScript('App.js', false);
});