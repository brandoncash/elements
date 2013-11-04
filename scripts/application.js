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
		this.initDropdowns();
		this.initMenus();

		AppMenu.init();
		TemperatureGraph.init();
		DiscoveryGraph.init();
		AtomicRadiiGraph.init();
		Table.init();
		Inspector.init();

		if (!this.fastLoad)
		{
			$('#loading-title').animate({opacity: 1}, 3000, 'in-out');
			var loadingDone = setTimeout(this.doneLoading, 3000);
		}
		else
			this.doneLoading();
	},

	// When the app is done loading, switch to main view
	doneLoading: function()
	{
		$('#loading').animate({opacity: 0}, 500);
		$('#table').addClass('active');
		Application.currentView = 'table';
	},

	// Set up drowndown menus
	initDropdowns: function()
	{
		// Clicking on a dropdown
		$('.dropdown > div').fastClick(function(e)
		{
			var menu = $(this).parent();
			if (menu.hasClass('open'))
			{
				menu.removeClass('open'); // Close the menu
				menu.height('1.7em');
				$('.dropdown-modal-block').removeClass('active');
				$(this).prependTo(menu);
			}
			else
			{
				menu.addClass('open');
				menu.height((menu.children().length * 1.7) + 'em');
				$('.dropdown-modal-block').addClass('active');
				e.preventDefault();
			}
			e.stopPropagation();
		});
		// If you click outside of the dropdown, close it
		var dropdownModalBlock = $('<div class="dropdown-modal-block">');
		dropdownModalBlock.fastClick(function(e) {
			$('.dropdown').removeClass('open');
			$('.dropdown-modal-block').removeClass('active');
			$('.dropdown').height('1.7em');
		});
		dropdownModalBlock.prependTo($('#table'));
		dropdownModalBlock.clone(true).prependTo('#abundance');
	},

	// Set up menus
	initMenus: function()
	{
		// FIXME: why am I having to do this ridiculous loop?
		//	 - $('section.menu .page:first-child').addclass('active') doesn't seem to work
		$('section.menu').each(function()
		{
			$(this).children('.page').first().addClass('active');
		});

		$('#inspect-view').bind('mousewheel', function(event)
		{
			event.preventDefault();

			var viewport = $(this).children('.viewport');
			var which = $(this).index();

			delta = event.originalEvent.wheelDelta;
			viewport.jScroll('run', function(iScroll)
			{
				if (delta < 0)
					iScroll.scrollToPage(0, iScroll.currPageY + 1);
				else
					iScroll.scrollToPage(0, iScroll.currPageY - 1);
			});
		});

		// Set up menu tabs
		$('section.menu .viewport .track > div').each(function()
		{
			var menu = $(this).parents('section').find('.side');
			menu.append('<div class="tab">' + $(this).attr('data-name') + '</div>');
		});
		$('section.menu .side div:first-child').addClass('active');

		// Pressing a menu tab
		$('section.menu .side > div').fastClick(function()
		{ // Switch to a new section
			var viewport = $(this).parents('section').find('.viewport');
			var which = $(this).index();
			
			$(this).addClass('active');
			viewport.jScroll('run', function(iScroll)
			{
				iScroll.scrollToPage(0, which);
			});
		});

		// Set up scrolling for the viewport
		$('section.menu .viewport').jScroll({
			useTransform: true,
			useTransition: true,
			vScrollbar: false,
			snap: true,
			onScrollEnd: function()
			{ // Adjust the tab to match our current position
				var menuItems = $(this.wrapper.parentElement).children('.side').children();
				menuItems.removeClass('active');
				menuItems.eq(this.currPageY).addClass('active');
			}
		});
	},

	// Change the main application view
	changeView: function(newView)
	{
		if (newView == this.currentView)
			return;
		
		// Move the old view out of the way
		$('#' + this.currentView).removeClass('active');
		
		// Move the new view in
		$('#' + newView).addClass('active');
		
		this.currentView = newView;
	}
	
};

$(document).ready(function()
{
	Application.init();
});