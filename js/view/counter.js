// COUNTER ITEMVIEW
CounterItemView = Backbone.Marionette.ItemView.extend({
	template: "#counterList_template",
	tagName: 'tr',
	className: 'tableRow',

	events: {
		"click .checkMe" : "checkMe"
	},

	checkMe: function(e) {
		if (!e.shiftKey) {
			if ($(e.target).children(":first").is(':checked')) {
				$(e.target).children(":first").prop('checked', false);
			}else{
				$(e.target).children(":first").prop('checked', true);
			}
		}
	}
});


// COUNTER COLLECTIONVIEW
CounterCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: CounterItemView,
	tagName: 'table',
	id: 'counter_table',
	className: ' display stripe hover row-border order-column',

	events: {
		"change #check_all" : "checkAll",
		"click .checkMe" : "shiftCheckMe",
	},

	checkAll: function() {
		if ($('#check_all').is(":checked")) {
			$('input[type=checkbox]').prop('checked', true);
		} else {
			$('input[type=checkbox]').prop('checked', false);
		}
	},

	// Shift + clickling a checkbox will toggle every checkbox ABOVE until one is different from the clicked one
	shiftCheckMe: function(e) {
		if (e.shiftKey) {
			var parent = $(e.target).parent();

			if ($(e.target).children(":first").is(':checked')) {

				$(e.target).children(":first").prop('checked', false);

				parent = $(parent).prev();

				var box = $(parent).children().last().children();
				
				while ((parent.attr('class') == 'tableRow even' || parent.attr('class') == 'tableRow odd') &&
				 box.is(':checked')) {
					
					box.prop('checked', false);

					parent = parent.prev();
					box = $(parent).children().last().children();
				}
			}else{
				$(e.target).children(":first").prop('checked', true);

				parent = $(parent).prev();

				var box = $(parent).children().last().children();
				
				while ((parent.attr('class') == 'tableRow even' || parent.attr('class') == 'tableRow odd') &&
				 !box.is(':checked')) {
					
					box.prop('checked', true);

					parent = parent.prev();
					box = $(parent).children().last().children();
				}
			}

		}
	}
});