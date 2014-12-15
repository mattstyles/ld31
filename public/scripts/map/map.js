import rawmap from './mapsvg';

export default class Map {

    constructor( el ) {
        this.el = el;
        this.map = null;
        this.refs = {};
        this.draw = SVG( this.el );
        this.def = this.draw.defs().svg( rawmap );

        this.render();
    }

    render() {
        this.map = this.draw.use( this.def.get( 'worldmap' ) );

        this.getRefs();

        window.raw = rawmap;
        window.map = this.map;
        window.def = this.def;
        window.refs = this.refs;
    }

    getRefs() {
        var ids = rawmap.match( /id="(.*?)"/ig ).map( function( match ) {
            return match.replace( /id="?"|"$/g, '' );
        });

        ids.forEach( function( id ) {
            this.refs[ id ] = this.def.get( id );
            this.initRef( id );
        }, this );
    }

    initRef( id ) {
        if ( !this.refs[ id ] ) {
            return;
        }

        this.refs[ id ].stroke( '#2bf' );
        this.refs[ id ].fill( 'none' );
    }

}
