// DATE VIEW
var DateView = Backbone.Marionette.ItemView.extend({
    template: "#date_template",

    onShow: function() {
    	$('.input-group.date').datepicker({
		    format: "yyyy-mm-dd"
		});
    }
});