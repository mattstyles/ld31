
var Hello = React.createClass({
    render: function() {
        return <h1>Hello {this.props.name}</h1>;
    }
});
React.render(
    <Hello name="John"/>,
    document.getElementById( 'main' )
)
