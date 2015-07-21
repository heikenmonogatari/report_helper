// TABLE ITEMVIEW
var TableItemView = Backbone.Marionette.ItemView.extend({
	template: "#row_template",

	initialize: function(options) {
		this.myModel = options.myModel;
		this.collection = options.collection;
		this.listenTo(this.myModel, "change:begin", this.refresh);
	},

	events: {
		"mouseover .popbox" : "mouseOver",
		"mouseout .popbox" : "mouseOut",
		"click .popbox" : "newPage",
 	},

	attributes: function () {
	    return {
	      id : this.model.get( 'id' ),
	      class : "column data",
	      column : this.model.get( 'id' )
	    };
  	},

  	onShow: function() {
  		this.id = this.model.get("id");
		this.serial = this.model.get("serial");
		this.name = this.model.get("name");

  		$("<div class='vertical-text column' column='" + this.id + "'>" + this.name + "</div>").insertBefore("#" + this.id);

		$(".column[column ="+this.id+"]").wrapAll( "<div class='vertical' />");
		this.refresh(); 
  	},

  	refresh: function() {
  		$("#" + this.id).empty();

  		var self = this;

		var beginM = moment(this.myModel.get('begin'));
		var endM = moment(this.myModel.get('end'));

		var nbHours = endM.diff(beginM, 'hours') + 24;

		begin = beginM.format('YYYYMMDD');
		end = endM.format('YYYYMMDD');

  		var dataCollection = new DataCollection();

  		dataCollection.url = 'https://api.eco-counter-tools.com/v1/h7q239dd/data/periode/' 
    							+ this.id
    							+ '?begin=' + begin
    							+ '&end=' + end
    							+ '&step=' + 3;

    	dataCollection.fetch({
    		success: function() {

    			self.model.set({data: dataCollection});

    			console.log("Printing data of id " + self.id + "...");

    			var location = $('#'+ self.id);

    			var dataTemplate = _.template( $("#data_template ").html() );

    			if (dataCollection.length > 0) {

	    			var dataCollectionJSON = dataCollection.toJSON();
	    			var limit = dataCollection.getLimit(dataCollectionJSON);
	    			var interval = limit / 15;

	    			var index = 0;

	    			dataCollection.each(function(data) {

	    				data.set({day_hour: moment(data.get('date')).format('dddd_HH')});

	    				var date = data.get("date");

	    				data.set('date', moment(date).format('YYYY-MM-DD HH:mm'));

	    				var day = moment(date);
	    				var calendarDate = moment(date);
	    				var hour = moment(date);

	    				if (hour.format('HH:mm') == "00:00") {
	    					location.append("<div class='day' id=" + day.format('dddd') + "></div>");
	    				}

	    				if (data.get('comptage') === null) {
	    					var category = "c1";
	    				}else if (data.get('comptage') == 0) {
	    					var category = "c2";
	    				}else if (data.get('comptage') > 0 && data.get('comptage') <= interval) {
	    					var category = "c3";
	    				}else if (data.get('comptage') > interval && data.get('comptage') <= interval * 2) {
	    					var category = "c4";
	    				}else if (data.get('comptage') > interval * 2 && data.get('comptage') <= interval * 3) {
	    					var category = "c5";
	    				}else if (data.get('comptage') > interval * 3 && data.get('comptage') <= interval * 4) {
	    					var category = "c6";
	    				}else if (data.get('comptage') > interval * 4 && data.get('comptage') <= interval * 5) {
	    					var category = "c7";
	    				}else if (data.get('comptage') > interval * 5 && data.get('comptage') <= interval * 6) {
	    					var category = "c8";
	    				}else if (data.get('comptage') > interval * 6 && data.get('comptage') <= interval * 7) {
	    					var category = "c9";
	    				}else if (data.get('comptage') > interval * 7 && data.get('comptage') <= interval * 8) {
	    					var category = "c10";
	    				}else if (data.get('comptage') > interval * 8 && data.get('comptage') <= interval * 9) {
	    					var category = "c11";
	    				}else if (data.get('comptage') > interval * 9 && data.get('comptage') <= interval * 10) {
	    					var category = "c12";
	    				}else if (data.get('comptage') > interval * 10 && data.get('comptage') <= interval * 11) {
	    					var category = "c13";
	    				}else if (data.get('comptage') > interval * 11 && data.get('comptage') <= interval * 12) {
	    					var category = "c14";
						}else if (data.get('comptage') > interval * 12 && data.get('comptage') <= interval * 13) {
	    					var category = "c15";
	    				}else if (data.get('comptage') > interval * 13 && data.get('comptage') <= interval * 14) {
	    					var category = "c16";
	    				}else if (data.get('comptage') > interval * 14 && data.get('comptage') <= interval * 15) {
	    					var category = "c17";
    					}else if (data.get('comptage') > interval * 15 && data.get('comptage') <= 5 * limit) {
    						var category = "c18";
	    				}else if (data.get('comptage') > 5 * limit) {
	    					var category = "c19";
	    				}

	    				var className = "hour_" + index % 24;

	    				var tempModel = _.extend(data.toJSON(), {percentile: category}, {id: self.id}, {serial: self.serial},
	    				 {name: self.name}, {day: calendarDate.format('dddd')}, {hour: hour.format('HH:mm')}, 
	    				 {date: calendarDate.format('YYYY-MM-DD')}, {index: index}, {className: className});

	    				location.children().last().append(dataTemplate(tempModel));

						index += 1;
	    			});
				}else{					

					var currentDate = beginM;
					var addedHour = beginM;

					for (var i=0; i<nbHours; i++) {
						var className = "hour_" + i % 24;

						var date = addedHour.format('YYYY-MM-DD HH:mm');
						var day = addedHour.format('dddd');

						var calendarDate = moment(date).format('YYYY-MM-DD');
						var hour = moment(date).format('HH:mm');

						var tempModel = _.extend({percentile: "c1"}, {id: self.id}, {serial: self.serial}, {name: self.name}, 
							{comptage: " "}, {date: calendarDate}, {day: day}, {hour: hour}, {index: i}, {className: className});
						location.append(dataTemplate(tempModel));

						addedHour = addedHour.add(1, 'hours');
					}
				}
    		}
    	});
  	},

  	mouseOver: function(e) {
  		$('#popup').html("<div class='label'>Name: </div><div class='value'>" + e.target.getAttribute("name")+ 
  			"</div><div class='label'>Id: </div><div class='value'>" + e.target.getAttribute("idNum") + 
  			"</div><div class='label'>Serial: </div><div class='value'>" + e.target.getAttribute("serial") +
  			"</div><div class='label'> Date: </div><div class='value'>" + e.target.getAttribute("date") + 
  			"</div><div class='label'>Day: </div><div class='value'>" + e.target.getAttribute("day") +
  			"</div><div class='label'>Hour: </div><div class='value'>" + e.target.getAttribute("hour") + 
  			"</div><div class='label'>Count: </div><div class='value'>" + e.target.getAttribute("count") + "</div></div>");

  		var x = e.pageX,
			y = e.pageY;

		$(e.target).parent().addClass("highlighted");

		$("#popup").css('top', (y) + 'px');
		$("#popup").css('left', (x+20) + 'px');

		if (document.documentElement.offsetHeight - y < 120) {
			$("#popup").css('top', (y-200) + 'px');
		}

		if (document.documentElement.offsetWidth - x < 250) {
			$("#popup").css('left', (x-250) + 'px');	
		}

		$('#popup').show();
  	},

  	mouseOut: function(e) {
  		$('#popup').hide();
  		$(e.target).parent().removeClass("highlighted");
  	},

  	newPage: function(e) {

		var id = e.target.getAttribute("idNum");
		var date = e.target.getAttribute("date");
		var step = 3;
		var period = 5;
		var hour = encodeURIComponent(e.target.getAttribute("hour"));

		var url = '#/id/' + id 
			+ '/date/' + date
			+ '/step/' + step
			+ '/period/' + period
			+ '/hour/' + hour;

		window.open(url, '_blank');
	}
});

// TABLE COLLECTIONVIEW
var TableCollectionView = Backbone.Marionette.CollectionView.extend({
	childView: TableItemView,
	tagName: "div",
	className: "color",

	initialize: function(options) {
		$('#general_info').append("<div id='popup' class='popbox'></div>");
		this.myModel = options.myModel;

		_.bindAll(this, 'scroll');
		$(window).scroll(this.scroll);

		/*Backbone.globalEvent.on('unbindBar', this.unbindScroll);*/
	},

	scroll: function() {
		var fixedHeader = $('.vertical-text, .border'),
			scroll = $(window).scrollTop();
		if (scroll >= 250) {
			fixedHeader.addClass('fixed');
		}else{
			fixedHeader.removeClass('fixed');
		}
	},

	remove: function() {
		$(window).off(this.detect_scroll);
		Backbone.Marionette.CollectionView.prototype.remove.apply(this, arguments);
	},

	unbindScroll: function() {
		$(window).off(this.detect_scroll);
	},

	childViewOptions: function() {
		myModel = this.myModel;
		collection = this.collection;
		return {
			myModel: myModel,
			collection: collection
		}
	}
});