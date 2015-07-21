// OPTIONS ITEMVIEW
var OptionsItemView = Backbone.Marionette.ItemView.extend({
	template: "#options_template",

	events: {
		"change #step_selector" : "stepSelected",
		"change #period_selector" : "periodSelected"
	},

	stepSelected: function() {
		console.log("Step changed...");
		this.model.set("step", $("#step_selector").val());

		var id = this.model.get('id');
		var date = this.model.get('date');
		var step = this.model.get('step');
		var period = this.model.get('period');

		Backbone.history.navigate('id/' + id 
								+ '/date/' + date 
								+ '/step/' + step 
								+ '/period/' + period, {trigger: true});
	},

	periodSelected: function() {
		console.log("Period changed...");

		this.model.set("period", $("#period_selector").val());

		var id = this.model.get('id');
		var date = this.model.get('date');
		var step = this.model.get('step');
		var period = this.model.get('period');

		Backbone.history.navigate('id/' + id 
								+ '/date/' + date 
								+ '/step/' + step 
								+ '/period/' + period, {trigger: true});
	}
});
