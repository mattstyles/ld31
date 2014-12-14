export default React.createClass({
    getInitialState: function() {
        return {
            content: 'Shazam'
        }
    },
    render: function() {
        return (
            <h2 className="box vartest">{this.state.content}</h2>
        )
    }
})
