
let project_folder = "dist";  // папка в котрую собирается gulp и потом выгружается для демонстрации
let source_folder = "#src";   // папка с исходниками 

let fs = require('fs'); //file system перем. для подключение шрифтов в стили


// содержит пути к разным файлам и папка уже обработаных файлов

let path = {
    build: {
        html:project_folder + "/",
        css:project_folder + "/css/",
        js:project_folder + "/js/",
        img:project_folder + "/img/",
        fonts:project_folder + "/fonts/",

    },
    // для исходников
    src: {
        html:[source_folder + "/*.html", "!" + source_folder + "/_*.html"], // исключение для файлов с нижним регистром
        css:source_folder + "/scss/style.scss",
        js:source_folder + "/js/script.js",
        img:source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", //слушает все под папки с определнным форматом
        fonts:source_folder + "/fonts/*.ttf",
    },
    // обьект которые слуашет и смотрит на все изминения
    watch: {
        html:source_folder + "/**/*.html",
        css:source_folder + "/scss/**/*.scss",
        js:source_folder + "/js/**/*.js",
        img:source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", //слушает все под папки с определнным форматом
    },
    //отвечает за удаление папки проэкт при каждом запуске gulp
    clean: "./" + project_folder + "/"
}

// переменные для помощи написания сценария gulp
// обьявляем переменные для плагинов
let { src , dest } = require('gulp'),
        gulp = require('gulp'),
        browsersync = require("browser-sync").create(),  // переменная для плагина browser sync
        fileinclude = require("gulp-file-include"),    // присваеваем переменной плагин
        del = require("del"),   // присваеваем переменной плагин
        scss = require("gulp-sass"),   // присваеваем переменной плагин
        autoprefixer = require("gulp-autoprefixer"),   // присваеваем переменной плагин
        clean_css = require("gulp-clean-css"),   // присваеваем переменной плагин
        rename = require("gulp-rename"),   // присваеваем переменной плагин
        uglify = require("gulp-uglify-es").default,
        imagemin = require("gulp-imagemin"),
        ttf2woff = require("gulp-ttf2woff"),
        ttf2woff2 = require("gulp-ttf2woff2"),
        fonter  = require("gulp-fonter");
        
//функция которая обновляет страницу
function browserSync(params) {
    // обращение к переменной
    browsersync.init ({
        //настройка сервера
        server:{
            baseDir: "./" + project_folder + "/" //базовая папка 
        },
        port: 3000,  //порт по которому открывается браузер
        notify: false //  отображает табличку браузер отключился
    })
}      

//функция для работы с html файлами
function html() {
    return src(path.src.html) //обращаемся в корень исходной папки проэкта
    .pipe(fileinclude()) // соберает файл в один
    .pipe(dest(path.build.html))  //( pipe функции внутри который мы пишем команды для gulp) обращаемся к папке с результатом
    .pipe(browsersync.stream())  // обнови страницу
}

//функция для работы с css файлами
function css() {
    return src(path.src.css) 
        .pipe(
            scss({
            outputStyle: "expanded"  //натсройка css что бы был не сжатим
        })
        )
        .pipe(
        autoprefixer({
            overrideBrowserlist :["last 5 version"],
            cascade:true
        })
        )
        .pipe(dest(path.build.css)) 
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'    //сжимает файл с именем min css
            })
            )
    .pipe(dest(path.build.css))  
    .pipe(browsersync.stream())  
}

function js() {
    return src(path.src.js) //обращаемся в корень исходной папки проэкта
    .pipe(fileinclude()) // соберает файл в один
    .pipe(dest(path.build.js))
    .pipe(
        uglify()
        )
    .pipe(
        rename({
            extname: '.min.js'    //сжимает файл с именем min css
        })
        )
    .pipe(dest(path.build.js))  //( pipe функции внутри который мы пишем команды для gulp) обращаемся к папке с результатом
    .pipe(browsersync.stream())  // обнови страницу
}





// функция которая чистит папку dist
function clean(params) {
    return del(path.clean);  //путь к папке dist 
}



function images() {
     return src(path.src.img)
     .pipe(
         imagemin({
            progressive: true,
            svgPlugins : [{removeViewBox: false}],
            interlaced: true,
            optimizationlevel:3  // 0 to 7
         })
         ) 
    .pipe(dest(path.build.img))  
    .pipe(browsersync.stream())  
}


 function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))  
}


gulp.task('otf2ttf', function () {
    return src([source_folder + '/fonts/*.otf'])  //идем в папку
        .pipe(fonter({
            formats: ['ttf']  // обращаемся к плагину фонтер и пишим формат который хотим получить
        }))
        .pipe(dest(source_folder + '/fonts/')); // выгружаем в папку исходник шрифты
})

//функция которая овтечает за подключение шрифтов к css
// async function fontsStyle(params) {

//     let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
//     if (file_content == '') {
//         fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
//         return fs.readdir(path.build.fonts, function (err, items) {
//             if (items) {
//                 let c_fontname;
//                 for (var i = 0; i < items.length; i++) {
//                     let fontname = items[i].split('.');
//                     fontname = fontname[0];
//                     if (c_fontname != fontname) {
//                         fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
//                     }
//                     c_fontname = fontname;
//                 }
//             }
//         })
//     }
//  }
    
function fontsStyle(cb) {
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
      fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
      return fs.readdir(path.build.fonts, function (err, items) {
        if (items) {
          let c_fontname;
          for (var i = 0; i < items.length; i++) {
            let fontname = items[i].split('.');
            fontname = fontname[0];
            if (c_fontname != fontname) {
              fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
            }
            c_fontname = fontname;
          }
        }
      })
    }
    cb()
  }

//функция колбек
// function cb() {

// }




//функция слежки за нашими файлами

function watchfiles(parmas) {
    gulp.watch([path.watch.html],html); //слежка за html файлами
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}



//подружить функции с gulpom
let build = gulp.series(clean,gulp.parallel(js,css,html,images,fonts)); //(fontsStyle) внутри пишем функции которые должны выполняться(функция css html выполняется паралельно)

// переменная со сценарием выполнения функций,каждую новую нужно записывать сюда
let watch = gulp.parallel(build,browserSync,watchfiles);

// знакомим gulp с новыми переменными
exports.js = js;
exports.css = css;
exports.html = html;
exports.fonts = fonts;
exports.images = images;
// exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch; 

// эта переменные запускается при запуске gulp,
// которая в свою очередь запускает другие переменные,функции 



 
                         
// ПЛАГИНЫ КОТОРЫЕ ИСПОЛЬЗОВАЛИСЬ

// fileinclude
// browsersync
// del
// gulp-sass
// gulp-autoprefixer
// clean_css
//  gulp-rename
//  gulp-imagemin
//  uglify