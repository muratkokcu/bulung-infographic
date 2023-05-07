const { src, dest, watch, series, parallel } = require('gulp');
const order = require("gulp-order");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
sass.compiler = require('node-sass');
var removeUseStrict = require("gulp-remove-use-strict");

const devCSS = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: [
                '>= 1%',
                'last 1 major version',
                'not dead',
                'Chrome >= 45',
                'Firefox >= 38',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 9',
                'Safari >= 9',
                'Android >= 4.4',
                'Opera >= 30',
            ],
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./assets/css'))
        .pipe(browserSync.stream());
};
const devJS = () => {
    return src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/uikit/dist/js/uikit.min.js',
            'node_modules/uikit/dist/js/uikit-icons.min.js',
            'node_modules/countup.js/dist/countUp.min.js',
            './src/js/**/*.js'
        ])
        .pipe(order([
            '/node_modules/jquery/dist/jquery.min.js',
        ], { base: './' }))
        .pipe(concat('main.js'))
        .pipe(
            babel({
                comments: false,
                presets: ['@babel/env'],
            })
        )
        .pipe(uglify())
        .pipe(dest('./assets/js'))
        .pipe(browserSync.stream());
};
const liveReload = () => {
    //For Apache, Nginx, etc...
    browserSync.init({
        server: './'
    });
};

const devWatch = () => {
    liveReload();
    watch('./src/scss/**/*.scss', devCSS).on('change', browserSync.reload);
    watch('./src/js/**/*.js', devJS).on('change', browserSync.reload);
    watch('./**/*.html').on('change', browserSync.reload);
};

exports.default = series(parallel(devCSS, devJS), devWatch);
