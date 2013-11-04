/**
	table.js
	
	The periodic table view.
*/

var Table = {
	currentTemp: 20,
	currentYear: 1800,
	currentAtomicRadiusElement: 24,
	currentView: 'category',

	// Initialize the table view
	init: function()
	{
		for (var i = 1; i <= 118; i++)
		{ // Loop through the elements and add them to the page
			this.addElement(periodicElements[i]);
		}

		// Open the app menu
		$('#app-menu-button').fastClick(function() {
			Application.changeView('app-menu');
		});

		// Change the table view
		// TODO: combine this into one repeatable function - maybe a data attribute?
		$('#table-view-category').fastClick(function() {
			Table.tableViewDropdownClick(this, 'category');
		});
		$('#table-view-temperature').fastClick(function() {
			Table.tableViewDropdownClick(this, 'temperature');
		});
		$('#table-view-discovery').fastClick(function() {
			Table.tableViewDropdownClick(this, 'discovery');
		});
		$('#table-view-atomic-radii').fastClick(function() {
			Table.tableViewDropdownClick(this, 'atomic-radii');
		});
		$('#table-view-electronegativity').fastClick(function() {
			Table.tableViewDropdownClick(this, 'electronegativity');
		});
		$('#table-view-picture').fastClick(function() {
			Table.tableViewDropdownClick(this, 'picture');
		});

		// Increase/decrease temerature or discovered year of the table
		$('#options-temperature .sub-more').fastClick(function() {
			Table.changeTemp(Table.currentTemp - 100);
		});
		$('#options-temperature .sub').fastClick(function() {
			Table.changeTemp(Table.currentTemp - 10);
		});
		$('#options-temperature .add').fastClick(function() {
			Table.changeTemp(Table.currentTemp + 10);
		});
		$('#options-temperature .add-more').fastClick(function() {
			Table.changeTemp(Table.currentTemp + 100);
		});
		
		$('#options-discovery .sub-more').fastClick(function() {
			Table.changeDiscoveryYear(Table.currentYear - 10);
		});
		$('#options-discovery .sub').fastClick(function() {
			Table.changeDiscoveryYear(Table.currentYear - 1);
		});
		$('#options-discovery .add').fastClick(function() {
			Table.changeDiscoveryYear(Table.currentYear + 1);
		});
		$('#options-discovery .add-more').fastClick(function() {
			Table.changeDiscoveryYear(Table.currentYear + 10);
		});
		
		$('.control-box').css({display: 'none'}); // Hide the control boxes
		$('#controls-category').css({display: 'block'}); // Show the categories control box
	},

	// Clicking a table view dropdown menu item switches the table view
	tableViewDropdownClick: function(whichOption, newView)
	{
		Table.changeView(newView);
	},

	// Add a new element to the table
	addElement: function(element)
	{
		var container = $('<div>');
		
		container.addClass('element');

		container.attr('id', 'element-' + element.atomicNumber);

		var stateAtRT = [];
		stateAtRT['s'] = 'solid';
		stateAtRT['g'] = 'gas';
		stateAtRT['l'] = 'liquid';
		stateAtRT['u'] = 'unknown';

		var electronegativity = 'unknown';
		var tempElectronegativity = parseFloat(element.electronegativity);
		if (tempElectronegativity > 0) electronegativity = 'e0p0';
		if (tempElectronegativity > 1.0) electronegativity = 'e1p0';
		if (tempElectronegativity > 1.3) electronegativity = 'e1p3';
		if (tempElectronegativity > 1.6) electronegativity = 'e1p6';
		if (tempElectronegativity > 1.9) electronegativity = 'e1p9';
		if (tempElectronegativity > 2.2) electronegativity = 'e2p2';
		if (tempElectronegativity > 2.5) electronegativity = 'e2p5';
		if (tempElectronegativity > 2.8) electronegativity = 'e2p8';
		if (tempElectronegativity > 3.1) electronegativity = 'e3p1';
		if (tempElectronegativity == NaN) electronegativity = 'unknown';
		container.addClass(electronegativity);

		var radius = (element.atomicRadius / AtomicRadiiGraph.highestRadius) * 0.6;
		// This one is apparently too new for mobile webkit:
		//var backgroundGradient = 'radial-gradient(circle ' + radius + 'em at 1em 0.7em, transparent ' + radius + 'em, #d4edf1 ' + (radius + 0.05) + 'em)';
		var backgroundGradient = '-webkit-radial-gradient(1em 0.7em, ' + radius + 'em ' + radius + 'em, #43ca68 ' + radius + 'em, transparent ' + (radius + 0.05) + 'em)';
		if (element.atomicRadius == 'unknown')
			backgroundGradient = 'none';

		var backgroundPicture = 'url(images/elements/' + element.fullName.toLowerCase() + '.jpg)';
		if (element.atomicNumber > 103)
			backgroundPicture = 'url(images/elements/transactinoid.png)';

		container.css('background-image', backgroundGradient + ', ' + backgroundPicture);
		if (element.atomicRadius == 'unknown')
			container.addClass('unknown-atomic-radius');
		if (element.atomicNumber == this.currentAtomicRadiusElement)
			container.addClass('current-atomic-radius');
		if ((element.atomicNumber == this.currentAtomicRadiusElement - 1) || (element.atomicNumber == this.currentAtomicRadiusElement + 1))
			container.addClass('adjacent-atomic-radius');

		container.attr('data-name', element.fullName);
		container.attr('data-phase', stateAtRT[element.stateAtRT]);
		container.attr('data-category', element.category);
		container.attr('data-number', element.atomicNumber);
		
		if (element.yearDiscovered < 0)
			container.addClass('unrecorded');
		
		if (element.yearDiscovered < 1800)
			container.attr('data-discovered', 'true');
		else
			container.attr('data-discovered', 'false');
		
		container.attr('data-atomic-radius', (element.atomicRadius == 'unknown')?'0':element.atomicRadius);
		container.html(
			'<div class="number">' + element.atomicNumber + '</div>' +
			'<div class="symbol">' + element.atomicSymbol + '</div>' +
			'<div class="year-discovered">' + ((element.yearDiscovered > 0)?element.yearDiscovered:((-1 * element.yearDiscovered) + ' BC')) + '</div>' +
			'<div class="electronegativity">' + ((element.electronegativity == 'unknown')?'':element.electronegativity) + '</div>' +
			'<div class="atomic-radius">' + ((element.atomicRadius == 'unknown')?'':element.atomicRadius) + '</div>'
		);
		container.addClass('group-' + element.group);
		container.addClass('period-' + element.period);
		
		container.fastClick(function()
		{
			Table.clickElement($(this).attr('data-number'));
		});

		container.bind('mousewheel', function(event, delta)
		{
			if (delta <= 0)
				return;

			Inspector.loadElement($(this).attr('data-number'));
			Inspector.changeView('inspect');
			Application.changeView('inspector');
		});
		
		$('#elements').append(container);
	},

	// Clicking on an element
	clickElement: function(elementNumber)
	{
		Inspector.loadElement(elementNumber);
		Inspector.changeView('inspect');
		Application.changeView('inspector');
	},

	// Change the table view
	changeView: function(newView)
	{
		Table.currentView = newView;

		$('.control-box').css({display: 'none'}); // Hide the old control box
		$('#controls-' + newView).css({display: 'block'}); // Show the new one
		$('#table').attr('class', newView + ' active');
	},

	// Adjust the temperature
	changeTemp: function(newTemperature)
	{
		// FIXME: some elements have known melting point but unknown boiling point (96 Curium)
		//  - they show up as 'unknown'
		
		if (newTemperature < TemperatureGraph.startTemp)
			newTemperature = TemperatureGraph.startTemp;
		if (newTemperature > TemperatureGraph.endTemp)
			newTemperature = TemperatureGraph.endTemp;
		Table.currentTemp = newTemperature;

		for (var elemNumber = 1; elemNumber <= 104; elemNumber++)
		{ // Loop through only the first 104 elements, since the rest are unknown
			var phaseState = 'unknown';
			var meltingPoint = periodicElements[elemNumber].meltingPoint;
			var boilingPoint = periodicElements[elemNumber].boilingPoint;
			if (Table.currentTemp <= meltingPoint)
				phaseState = 'solid';
			if ((Table.currentTemp > meltingPoint) && (Table.currentTemp < boilingPoint))
				phaseState = 'liquid';
			if (Table.currentTemp >= boilingPoint)
				phaseState = 'gas';
			$('#element-' + elemNumber).attr('data-phase', phaseState);
		}
		$('#options-temperature .display').html(Table.currentTemp + '<sup>&deg; C</sup>');
		TemperatureGraph.draw();
	},

	// Adjust the discovery year
	changeDiscoveryYear: function(newYear)
	{
		if (newYear < DiscoveryGraph.firstYear)
			newYear = DiscoveryGraph.firstYear;
		if (newYear > DiscoveryGraph.lastYear)
			newYear = DiscoveryGraph.lastYear;
		Table.currentYear = newYear;

		for (var elemNumber = 1; elemNumber <= 118; elemNumber++)
		{
			var discovered = false;
			if (periodicElements[elemNumber].yearDiscovered <= Table.currentYear)
				discovered = true;
			$('#element-' + elemNumber).attr('data-discovered', discovered);

			if (periodicElements[elemNumber].yearDiscovered == Table.currentYear)
				$('#element-' + elemNumber).addClass('new');
			else
				$('#element-' + elemNumber).removeClass('new');
		}
		$('#discovered-elements-number').text(DiscoveryGraph.numberDiscovered[Table.currentYear]);
		$('#discovered-this-year').text('(' + DiscoveryGraph.newlyDiscovered[Table.currentYear] + ')');

		$('#options-discovery .display').text(Table.currentYear);
		DiscoveryGraph.draw();
	},

	changeAtomicRadiusElement: function(newElement)
	{
		if (newElement < 1)
			newElement = 1;
		if (newElement > 99)
			newElement = 99;

		$('#table .element').removeClass('current-atomic-radius adjacent-atomic-radius');
		$('#element-' + Table.currentAtomicRadiusElement).addClass('current-atomic-radius');
		$('#element-' + (Table.currentAtomicRadiusElement - 1)).addClass('adjacent-atomic-radius');
		$('#element-' + (Table.currentAtomicRadiusElement + 1)).addClass('adjacent-atomic-radius');
		if (Table.currentAtomicRadiusElement != newElement)
		{ // Do we need to redraw?
			Table.currentAtomicRadiusElement = newElement;
			AtomicRadiiGraph.draw();
		}
	}
};