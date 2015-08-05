MyApp.module('Main', function (Main, MyApp, Backbone, Marionette, $, _){
	Main.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"": "startFirstPage",
			"id/:id/date/:date/step/:step/period/:period/hour/:hour": "startSecondPageHour",
			"id/:id/date/:date/step/:step/period/:period": "refreshGraphs"
		}
	});

	// Controlleur de l'application. Gère le routeur et détermine l'ouverture de la première page ou de la deuxième
	Main.Controller = Marionette.Controller.extend({
		start: function() {
			console.log("MyApp Controller start...");

			Main.controller.router = new Main.Router({
				controller: Main.controller
			});

			Backbone.history.start();
		},

		// Commence le controlleur de la première page
		startFirstPage: function(id, date, step, period, hour) {
			MyApp.FirstPage.trigger('startFirst');
		},

		// Commence le controlleur de la deuxième page
		startSecondPageHour: function(id, date, step, period, hour) {
			var info = [id, date, step, period, hour];
			MyApp.SecondPage.trigger('startSecond', info);	
		},

		// Raffraichit les graphs de la deuxième page
		refreshGraphs: function(id, date, step, period) {
			var info = [id, date, step, period];
			MyApp.SecondPage.trigger('refreshGraphs', info);	
		}
	});

	MyApp.on('start', function() {
		Main.controller = new Main.Controller();

		Main.controller.start();
	});
});