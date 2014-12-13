var path = require( 'path' );
var fs = require( 'fs' );
var rimraf = require( 'rimraf' );
var through = require( 'through2' );
var builder = require( 'systemjs-builder' );
var build = require( './build.json' );
var args = require( 'minimist' )( process.argv.slice( 2 ) );

module.exports = function( opts ) {

    return through.obj( function( file, enc, cb ) {

        // Punting out to a temporary file is very un-gulp but builder wont write to a buffer so its the only option
        builder.build( path.basename( file.path, '.js' ), path.join( build.target, 'public/scripts/main.js' ), {
            config: {
                baseURL: path.dirname( file.path )
            },
            minify: !args.d,
            sourceMaps: !args.d
        })
            .then( function() {
                cb( null, file );
            })
            .catch( function( err ) {
                console.error( 'error::', err );
            });

    });
};
