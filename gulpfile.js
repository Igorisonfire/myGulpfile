var gulp = require('gulp'),
    mainsass = require('gulp-sass'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('mainsass', function () {
    return gulp.src('app/sass/main.sass')                                                           //файлы где нужен autoprefix
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1% ', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('sass', function () {                                                                     //не нужен autoprefix(библиотеки sass...bootstrap.sass)
    return gulp.src(['!app/sass/main.sass', 'app/sass/bootstrap.scss'])
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',                                                    //js библиотеки подключение/объеденение
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js/'));
});

gulp.task('css-libs', ['sass'], function () {                                                        //библиотеки css
    return gulp.src(['app/css/bootstrap.css', 'app/css/libs.css'])
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },

    });
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('clear', function () {
    return cache.ClearAll();
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'mainsass', 'css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.sass', ['mainsass', 'sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'mainsass', 'css-libs', 'scripts'], function () {
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/bootstrap.min.css',
        'app/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});



