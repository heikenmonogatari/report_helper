// TABLE ITEMVIEW

// custom close function that will close and unbind views. Prevents old events to still be bound
Backbone.View.prototype.close = function() {
    if (this.onClose) {
        this.onClose();
    }
  	this.remove();
    this.unbind();
};


var TableItemViewTest = Backbone.Marionette.ItemView.extend({
	template: "#hour_template",

	events: {
		"mouseover" : "mouseOver",
		"mouseout" : "mouseOut",
		"click" : "newPage"
 	},

	initialize: function(options) {

		_.bindAll(this, 'editLocalStatus');
		Backbone.globalEvent.on('fakeRefreshStatus', this.editLocalStatus);

		this.limit = options.limit;
		this.name = options.name;
		this.idNum = options.idNum;
		this.serial = options.serial;
		this.myModel = options.myModel;

		this.myModel.on('change:percentileFactor', this.refreshColors, this);

		this.count = this.model.get('comptage');
		this.interval = this.limit / 15;

		this.refreshColors();
		this.refreshStatus();

		this.$el.attr('idNum', this.idNum);
		this.$el.attr('date', moment(this.model.get('date')).format('YYYY-MM-DD'));
	},

	// Change the status color for each cell. Called fake because this data is not taken from the server, but assumed from the user input.
	editLocalStatus: function(options) {

		var id = options[0];
		if (id == this.idNum) {

			var begin = moment(options[1]);
			var end = moment(options[2]);
			var activate = options[3];

			if (moment(this.model.get('date')) <= end && moment(this.model.get('date')) >= begin) {
				if (activate == 0) {
					this.model.set({'status': 0});
				}else{
					this.model.set({'status': 8});
				}
				this.refreshStatus();
			}
		}
	},

	// if this.myModel.percentileFactor has been changed, refresh color/shade of grey
	refreshColors: function() {

		var factor = $('#percentile-factor').val();
		if (!factor) {
			factor = 5;
		}

		var count = this.count;
		var interval = this.interval;
		var limit = this.limit;

		if (count === null) {
			this.category = "c18";
		}else if (count == 0) {
			this.category = "c19";
		}else if (count <= limit) {
			var colorFactor = Math.floor(count / interval)+1;
			this.category = "c" + colorFactor;
		}else if (count <= factor * limit) {
			this.category = "c16";
		}else{
			this.category = "c17";
		}

		this.$el.attr('class', "datum " + this.category);
	},

	refreshStatus: function() {
		var status = this.model.get('status');

		if (status == 0) {
			this.$el.css({'border-right-color': 'red'});
		}else if(status == 8) {
			this.$el.css({'border-right-color': 'green'});
		}
	},

	attributes: function() {
		return {
			day: moment(this.model.get('date')).format('dddd'),
			hour: moment(this.model.get('date')).format('HH:mm'),
			count: this.model.get('comptage')
		}
	},

	mouseOver: function(e) {
		if (e.ctrlKey) {
			$(e.target).addClass('selected');
		}

		var status = this.model.get('status');

		if (status == 0) {
			var statusText = "Not valid/Unknown";
		}else if (status == 8) {
			var statusText = "Valid"
		}


  		$('#popup').html("<div class='name'>Name: </div><div class='value'>" + this.name + 
  			"</div><div class='name'>Id: </div><div class='value'>" + this.idNum + 
  			"</div><div class='name'>Serial: </div><div class='value'>" + this.serial +
  			"</div><div class='name'> Date: </div><div class='value'>" + moment(this.model.get('date')).format('YYYY-MM-DD') + 
  			"</div><div class='name'>Day: </div><div class='value'>" + moment(this.model.get('date')).format('dddd') +
  			"</div><div class='name'>Hour: </div><div class='value'>" + moment(this.model.get('date')).format('HH:mm') + 
  			"</div><div class='name'>Count: </div><div class='value'>" + this.model.get('comptage') + 
  			"</div><div class='name'>Status: </div><div class='value'>" + statusText + "</div></div>");

  		var x = e.pageX,
			y = e.pageY;

		$(e.target).addClass("highlighted");

		$("#popup").css('top', (y) + 'px');
		$("#popup").css('left', (x+20) + 'px');

		if (document.documentElement.offsetHeight - y < 120) {
			$("#popup").css('top', (y-200) + 'px');
		}

		if (document.documentElement.offsetWidth - x < 250) {
			$("#popup").css('left', (x-275) + 'px');	
		}

		$('#popup').show();
  	},

  	mouseOut: function(e) {
  		$('#popup').hide();
  		$(e.target).removeClass("highlighted");
  	},

  	// Color cell has been clicked. Open new page
  	newPage: function(e) {

		var id = this.idNum;
		var date = moment(this.model.get('date')).format('YYYY-MM-DD');
		var step = 3;
		var period = 5;
		var hour = moment(this.model.get('date')).format('HH:mm');

		var url = '#/id/' + id 
			+ '/date/' + date
			+ '/step/' + step
			+ '/period/' + period
			+ '/hour/' + hour;

		window.open(url, '_blank');
	}
});

var TableCompositeViewTest = Backbone.Marionette.CompositeView.extend({

	template: "#column_template",

	childView: TableItemViewTest,

	events: {
		"click .hideMe" : "hideCounter",
		"dblclick .vertical-text2" : "doubleWidth"
	},

	attributes: function() {
		return {
			class: "counter data",
			name: this.model.get('name'),
			idNum: this.model.get('id'),
			serial: this.model.get('serial')
		}
	},

	initialize: function(options) {
		this.parent = options.parent;

		this.myModel = this.model.get('myModel');

		this.myModel.on('change:percentile', this.refresh, this);
		this.listenTo(this.parent, 'removeChild', this.close);

		this.collection = this.model.get('data');

		var percentile = this.myModel.get('percentile');

		this.updateCollection(percentile);
	},

	refresh: function() {
		var percentile = this.myModel.get('percentile');

		this.updateCollection(percentile);
		this.render();
	},

	updateCollection: function(percentile) {
		this.limit = this.collection.getLimit(this.collection.toJSON(), percentile);

		if (this.collection.length == 0) {
			var end = moment(this.myModel.get('end')).endOf('day');
			var begin = moment(this.myModel.get('begin'));
			var step = this.myModel.get('step');

			if (step == 3) {
				var diff = end.diff(begin, 'hours') + 1;
			}else if (step == 4) {
				var diff = end.diff(begin, 'days') + 1;
			}

			var collection = [];
			var currentDate = begin.format('YYYY-MM-DD HH:mm');
			for (var i=0; i<diff; i++) {
				collection.push({date: currentDate, comptage: null})

				if (step == 3) {
					currentDate = moment(currentDate).add(1, 'hour');
				}else if (step == 4) {
					currentDate = moment(currentDate).add(1, 'day');
				}
			}

			this.collection = new DataCollection(collection);
		}

		console.log("Printing data for: " + this.model.get('name'));
	},

	onClose: function(){
		console.log("closing");
		this.myModel.unbind("change:percentile", this.refresh, this);
  	},

  	hideCounter: function() {
		console.log(this.model.get('name') + " is hidden...");
		this.myModel.get('hidden').push(this.model.get('id'));
		$('.counter[idnum='+this.model.get('id')+']').hide();
	},

	doubleWidth: function(e) {
		if ($($(e.target).parent()).width() == "32") {
			$($(e.target).parent()).css('width', "64px");
			$($(e.target).parent().children()).css('width', "64px");
		}else{
			$($(e.target).parent()).css('width', "32px");
			$($(e.target).parent().children()).css('width', "32px");
		}
	},

	childViewOptions: function() {
		return {
			limit: this.limit,
			name: this.model.get('name'),
			idNum: this.model.get('id'),
			serial: this.model.get('serial'),
			myModel: this.myModel
		}
	}
});

var TableCollectionViewTest = Backbone.Marionette.CollectionView.extend({
	className: "color-table",

	initialize: function() {
		_.bindAll(this, 'scroll');
		$(window).scroll(this.scroll);
	},

	scroll: function() {
		var fixedHeader = $('.vertical-text2, .border'),
			scroll = $(window).scrollTop();
		if (scroll >= 650) {
			fixedHeader.addClass('fixed');
		}else{
			fixedHeader.removeClass('fixed');
		}
	},

	onShow: function() {
		$('.color-table').sortable({
			revert: true,
			axis: 'x',
			placeholder: "sortable-placeholder",
			forcePlaceHolderSize: true,
			helper: 'clone'
		});
		$( "#color-table" ).disableSelection();
	},

	onClose: function() {
		this.trigger('removeChild');
	},

	childView: TableCompositeViewTest,

	childViewOptions: function() {
		return {
			parent: this
		}
	}
});



