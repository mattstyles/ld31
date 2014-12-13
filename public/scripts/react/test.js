import React from '../react';
export default React.createClass({
    getInitialState: function() {
        return {
            content: 'Shazam'
        }
    },
    render: function() {
        return (
            React.createElement("h2", {className: "vartest"}, this.state.content)
        )
    }
})
;;