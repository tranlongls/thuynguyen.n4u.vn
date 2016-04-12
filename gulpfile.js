// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var del = require('del');

var config = {
	buildFolder: './build/',
	deployFolder: './dist/',
	assetFolder: './assets/'
}

gulp.task('buildCSS.dev', function() {
	gulp.src([config.assetFolder + 'css/**/*.css'])
		.pipe(concat('main.css'))
		.pipe(gulp.dest(config.buildFolder + 'lib/css'))
		.pipe(livereload());
});
gulp.task('buildCSS.prod', function() {
	gulp.src([config.assetFolder + 'css/**/*.css'])
		.pipe(concat('main.css'))
		.pipe(minifyCSS({comments:true,spare:true}))
		.pipe(gulp.dest(config.deployFolder + 'lib/css'));
});
gulp.task('buildJS.dev', function() {
	gulp.src([config.assetFolder + 'js/*.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(config.buildFolder + 'lib/js'))
		.pipe(livereload());
});
gulp.task('buildJS.prod', function() {
	gulp.src([config.assetFolder + 'js/*.js'])
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.deployFolder + 'lib/js'));
});
gulp.task('copyAssets.dev', function () {
	gulp.src(['!./assets/css/*.css','./assets/css/**/*'])
		.pipe(gulp.dest('./build/lib/css'));
	gulp.src(['./app/**/*.html'])
		.pipe(gulp.dest('./build/'))
		.pipe(livereload());;
});
gulp.task('clean.build', function() {
	del(['./build/*'], function (err, paths) {
		console.log('Deleted all files from build folder');
		// cb();
	});
});
gulp.task('clean', function(cb) {
	del(['./dist/*'], function (err, paths) {
		console.log('Deleted all files from dist folder');
		cb();
	});
});

gulp.task('minify-css', function() {
	var opts = {comments:true,spare:true};
	gulp.src(['./app/**/*.css'])
		.pipe(minifyCSS(opts))
		.pipe(gulp.dest('./dist/'));
});
gulp.task('minify-js', function() {
	gulp.src(['./app/**/*.js'])
		.pipe(uglify({
			// inSourceMap:
			// outSourceMap: "app.js.map"
		}))
		.pipe(gulp.dest('./dist/'));
});
gulp.task('copy-html-files', function () {
	gulp.src('./app/**/*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});
gulp.task('connect', function () {
	connect.server({
		root: 'build/',
		port: 8888,
		fallback: 'build/index.html'
	});
});
gulp.task('connectDist', function () {
	connect.server({
		root: 'dist/',
		port: 9999
	});
});
gulp.task('browserify', function() {
	gulp.src(['app/js/main.js'])
	.pipe(browserify({
		insertGlobals: true,
		debug: true
	}))
	.pipe(concat('bundled.js'))
	.pipe(gulp.dest(config.buildFolder + 'js'))
	.pipe(livereload());
});
gulp.task('browserifyDist', function() {
	gulp.src(['app/js/main.js'])
	.pipe(browserify({
		insertGlobals: true,
		debug: true
	}))
	.pipe(concat('bundled.js'))
	.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('app/js/**/*.js', ['browserify']);
	gulp.watch(config.assetFolder + 'css/**/*.css', ['buildCSS.dev']);
	gulp.watch(config.assetFolder + 'js/*.js', ['buildJS.dev']);
	gulp.watch('./app/**/*.html', ['copyAssets.dev']);
});

// *** default task *** //
gulp.task('default', ['clean.build'], function() {
	runSequence(
		[ 'copyAssets.dev','buildCSS.dev', 'buildJS.dev', 'browserify', 'connect', 'watch']
	);
});
// *** build task *** //
gulp.task('build', ['clean'], function() {
	assetTask(true);
	runSequence(
		['minify-css', 'browserifyDist']
	);
});
