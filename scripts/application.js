/**
	application.js
	
	Set up the application.
*/

var Application = {
	currentView: 'loading',
	fastLoad: true,

	// Set up the app
	init: function()
	{
		$(window).bind('hashchange', this.hashChange);
		
		TemperatureGraph.init();
		DiscoveryGraph.init();
		Table.init();
		Inspector.init();

		if (!this.fastLoad)
		{
			$('#loading-title').transition({opacity: 1}, 3000, 'in-out');
			var loadingDone = setTimeout(this.doneLoading, 3000);
		}
		else
			this.doneLoading();
	},

	// When the app is done loading, switch to main view
	doneLoading: function()
	{
		//Application.switchView('table');
		//Table.changeView('discovery');
	
		$('#loading').transition({opacity: 0}, 500, 'in-out');
		$('#table').transition({x: '0%', scale: 0}, 0)
			.transition({scale: 1}, 500);
		Application.currentView = 'table';
	},

	// When the user updated the #hash in the URL
	hashChange: function()
	{
		var hash = window.location.hash.substring(1);
		
		if (hash == '')
		{ // Main table
			Application.switchView('table');
		}

		if (hash >= 1 && hash <= 118)
		{ // An element number
			Application.switchView('inspector');
			Inspector.loadElement(parseInt(hash, 10));
		}
	},

	// Change the main application view
	switchView: function(newView)
	{
		if (newView == this.currentView)
			return;
		
		// Move the old view out of the way
		$('#' + this.currentView).removeClass('active').stop().transition({
			x: (newView == 'table')?'-100%':'100%'
		}, 500, 'in-out');
		
		// Move the new view in
		$('#' + newView).stop().transition({
			x: '0%'
		}, 500, 'in-out');
		
		this.currentView = newView;
	}

};

$(document).ready(function()
{
	Application.init();
});