// DATA MODEL
InfoModel = Backbone.Model.extend({
	template: "#addInfo_template",

	initialize: function(attributes, options) {
		this.id = options.id;
	},

	url: "https://api.eco-counter-tools.com/v1/h7q239dd/counting_site/" + this.id
});