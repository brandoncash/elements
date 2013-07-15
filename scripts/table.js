var Table = {
	currentTemp: 20,
	currentYear: 1800,

	init: function()
	{
		for (var i = 1; i <= 118; i++)
		{ // Loop through the elements and add them to the page
			this.addElement(periodicElements[i]);
		}

		// Change the table view
		$('#button-category').click(function() { Table.changeView('category'); });
		$('#button-temperature').click(function() { Table.changeView('temperature'); });
		$('#button-discovery').click(function() { Table.changeView('discovery'); });

		// Increase/decrease temerature of the table
		$('#temperature-sub').click(function() { Table.changeTemp(Table.currentTemp - 10); });
		$('#temperature-sub-more').click(function() { Table.changeTemp(Table.currentTemp - 100); });
		$('#temperature-add').click(function() { Table.changeTemp(Table.currentTemp + 10); });
		$('#temperature-add-more').click(function() { Table.changeTemp(Table.currentTemp + 100); });
		
		// Add/remove years from discovered year
		$('#discovery-sub').click(function() { Table.changeDiscoveryYear(Table.currentYear - 1); });
		$('#discovery-sub-more').click(function() { Table.changeDiscoveryYear(Table.currentYear - 10); });
		$('#discovery-add').click(function() { Table.changeDiscoveryYear(Table.currentYear + 1); });
		$('#discovery-add-more').click(function() { Table.changeDiscoveryYear(Table.currentYear + 10); });

		$('.control-box').css({display: 'none'}); // Hide the control boxes
		$('#controls-category').css({display: 'block'}); // Show the categories control box
	},

	addElement: function(element)
	{
		var container = $('<div>');
		
		container.addClass('element button');
		
		if (element.atomicNumber >= 113)
			container.addClass('unnamed');

		container.attr('id', 'element-' + element.atomicNumber);
		// TODO: clean this up
		var stateAtRT = element.stateAtRT;
		if (stateAtRT == 's') stateAtRT = 'solid';
		if (stateAtRT == 'g') stateAtRT = 'gas';
		if (stateAtRT == 'l') stateAtRT = 'liquid';
		if (stateAtRT == 'u') stateAtRT = 'unknown';
		container.attr('data-phase', stateAtRT);
		container.attr('data-category', element.category);
		container.attr('data-number', element.atomicNumber);
		container.attr('data-discovered', (element.yearDiscovered < 1800)?'true':'false');
		container.html(
			'<div class="number">' + element.atomicNumber + '</div>' +
			'<div class="symbol">' + element.atomicSymbol + '</div>'
		);
		container.addClass('group-' + element.group);
		container.addClass('period-' + element.period);
		
		container.bind('touchstart mousedown', function()
		{
			$(this).addClass('pushed');
		});
		container.bind('touchend mouseup', function()
		{
			// TODO: test for long press
			Table.clickElement($(this).attr('data-number'));
			$(this).removeClass('pushed');
		});
		
		// Test for long presses
		/*var longPressTimer = null;
		var stillHolding = false;
		var hasMoved = false;
		var startSelection = function()
		{
			stillHolding = true;
			longPressTimer = setTimeout(function()
			{
				if (!stillHolding)
					return;
					
				Table.longPressElement(element.atomicNumber);
			}, 750);
		};
		var stopSelection = function()
		{
			stillHolding = false;
			longPressTimer = null;
		};
		var moveSelection = function(event)
		{
			if (!stillHolding)
				return;
				
			hasMoved = true;
			longPressTimer = null;
			Table.dragElement(element.atomicNumber);
		};
		container.mousedown(startSelection);
		container.mouseup(stopSelection);
		container.mousemove(moveSelection);*/
		
		$('#elements').append(container);
	},

	clickElement: function(elementNumber)
	{
		window.location.hash = elementNumber;
	},

	changeView: function(newView)
	{
		$('#table').attr('class', newView);

		$('#options img').removeClass('active'); // Shrink the old view button
		$('#button-' + newView).addClass('active'); // Embiggen the new view button

		$('.control-box').css({display: 'none'}); // Hide the old control box
		$('#controls-' + newView).css({display: 'block'}); // Show the new one

		switch(newView)
		{
			case 'category':
				$('#labels').removeClass('hidden');
				break;
			case 'temperature':
				TemperatureGraph.draw();
				$('#labels').addClass('hidden');
				break;
			case 'discovery':
				DiscoveryGraph.draw();
				$('#labels').addClass('hidden');
				break;
		}
	},

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
		$('#temperature-display').html(Table.currentTemp + ' <sup>&deg; C</sup>');
		TemperatureGraph.draw();
	},

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
		var newElementsDiscovered = DiscoveryGraph.newDiscovered[Table.currentYear];
		$('#new-elements-number').text(newElementsDiscovered);
		if ((newElementsDiscovered == 0) || (newElementsDiscovered > 1))
			$('#new-elements-label').text('new elements discovered');
		else
			$('#new-elements-label').text('new element discovered');

		$('#discovery-year').text(Table.currentYear);
		DiscoveryGraph.draw();
	}
};