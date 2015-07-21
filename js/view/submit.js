// SUBMIT ITEMVIEW
SubmitItemView = Backbone.Marionette.ItemView.extend({
	template: "#submit_template",

	events: {
		"click #submit_button" : "clickEvent"
	},

	initialize: function(options) {
		this.myModel = options.myModel;
	},

	clickEvent: function() {

		var beginM = moment($("#date_begin").val());
		var endM = moment($("#date_end").val());

		var step = $('#step_selector').val();

		this.myModel.set({step: step});

		console.log(step);

		this.model.set({begin: beginM.format('YYYY-MM-DD'), end: endM.format('YYYY-MM-DD')});
		
		var checkedCounterList = new CounterList();
		
		this.collection.each(function(counter){
			var box = document.getElementById(counter.get('id') + '-' + counter.get('serial')).checked;
			if (box) {
				checkedCounterList.add(counter);
			}
		});

		console.log("Submitting list of checked counters...")

		MyApp.trigger("counterSubmit", checkedCounterList);
	}
});