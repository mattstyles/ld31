var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<h1>hello "
    + escapeExpression(((helper = (helper = helpers.foo || (depth0 != null ? depth0.foo : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"foo","hash":{},"data":data}) : helper)))
    + "</h1>\n";
},"useData":true});