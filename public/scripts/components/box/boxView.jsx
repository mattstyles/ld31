import React from 'vendor/react/react';

export default React.createClass({
    getInitialState: function() {
        return {
            content: 'Foo'
        }
    },
    render: function() {
        return (
            <h2 className="box vartest">{this.state.content}</h2>
        )
    }
})
