
module.exports = {
	// Production tends to only need a single build sweep
	defaultTasks: ['build'],

	// Switching to minification w/o sourcemaps for production mode
	js: {
		sourcemaps: false,
		minify: true
	},

	css: {
		sourcemaps: false,
		minify: true
	}
}
