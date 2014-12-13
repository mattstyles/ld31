import React from '../react';

var Hello = React.createClass({displayName: 'Hello',
    render: function() {
        return React.createElement("h1", null, "Hello ", this.props.name);
    }
});
React.render(
    React.createElement(Hello, {name: "John"}),
    document.getElementById( 'main' )
)
;;