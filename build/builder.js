var path = require( 'path' );
var fs = require( 'fs' );
var rimraf = require( 'rimraf' );
var through = require( 'through2' );
var builder = require( 'systemjs-builder' );
var build = require( './build.json' );
var args = require( 'minimist' )( process.argv.slice( 2 ) );

module.exports = function( opts ) {

    return through.obj( function( file, enc, cb ) {

        var moduleName = path.basename( file.path, '.js' );
        var dest = args.d ?
            path.join( opts.dest, path.basename( file.path ) ) :
            './tmp/build.js';

        // Punting out to a temporary file is very un-gulp but builder wont write to a buffer so its the only option
        builder.reset();
        builder.build( moduleName, dest, {
            config: {
                baseURL: path.dirname( file.path )
            },
            // minify: true,
            sourceMaps: !!args.d
        })
            .then( function() {
                file.contents = args.d ?
                    fs.readFileSync( dest ) :
                    fs.readFileSync( './tmp/build.js' );
                rimraf( './tmp', function( err ) {
                    cb( null, file );
                });
            })
            .catch( function( err ) {
                console.error( 'error::', err );
            });

    });
};
