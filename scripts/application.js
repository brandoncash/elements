var Application = (function ($)
{
	var app = {};

	app.currentView = 'none';

	app.init = function()
	{
		$(window).bind('hashchange', function()
		{ // Updated the #hash in the URL
			var hash = window.location.hash.substring(1);
			
			if (hash == '')
			{ // Main screen
				Application.switchView('table');
			}

			if (hash >= 1 && hash <= 118)
			{ // An element number
				Inspector.loadElement(parseInt(hash, 10));
				Application.switchView('inspector');
				BohrModel.load(periodicElements[parseInt(hash, 10)]);
			}
		});
		
		PeriodicTable.init();
		Inspector.init();
		
		app.switchView('table');
	};

	app.switchView = function(newView)
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
		}, 500, 'in-out', function()
		{ // When it is fully in view
			$(this).addClass('active');
		});
		
		this.currentView = newView;
	};

	return app;
}(jQuery));

$(document).ready(function()
{
	Application.init();
});