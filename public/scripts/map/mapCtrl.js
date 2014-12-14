import React from 'vendor/react/react.min';
import View from 'views/mapView';

export default class Map {

    constructor( el ) {
        this.el = el;

        React.render( React.createElement( View, null ), el );
    }

}
