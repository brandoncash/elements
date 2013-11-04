/**
	app-menu.js
	
	The application menu.
*/

var AppMenu = {
	// Set up the application menu
	init: function()
	{
		// Pressing the close button
		$('#close-app-menu').fastClick(function() {
			Application.changeView('table');
		});
	},

};
