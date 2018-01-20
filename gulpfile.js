/* Importar módulos */
var gulp = require('gulp')
  , clean = require('gulp-clean')    // Deleção de pastas recursivamente
  , concat = require('gulp-concat')   // Concatenação de aquivos
  , uglify = require('gulp-uglify')   // Minificação de arquivos js
  , usemin = require('gulp-usemin')   // Substituição de arquivos html
  , cssmin = require('gulp-cssmin')   // Minificação de arquivos css
  , browserSync = require('browser-sync')  // Server
  , jshint = require('gulp-jshint')   // Verificação de sintaxe js
  , jshintStylish = require('jshint-stylish')// Reporter jshint
  , csslint = require('gulp-csslint')  // Verificação de sintaxe css
  , autoprefixer = require('gulp-autoprefixer') // Prefixação dos atributos css
  , sass = require('gulp-sass') // Pré-procesador css (sass)



/* Default task*/
gulp.task('default', ['copy'], () => {
  gulp.start('usemin');
});

/* Copy files to dist */
gulp.task('copy', ['clean'], () => {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('dist'));
});

/* Delete folders */
gulp.task('clean', () => {
  return gulp.src('dist')
    .pipe(clean());
});


/*Usemin: replacehtml and minify css and javascript */
gulp.task('usemin', () => {

  gulp.src('dist/**/*.html')
    .pipe(usemin({
      'js': [uglify],
      'css': [autoprefixer, cssmin]
    }))
    .pipe(gulp.dest('dist'));
});



/*Brosersync */
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
  // Verificação de sintaxe para arquivos js
  gulp.watch('src/js/*.js').on('change', (event) => {
    gulp.src(event.path)
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish));
  });
  // Compilar arquivos sass
  gulp.watch('src/sass/*.scss').on('change', (event) => {
    console.log("Compilando o arquivo: ");
    console.log(event.path);
    gulp.src(event.path)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/css'));
  });

  // Verificação de sintaxe para arquivos css
  gulp.watch('src/css/*.css').on('change', (event) => {
    gulp.src(event.path)
      .pipe(csslint())
      .pipe(csslint.formatter());
  });


  // Recarregar página para as alterações
  gulp.watch('src/**/*').on('change', browserSync.reload);
});
