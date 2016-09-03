var gulp = require('gulp'),
    critical = require('critical'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin');
    sourcemaps = require('gulp-sourcemaps'),
    responsive = require('gulp-responsive-images'),
    copy = require('gulp-copy'),
    filesize = require('gulp-filesize'),
    react = require('gulp-react');


var inputPath = {
    'css': './src/css/*.css',
    'js': './src/js/*.js',
	'lib': './src/js/lib/*.js',
    'img': './src/images/*',
    'fonts': './src/fonts/*/**/*'
};


var outputPath = {
    'css': './dist/css/',
    'js': './dist/js/',
    'lib': './dist/js/lib/',
    'img': './dist/images/',
    'icons': './dist/images/icons/',
    'fonts': './dist/fonts/'
};


gulp.task('critical', function (cb) { //src: http://fourkitchens.com/blog/article/use-gulp-automate-your-critical-path-css
    critical.generate({
        base: './',
        src: './index.html',
        css: ['./src/css/fonts.css', './src/css/reset.css', './src/css/style.css'],
        dimensions: [{
            width: 320,
            height: 480
    }, {
            width: 768,
            height: 1024
    }, {
            width: 1280,
            height: 960
    }],
        dest: './dist/css/critical.css',
        minify: true,
        extract: false
            //ignore: ['font-face']
    });
});


gulp.task('scripts', function () {
    gulp.src(inputPath.js)
        .pipe(sourcemaps.init())
            .pipe(react())
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputPath.js))
        .pipe(filesize())
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});


gulp.task('styles', function () {
    gulp.src(inputPath.css)
        .pipe(sourcemaps.init())
            .pipe(autoprefixer())
            .pipe(concat('style.min.css'))
            .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputPath.css))
        .pipe(filesize())
        .pipe(notify({
            message: 'Styles task complete'
        }));
});


gulp.task('images', function (cb) {
	gulp.src(inputPath.img)
        .pipe(imagemin())
    .pipe(gulp.dest(outputPath.img))
	.pipe(notify({
		message: 'Styles task complete'
	}));
});


gulp.task('copy-lib', function () {
    gulp.src([inputPath.lib])
        .pipe(gulp.dest((outputPath.lib)));
});


gulp.task('copy-fonts', function () {
    gulp.src([inputPath.fonts])
        .pipe(gulp.dest((outputPath.fonts)));
});


gulp.task('watch', function () {
    gulp.watch(inputPath.css, ['styles']);
    gulp.watch(inputPath.js, ['scripts']);
});


gulp.task('default', ['scripts', 'styles', 'images', 'copy-lib', 'copy-fonts', 'watch']);
