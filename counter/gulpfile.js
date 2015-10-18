var gulp = require('gulp');
var gutil = require('gulp-util');

var _ = require('lodash');

var browserify = require('browserify');
var tsify = require('tsify');
var babelify = require("babelify");
var watchify = require("watchify");

var source = require("vinyl-source-stream");
var config = {
  src: './src/main.ts',
  filename: 'bundle.js',
  dist: './dist'
}

var extensions = ['.js', '.ts', '.json'];

// prepare browserify
var customOpts = {
  entries: [config.src],
  extensions: extensions,
  debug: true
}
var options = _.assign({}, watchify.args, customOpts)
var b = watchify(browserify(options));

// prepare watchify
b.on('update', bundle);
b.on('log', gutil.log)
b.on('error', function(error){
  console.log(error.toString())
})

function bundle() {
  b.plugin(tsify, {
      target: 'es6',
      noImplicitAny: true,
    })
    .transform(babelify.configure({
      extensions: extensions
    }))
    .bundle()
    .pipe(source(config.filename))
    .pipe(gulp.dest(config.dist))
}

gulp.task('build', function() {
  bundle();
});
