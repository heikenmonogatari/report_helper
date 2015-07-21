// INFO ITEMVIEW
var InfoItemView = Backbone.Marionette.ItemView.extend({
	template: "#info_template",

	modelEvents: {
		'change attribute': 'render'
	}
});
