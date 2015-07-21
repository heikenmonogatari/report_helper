// DATE MODEL
var DateModel = Backbone.Model.extend({
	defaults: {
		"type": "none"
	}
});

var DateCollection = Backbone.Collection.extend({
    model: DateModel
});