// TABLE ITEMVIEW
var ParameterItemView = Backbone.Marionette.ItemView.extend({
	template: "#parameter_template",

	events: {
		"change #percentile-factor" : "submitPercentileFactor",
		"change #percentile-value" : "submitPercentileValue",
		"click #alphaSort_button" : "sortCountersAlpha",
		"click #worstSort_button" : "sortCountersWorst"
	},

	initialize: function(options) {
		this.myModel = options.myModel;
	},

	submitPercentileFactor: function() {
		//Backbone.globalEvent.trigger('factorChange', $('#percentile-factor').val());
		this.myModel.set({percentileFactor: $('#percentile-factor').val()});
	},

	submitPercentileValue: function() {
		this.myModel.set({percentile: $('#percentile-value').val()});
	},

	sortCountersAlpha: function() {

		var list =  $(".color-table").children('.counter');

		function alphanum(a, b) {
		  	function chunkify(t) {
		    	var tz = new Array();
		    	var x = 0, y = -1, n = 0, i, j;

		    	while (i = (j = t.charAt(x++)).charCodeAt(0)) {
			      	var m = (i == 46 || (i >=48 && i <= 57));
			      	if (m !== n) {
				        tz[++y] = "";
			        	n = m;
			      	}
			      	tz[y] += j;
		    	}
		    	return tz;
		  	}

		  	var aa = chunkify(a.getAttribute('name'));
		  	var bb = chunkify(b.getAttribute('name'));
	
		  	for (x = 0; aa[x] && bb[x]; x++) {
		    	if (aa[x] !== bb[x]) {
		      		var c = Number(aa[x]), d = Number(bb[x]);
		      		if (c == aa[x] && d == bb[x]) {
			        	return c - d;
		      		} else return (aa[x] > bb[x]) ? 1 : -1;
		    	}
		  	}
		  		return aa.length - bb.length;
		}

		list.sort(alphanum).appendTo('.color-table');
	},

	sortCountersWorst: function() {

		var list =  $(".color-table").children('.counter');

		function sortWorst(a, b) {

			var aRedCount = $('.c17', $(a)).length;

			var bRedCount = $('.c17', $(b)).length;

			var aBlueCount = $('.c18', $(a)).length;

			var bBlueCount = $('.c18', $(b)).length;

			if (aRedCount && bRedCount) {
				return bRedCount - aRedCount;
			}else if (aRedCount && !(bRedCount)) {
				return -1;
			}else if (bRedCount && !(aRedCount)) {
				return 1;
			}else{
				return aBlueCount - bBlueCount;
			}
		}

		list.sort(sortWorst).appendTo('.color-table');

		console.log("List of Red Counts: "); 
		list.each(
		  function() {
		    console.log($(this).attr('name') + " " + $('.c17', $(this)).length);
		  }
		);
	}
});
