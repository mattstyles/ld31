var fs      = require( 'fs' ),
    path    = require( 'path' ),

    hogan   = require( 'hogan.js' ),
    moment  = require( 'moment' );


/**
* Synchronous file fetch and template compile
*/
module.exports = function( filepath ) {
    return hogan
        .compile( fs.readFileSync( path.resolve( filepath ), { encoding: 'utf8' } ) )
        .render( {
            pkg: require( '../package.json' ),
            date: moment().format( 'MMM Do YYYY' )
        });
};
