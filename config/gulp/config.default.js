
module.exports = {
	defaultTasks: ['build', 'watch', 'browser-sync'],
	output: 'assets/',

	js: {
		input: './src/js/**/*.js',
		watch: './src/js/**/*.js',
		output: 'main.js',
		sourcemaps: true,
		minify: false,
		order: [
			'jquery.min.js',
			'libraries/*',
			'**/*',
			'main.js'
		]
	},

	css: {
		input: './src/scss/main.scss',
		watch: './src/scss/**/*.scss',
		output: 'main.css',
		sourcemaps: true,
		minify: false
	},

	assets: {
		input: './src/assets/**/*',
		base: './src/assets',
		watch: './src/assets/**/*'
	},

	markup: {
		// watch: './templates/**/*'
	},

	browserSync: {
		// proxy: 'haworth-music-development-2.myshopify.com'
	}
}
