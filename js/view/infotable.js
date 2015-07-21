// INFOTABLE ITEMVIEW
var InfoTableItemView = Backbone.Marionette.ItemView.extend({
	template: "#infoTable_template",

	modelEvents: {
		'change attribute': 'render'
	},
});
