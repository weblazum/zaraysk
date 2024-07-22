const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const pug          = require('gulp-pug');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean        = require('gulp-clean');
const avif         = require('gulp-avif');
const webp         = require('gulp-webp');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const svgSprite    = require('gulp-svg-sprite');
const fonter       = require('gulp-fonter');
const ttf2woff2    = require('gulp-ttf2woff2');
const include      = require('gulp-include');


// конвертация шрифтов
function fonts(){
	return src('src/fonts/src/*.*')
		.pipe(fonter({
			formats: ['woff', 'ttf']
		}))
		.pipe(src('src/fonts/src/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(dest('src/fonts'))
}


// создание svg-спрайтов
function sprite() {
	return src('src/img/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					example: true
				}
			}
		}))
		.pipe(dest('src/img'))
}


// оптимизация картинок
function images() {
	return src(['src/img/src/*.*', '!src/img/src/*.svg'])
		.pipe(newer('src/img/')) // кэширование
		.pipe(avif({quality: 50}))

		.pipe(src('src/img/src/*.*')) // путь к оригиналам
		.pipe(newer('src/img/')) // кэширование
		.pipe(webp())

		.pipe(src('src/img/src/*.*')) // путь к оригиналам
		.pipe(newer('src/img/')) // кэширование
		.pipe(imagemin())

		.pipe(dest('src/img/'))
}

// настройка скриптов
function scripts() {
	return src([
		'node_modules/swiper/swiper-bundle.js',
		'src/js/*.js', // выбираем все файлы .js в папке js
		'!src/js/main.min.js' // исключить файл main.min.js для предотвращения бесконечного цикла
	]) // пути к файлам-источникам
		.pipe(concat('main.min.js')) // переименование, например main.min.js
		.pipe(uglify()) // функция сжатия
		.pipe(dest('src/js')) // путь для скомпилированного файла
		.pipe(browserSync.stream());
}

// настройка стилей
function styles() {
	return src('src/scss/style.scss') // путь к файлу-источнику
		.pipe(autoprefixer({ overrideBrowsersList: ['last 10 version']})) // префиксы последних 10 версий
		.pipe(concat('style.css')) // переименование, например style.min.css
		.pipe(scss({ outputStyle: 'compressed' })) // { outputStyle: 'compressed' } для сжатия
		.pipe(dest('src/css')) // путь для скомпилированного файла
		.pipe(browserSync.stream());
} 

// настройка pug
function layout() {
	return src('src/pug/pages/*.pug') // путь к файлу-источнику
		.pipe(pug()) // Компиляция Pug в HTML
    .pipe(dest('src/')) // Сохранение HTML файлов в папке src
		.pipe(browserSync.stream());
}

// настройка вотчера
function watching() {
	watch(['src/scss/**/*.scss'], styles);
	watch(['src/scss/style.scss'], styles);
	watch(['src/js/main.js'], scripts);
	watch(['src/pug/**/*.pug'], layout);
	watch(['src/img/src'], images);
	watch(['src/**/*.html']).on('change', browserSync.reload);
}

// настройка синхронизации браузера
function browsersync() {
	browserSync.init({
		server: {
			baseDir: "src/"
		}
	});
}

// удаляем папку dist перед компиляцией
function cleanDist() {
	return src('dist')
		.pipe(clean());
}

// собираем нужные файлы из src в dist
function building() {
	return src([
		'src/css/style.css',
		'src/js/main.min.js',
		'src/*.html',
		'src/img/*.*',
		'!src/img/stack',
		'src/fonts/*.*'
	], {base : 'src'})
		.pipe(dest('dist'))
}

exports.layout = layout;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;

exports.build = series(cleanDist, building);
exports.default = parallel(layout, styles, scripts, images, watching, browsersync);
