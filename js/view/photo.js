// COUNTER ITEMVIEW
PhotoItemView = Backbone.Marionette.ItemView.extend({
	template: "#photo_template"
});


// COUNTER COLLECTIONVIEW
PhotoCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: PhotoItemView,
	tagName: "div",
	className: "photo_wrap"
});