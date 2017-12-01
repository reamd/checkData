/**
 * Created by reamd on 2016/10/25.
 */
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    del = require('del'),
    livereload = require('gulp-livereload'),
    webServer = require('gulp-webserver'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('del', function () {
    return del.sync('dist');
});

gulp.task('babel', ['del'], function () {
    gulp.src('src/**/*.js')
        // .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
});

gulp.task('scripts', ['babel'], function() {
    return setTimeout(function () {
        gulp.src('dist/**.js')
            .pipe(rename({ suffix: '.min' }))
            // .pipe(sourcemaps.init())
            .pipe(uglify())
            // .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/'))
            .pipe(notify("<%= file.relative %> uglify success!"));
    },3000)
});

gulp.task('server', function() {
    gulp.src('./')
        .pipe(webServer({
            port: 8282,
            // path: '/example',
            livereload: {
                enable: true
            },
            directoryListing: true,
            fallback: 'index.html',
            open: '/example/index.html'
        }));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['babel']);
});

/*研发环境*/
gulp.task('dev', ['del', 'babel', 'server', 'watch']);

/*发布环境*/
gulp.task('build', ['del', 'babel', 'scripts']);

// gulp.task('default', ['del', 'scripts']);
