MyApp.module('FirstPage', function (FirstPage, MyApp, Backbone, Marionette, $, _){

	Backbone.globalEvent = _.extend({}, Backbone.Events);

	FirstPage.Controller = Marionette.Controller.extend({
		start: function() {
			console.log("FirstPage Controller start...");

			FirstPage.root = new MyApp.Layout.Root();
			/*FirstPage.main = new MyApp.Layout.Main();*/

			this.domains = new DomainList();

			this.domains.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/counting_site/";

			var self = this;

			this.domains.fetch({
				success: function() {
					console.log("Domain list fetch complete...")
					self.showSearchButton();
				}
			})
		},

		showSearchButton: function() {
			this.search = new SearchView({collection: this.domains});
			FirstPage.root.showChildView('search', this.search);
		},

		showFilteredList: function(domainList) {
			if (this.infoView) this.infoView.remove();
			if (this.legendView) this.legendView.remove();
			if (this.navigationTable) this.navigationTable.remove();
			if (this.counterCollectionView) this.counterCollectionView.remove();
			if (this.dateView) this.dateView.remove();
			if (this.submitItemView) this.submitItemView.remove();
			if (this.parameter) this.parameter.remove();
			if (this.parameterButtons) this.parameterButtons.remove();
			if (this.searchCollectionView) this.searchCollectionView.remove();
			if (this.headerCollectionView) this.headerCollectionView.remove();
			if (this.tableCollectionViewTest) this.tableCollectionViewTest.close();
			$('#counters').empty();
			$('#general_info').empty();

			this.searchCollectionView = new SearchCollectionView({collection : domainList});
        	FirstPage.root.showChildView('main', this.searchCollectionView);
		},

		showCounterList: function(counters) {

			console.log("Show counters list...");

			this.searchCollectionView.remove();

			var counterList = new CounterList(counters);

			this.counterCollectionView = new CounterCollectionView({collection: counterList});
			FirstPage.root.showChildView('counters', this.counterCollectionView);

			var template = _.template( $("#header_template").html() );
			$("#counter_table").prepend(template());
			$("#counter_table").DataTable({
				paging: false,
				"autoWidth": false,
				bFilter: false,
				bInfo: false
			});
		},

		showSubmitButton: function(counters, model) {

			//$('#main').append("<div id='submit'></div>");

			var counterList = new CounterList(counters);
			this.submitItemView = new SubmitItemView({collection: counterList, model: model, myModel: this.model});
			FirstPage.root.showChildView('submit', this.submitItemView);
		},

		showInfo: function(model) {

			this.model = model;
			this.model.set({begin: "", end: ""});
			this.model.set({date: moment()});
			this.model.set({period: 0});
			this.model.set({step: 3});
			this.model.set({percentileFactor: 5});
			this.model.set({sdFactor: 1.75});
			this.model.set({percentile: 95});
			this.model.set({hidden: []});
			this.model.set({begin: moment().subtract(1, 'M').format('YYYY-MM-DD')});
			this.model.set({end: moment().subtract(1, 'd').format('YYYY-MM-DD')})
			this.infoView = new InfoTableItemView({model: this.model});
			FirstPage.root.showChildView('info', this.infoView);
		},

		showDateInput: function() {
			this.dateView = new DateView({model: this.model});
			FirstPage.root.showChildView('date', this.dateView);
		},

		/*createData: function(counters) {

			if (this.dateCollectionView) this.dateCollectionView.remove();
			if (this.submitItemView) this.submitItemView.remove();

			var ids = [];
			counters.forEach(function(counter) {
				ids.push(counter.get('id'));
			});

			var self = this;
			var index = 0;

			this.createDataHelper(ids, counters, index, self);
		},

		createDataHelper: function(ids, counters, index, self) {
			var id = ids.shift();

			if (id) {
				var dataCollection = new DataCollection();
				dataCollection.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/data/periode/" 
							+ id
							+ '?begin=' + moment(self.model.get('begin')).format('YYYYMMDD')
							+ '&end=' + moment(self.model.get('end')).format('YYYYMMDD')
							+ '&step=' + 3;

				dataCollection.fetch({
					success: function() {
						counters.at(index).set({data: dataCollection});
						counters.at(index).set({myModel: self.model});
						self.createDataHelper(ids, counters, index+1, self);
					}
				});
			}else{
				self.showTable(counters);
				self.showSDButton(counters);
			}
		},*/

		showButtons: function(counters) {
			this.parameterButtons = new ButtonsView({collection: counters, myModel: this.model});
			FirstPage.root.showChildView('buttons', this.parameterButtons);
		},

		createData: function(counters) {
			var self = this;
			var nbCounters = counters.length;
			var index = 0;

			for (var i=0; i<nbCounters; i++) {

				var id = counters.at(i).get('id');
				console.log("Fetching data of: " + counters.at(i).get('name'));

				var dataCollection = new DataCollection();
				dataCollection.url = "https://api.eco-counter-tools.com/v1/" + MyApp.apiKey + "/data/periode/" 
							+ id
							+ '?begin=' + moment(self.model.get('begin')).format('YYYYMMDD')
							+ '&end=' + moment(self.model.get('end')).format('YYYYMMDD')
							+ '&step=' + self.model.get('step');

				dataCollection.fetch({
					success: function(datum) {

						var splitURL = datum.url.split("/");
						var splitURL = splitURL[7].split("?");

						var counter = counters.find(function(counter) {
							return counter.get('id') == splitURL[0];
						});

						counter.set({data: new DataCollection(datum.models)});
						counter.set({myModel: self.model});

						if (index+1 == nbCounters) {
							self.showTable(counters);
							self.showButtons(counters);
						}
						index += 1;
					}
				});
			};	
		},

		showTable: function(counters) {

			if (this.dateView) this.dateView.remove();
			if (this.submitItemView) this.submitItemView.remove();
			if (this.tableCollectionViewTest) this.tableCollectionViewTest.close();

			/*this.parameter = new ParameterItemView({myModel: this.model});
			FirstPage.root.showChildView('parameter', this.parameter);*/

			this.tableCollectionViewTest = new TableCollectionViewTest({collection: counters, myModel: this.model});
			FirstPage.root.counters.show(this.tableCollectionViewTest);

			this.navigationTable = new NavigationTableItemView({model: this.model, collection: counters});
			FirstPage.root.showChildView('navigation', this.navigationTable);

			this.legendView = new LegendItemView({model: this.model});
			FirstPage.root.showChildView('legend', this.legendView);
		}

	});

	FirstPage.on('startFirst', function() {
		FirstPage.controller = new FirstPage.Controller();	
		FirstPage.controller.start();
	});

	MyApp.on('search', function(options){
		FirstPage.controller.showFilteredList(options);
	});

	MyApp.on('counterChosen', function(options){
		FirstPage.controller.showCounterList(options.get('counters'));
		FirstPage.controller.showInfo(options);
		FirstPage.controller.showDateInput();
		FirstPage.controller.showSubmitButton(options.get('counters'), options);
	});

	MyApp.on('counterSubmit', function(options){
    	FirstPage.controller.createData(options);
    	//FirstPage.controller.showSDButton(options);
    });

    MyApp.on('refreshTable', function(options){
    	FirstPage.controller.createData(options);
    });
});