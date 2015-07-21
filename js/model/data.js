// DATA MODEL
Data = Backbone.Model.extend({
	template: "#data_template"
});


// DATA COLLECTION
DataCollection = Backbone.Collection.extend({
	model: Data,

	fetch: function(options) {
        this.trigger('fetch', this, options);
        return Backbone.Collection.prototype.fetch.call(this, options);
    },

	getLimit: function(data, percentile) {
		var set = [];

		for (var i=0; i<data.length; i++) {
			if (data[i].comptage) {
				set.push(data[i].comptage);
			}
		}

		var sortedSet = set.sort(this.sortNumber);

		return sortedSet[Math.floor(set.length*percentile/100)];
	},

	sortNumber: function(a,b) {
	    return a - b;
	}
});