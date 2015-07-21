// COUNTER ITEMVIEW
CounterItemView = Backbone.Marionette.ItemView.extend({
	template: "#counterList_template",
	tagName: 'tr',
});


// COUNTER COLLECTIONVIEW
CounterCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: CounterItemView,
	tagName: 'table',
	id: 'counter_table',
	className: ' display stripe hover row-border order-column',

	events: {
		"change #check_all" : "checkAll"
	},

	checkAll: function() {
		if ($('#check_all').is(":checked")) {
			$('input[type=checkbox]').prop('checked', true);
		} else {
			$('input[type=checkbox]').prop('checked', false);
		}
	}
});