/*jslint nomen: true*/
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const gulp = require('gulp');
const minifyCSS = require('gulp-minify-css');
const notify = require('gulp-notify');
const nn = require('node-notifier');
const path = require('path');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const serve = require('gulp-serve');
const wrap = require('gulp-wrap');

gulp.task('serve', serve({
  root: 'public',
  port: 4000
}));

gulp.task('layout', function () {
  return gulp.src(['app/**/*.html', '!app/layout.html'])
    .pipe(wrap({src: 'app/layout.html'}))
    .pipe(gulp.dest('public'));
});

gulp.task('css', function () {
	'use strict';
	gulp.src([
			'scss/**/*.scss'
		])
		.pipe(sass())
		.on('error', function (err) {
			console.log(err)
			notify.onError({icon: path.join(__dirname, "img/css-error.png"), title: 'Oops!', message: err})()
		})
		.pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
		.pipe(minifyCSS())
		.pipe(notify({icon: path.join(__dirname, "img/css.png"), onLast: true, title: 'CSS!', message: 'Updated files.'}))
		.pipe(gulp.dest('public/dist/css'));
	return;
});

gulp.task('js', function () {
	'use strict';
	gulp.src([
		'js/**/*.js',
		'!js/**/*.spec.js',
		'components/**/*.js',
		'!components/**/*.spec.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'
	])
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.on('error', notify.onError({icon: path.join(__dirname, "img/js-error.png"), title: 'Oops!', message: 'There is a JS error.'}))
		.pipe(notify({icon: path.join(__dirname, "img/js.png"), onLast: true, title: 'JS!', message: 'Updated files.'}))
		.pipe(gulp.dest('public/dist/js'));
	return;
});

gulp.task('watch', function () {
	'use strict';
	gulp.watch('app/**/*.html', ['layout']);
	gulp.watch('components/**/*.scss', ['css']);
	gulp.watch('scss/**/*.scss', ['css']);
	gulp.watch('components/**/*.js', ['js']);
	gulp.watch('js/**/*.js', ['js']);
});

gulp.task('default', ['watch', 'css', 'js', 'layout', 'serve']);
