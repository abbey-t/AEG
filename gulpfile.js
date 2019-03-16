// Libraries used for compilation
var gulp = require('gulp')
  , concat = require('gulp-concat')
  , plumber = require('gulp-plumber')
  , sourcemaps = require('gulp-sourcemaps')
  , sass = require('gulp-sass')
  , watch = require('gulp-watch')
  , uglifyes = require('uglify-es')
  , uglify = require('gulp-uglify/composer')(uglifyes, console)
  , del = require('del')
  , cleanCss = require('gulp-clean-css')
  , postcss = require('gulp-postcss')
  , order = require('gulp-order')
  , autoprefixer = require('autoprefixer')
  , gif = require('gulp-if')
  , argv = require('yargs').argv
  , deepExtend = require('deep-extend')
  , fs = require('fs')
  , browserSync = require('browser-sync').create()
  , eyeglass = require('eyeglass')
  , critical = require('critical').stream 
  , rename = require("gulp-rename") 

  ;

// Build the config
var env = (argv.env || process.env.NODE_ENV || 'development')
console.log('Gulp running with the "' + env + '" environment config.')
var settings = require('./config/gulp/config.default.js');
var envConfigPath = './config/gulp/config.' + env + '.js';
if (fs.existsSync(envConfigPath)) {
	deepExtend(settings, require(envConfigPath));
} else {
	console.log('No environment config for "' + env + '" found, falling back to defaults');
}
// See if there's any local dev overrides and use if set
var localConfigPath = './config/gulp/config.local.js';
if (fs.existsSync(localConfigPath)) {
	deepExtend(settings, require(localConfigPath));
}

// Default task. Run others, and set up the watcher
gulp.task('default', settings.defaultTasks);

// Build the JS and CSS (just a utility task)
gulp.task('build', ['js', 'css', 'assets']);

// Clean the build output dir
gulp.task('clean', function() {
	return del(settings.output + '/*');
});

// Build JS
gulp.task('js', function() {
	return gulp.src(settings.js.input)
		.pipe(plumber())
		.pipe(order(settings.js.order))
		.pipe(gif(settings.js.sourcemaps, sourcemaps.init()))
		.pipe(concat(settings.js.output))
		.pipe(gif(settings.js.minify, uglify()))
		.pipe(gif(settings.js.sourcemaps, sourcemaps.write('.')))
		.pipe(gulp.dest(settings.output))
		;
});

// Reload task for watch
gulp.task('js:reload', ['js'], function(done) {
	browserSync.reload();
	done();
});



// Build CSS
gulp.task('css', function() {
	// Config for postcss
	var postcssOptions = [
		autoprefixer
	];

	// In case we need it later...
	var sassOptions = {
		eyeglass: {}
	};

	// The actual pipeline
	return gulp.src(settings.css.input)
		.pipe(plumber())
		.pipe(gif(settings.css.sourcemaps, sourcemaps.init()))
		.pipe(sass(eyeglass(sassOptions)).on('error', sass.logError))
		.pipe(postcss(postcssOptions))
		.pipe(concat(settings.css.output))
		.pipe(gif(settings.css.minify, cleanCss()))
		.pipe(gif(settings.css.sourcemaps, sourcemaps.write('.')))
		.pipe(gulp.dest(settings.output))
		.pipe(browserSync.stream({match: '**/*.css'}))
		;
});

// Move assets
gulp.task('assets', function() {
	return gulp.src(settings.assets.input, {base: settings.assets.base})
		.pipe(gulp.dest(settings.output))
		;
});

// Reload task
gulp.task('assets:reload', ['assets'], function(done) {
	browserSync.reload();
	done();
});

// Watch files for changes & trigger tasks
gulp.task('watch', function() {
	watch(settings.js.watch, function() { gulp.start('js:reload'); });
	watch(settings.css.watch, function() { gulp.start('css'); });
	watch(settings.assets.watch, function() { gulp.start('assets:reload'); });
});

gulp.task('browser-sync', function() {
	browserSync.init(settings.browserSync);

	watch(settings.markup.watch, function() { browserSync.reload(); });
});
