/**
* Build file
* ---
*
* Build options:
*   -d
*     Fires up a development build, most significant is no script minification
*/


var path        = require( 'path' ),
    fs          = require( 'fs' ),

    gulp        = require( 'gulp' ),
    gutil       = require( 'gulp-util' ),
    gulpif      = require( 'gulp-if' ),
    rimraf      = require( 'gulp-rimraf' ),
    rename      = require( 'gulp-rename' ),
    uglify      = require( 'gulp-uglifyjs' ),
    concat      = require( 'gulp-concat' ),
    less        = require( 'gulp-less' ),
    sourcemaps  = require( 'gulp-sourcemaps' ),
    watch       = require( 'gulp-watch' ),
    order       = require( 'gulp-order' ),
    livereload  = require( 'gulp-livereload' ),
    notify      = require( 'gulp-notify' ),

    eventStream = require( 'event-stream' ),
    args        = require( 'minimist' )( process.argv.slice( 2 ) ),
    moment      = require( 'moment' ),

    build       = require( './build/build.json' ),
    banner      = require( './build/banner' )( './build/banner.tmpl' ),
    builder     = require( './build/builder' );


var alert = function( msg ) {
    return notify({
        title: 'Build',
        message: msg,
        sound: 'Glass'
    });
};

// Supply it to gulp.dest to maintain a globs file structure
var copyStructure = function( file ) {
    return path.join( build.target, path.relative( __dirname, path.dirname( file.path ) ) );
}


/**
* Clean
*/
gulp.task( 'clean', function() {
    return gulp
        .src( './dist', {
            read: false
        })
        .pipe( rimraf() );
});


/**
 * HTML
 * ---
 * Copy over the index page
 */
gulp.task( 'html', function() {
    return gulp
        .src( './public/index.html' )
        .pipe( gulp.dest( path.join( build.target, 'public/' ) ) )
        .pipe( alert( 'HTML built' ) )
        .pipe( livereload({
            auto: false
        }));
});


/**
 * Copy-assets
 * ---
 * Copies over the public assets folder
 */
gulp.task( 'copy-assets', function() {
    return gulp
        .src([
            './public/assets/**'
        ])
        .pipe( gulp.dest( copyStructure ) )
        .pipe( livereload({
            auto: false
        }));
});


/**
* Copy-assets
* ---
* Copies over the public assets folder
*/
gulp.task( 'copy-server', function() {
    // Copy over server files
    gulp.src([
            './lib*/**',
            './bin*/**',
            './package.json',
            './index.js'
        ])
        .pipe( gulp.dest( './dist' ) );

    // Copy over server dependencies, hardcode for now, should grab from package.json
    gulp.src([
            './node_modules/koa*/**',
            './node_modules/co*/**'
        ])
        .pipe( gulp.dest( path.join( build.target, './node_modules/' ) ) );
});


/**
 * Styles
 * ---
 *
 */
gulp.task( 'styles', function() {
    return gulp
        .src( './public/styles/main.less' )
        .pipe( sourcemaps.init() )
        .pipe( less() )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( path.join( build.target, 'public/styles/' ) ) )
        .pipe( livereload({
            auto: false
        }));
});


/**
* Scripts
*/
gulp.task( 'scripts', function() {

    // Build common include files to allow systemjs builder to work
    gulp.src( build.systemCommon )
        .pipe( uglify( 'common.js', {
            outSourceMap: true
        }))
        .pipe( gulp.dest( path.join( build.target, './public/scripts' ) ) );

    // Use systemjs builder to build the source
    gulp.src( './public/scripts/main.js' )
        .pipe( builder() );
        // .pipe( gulp.dest( path.join( build.target, './public/scripts' ) ) );

    // Copy over the sourcemaps for a dev build
    if ( args.d ) {
        gulp.src( './public/scripts/**/*.js' )
            .pipe( gulp.dest( path.join( build.target, 'public/public/scripts' ) ) ) ;
    }
});



/**
* Watch tasks
*/
gulp.task( 'watch', [ 'build' ], function() {

    livereload.listen({ auto: true });

    gulp.watch( './src/styles/**', [ 'styles' ]);
    gulp.watch( './src/scripts/**', [ 'scripts' ]);
    gulp.watch( [
        './src/index.hjs',
        './src/tmpl/**'
        ], [ 'tmpl' ] );
    gulp.watch( './src/assets/**', [ 'copy' ]);

    gutil.log( 'Watching...' );
});



/**
 * Build
 */
gulp.task( 'build', [ 'copy-server', 'html', 'copy-assets', 'styles', 'scripts' ] );

/**
 * Default task
 */
gulp.task( 'default', [ 'clean' ], function() {
    return gulp.start(
        'build',
        function() {
            gutil.log( 'Build done', gutil.colors.green( '✔︎' ) );
        }
    );
});
