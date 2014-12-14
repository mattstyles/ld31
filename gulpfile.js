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
    minifyCss   = require( 'gulp-minify-css' ),
    sourcemaps  = require( 'gulp-sourcemaps' ),
    handlebars  = require( 'gulp-handlebars' ),
    defineModule= require( 'gulp-define-module' ),
    react       = require( 'gulp-react' ),
    watch       = require( 'gulp-watch' ),
    order       = require( 'gulp-order' ),
    flatten     = require( 'gulp-flatten' ),
    plumber     = require( 'gulp-plumber' ),
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
 * Template
 * ---
 * Pre-compiles Handlebars templates ready to be consumed on the client.
 * Handlebars tasks just copies over the handlebars runtime necessary to compile and then render templates.
 */
gulp.task( 'handlebars', function() {
    return gulp
        .src( './public/vendor/handlebars/handlebars.js' )
        .pipe( gulp.dest( './public/scripts/' ) );
});

gulp.task( 'tmpl', [ 'handlebars' ], function() {
    return gulp
    .src( './public/**/*.hbs' )
    .pipe( handlebars() )
    .pipe( defineModule( 'node' ) )
    .pipe( gulp.dest( './public/scripts' ) );
});


/**
 * React
 * ---
 * Using react instead of static templating
 */
// gulp.task( 'copy-react', function() {
//     return gulp
//         .src( './public/vendor/react/react.js' )
//         .pipe( gulp.dest( './public/scripts/' ) );
// });
// gulp.task( 'react', [ 'copy-react' ], function() {
gulp.task( 'react', function() {
    return gulp
        .src( './public/**/*.jsx' )
        .pipe( react() )
        .pipe( flatten() )
        .pipe( gulp.dest( './public/views' ) );
});
gulp.task( 'strip-react', [ 'scripts' ], function() {
    return gulp
        .src( './public/views', {
            read: false
        })
        .pipe( plumber() )
        .pipe( rimraf() )
        .on( 'error', function( err ) {
            console.log( 'error stripping views folder' );
        });
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
        .pipe( alert( 'Assets copied' ) )
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
        .pipe( gulp.dest( './dist' ) )
        .pipe( alert( 'Server built' ) );

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
 * Using less
 */
gulp.task( 'styles', function() {
    return gulp
        .src( './public/styles/main.less' )
        .pipe( plumber() )
        .pipe( gulpif( args.d, sourcemaps.init() ) )
        .pipe( less() )
        .pipe( gulpif( args.d, sourcemaps.write() ) )
        .pipe( gulpif( !args.d, minifyCss() ) )
        .pipe( gulp.dest( path.join( build.target, 'public/styles/' ) ) )
        .pipe( alert( 'Styles built' ) )
        .pipe( livereload({
            auto: false
        }));
});


/**
 * Scripts
 * ---
 * ES6 transpilation. Also allows using common/amd/es6 modules as dependencies.
 */
gulp.task( 'scripts', [ 'react' ], function() {

    // Build common include files to allow systemjs builder to work
    gulp.src( build.systemCommon )
        .pipe( uglify( 'common.js', {
            mangle: !args.d,
            outSourceMap: !!args.d
        }))
        .pipe( gulp.dest( path.join( build.target, './public/scripts' ) ) );

    // Use systemjs builder to build the source
    return gulp.src( './public/scripts/main.js' )
        .pipe( plumber() )
        .pipe( builder({
            dest: path.join( build.target, './public/scripts' )
        }))
        .pipe( gulpif( !args.d, uglify() ) )
        .pipe( gulpif( !args.d, gulp.dest( path.join( build.target, './public/scripts' ) ) ) )
        .pipe( alert( 'Scripts built' ) )
        .pipe( livereload({
            auto: false
        }));

    // Copy over the source for the sourcemaps for a dev build
    // @TODO: should also copy over systemCommon files to be served also
    if ( args.d ) {
        gulp.src( './public/scripts/**/*.js' )
            .pipe( gulp.dest( path.join( build.target, 'public/public/scripts' ) ) ) ;
    }
});



/**
 * Watch tasks
 * ---
 * Because watch and livereload is the shit
 */
gulp.task( 'watch', [ 'build' ], function() {

    livereload.listen({ auto: true });

    gulp.watch( './public/styles/**/*', [ 'styles' ]);
    gulp.watch([
        './public/scripts/**/*.js',
        './public/scripts/**/*.jsx',
    ], [ 'strip-react' ]);
    // gulp.watch( './public/index.html', [ 'html' ]);
    gulp.watch( './public/assets/**/*', [ 'copy-assets' ]);
    gulp.watch( './lib/**/*', [ 'copy-server' ]);

    gutil.log( 'Watching...' );
});



/**
 * Build
 */
gulp.task( 'build', [ 'copy-server', 'html', 'copy-assets', 'styles', 'strip-react' ] );

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
