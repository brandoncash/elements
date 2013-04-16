var PeriodicTable = (function ($)
{
	var pt = {};

	pt.phaseTemp = 21;
	pt.discoveryYear = 1800;

	pt.init = function()
	{
		for (var i = 1; i <= 118; i++)
		{ // Loop through the elements and add them to the page
			this.addElement(periodicElements[i]);
		}

		$('#button-category').click(function() { pt.changeView('category'); });
		$('#button-phase').click(function() { pt.changeView('phase'); });
		$('#button-discovery').click(function() { pt.changeView('discovery'); });

		// Increase/decrease temerature of the table by 20 degrees Celcius
		$('#phase-sub').click(function() { pt.changePhaseTemp(pt.phaseTemp - 20); });
		$('#phase-add').click(function() { pt.changePhaseTemp(pt.phaseTemp + 20); });
		// Add/remove 10 years from discovered year
		$('#discovery-sub').click(function() { pt.changeDiscoveryYear(pt.discoveryYear - 10); });
		$('#discovery-add').click(function() { pt.changeDiscoveryYear(pt.discoveryYear + 10); });
	};

	pt.addElement = function(element)
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
		if (stateAtRT == '' || stateAtRT == 'u') stateAtRT = 'unknown';
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
			PeriodicTable.clickElement($(this).attr('data-number'));
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
					
				PeriodicTable.longPressElement(element.atomicNumber);
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
			PeriodicTable.dragElement(element.atomicNumber);
		};
		container.mousedown(startSelection);
		container.mouseup(stopSelection);
		container.mousemove(moveSelection);*/
		
		$('#elements').append(container);
	};

	pt.clickElement = function(elementNumber)
	{
		window.location.hash = elementNumber;
	};

	pt.changeView = function(newView)
	{
		$('#table').attr('class', 'active ' + newView);

		$('#options img').removeClass('active'); // Shrink the old view button
		$('#button-' + newView).addClass('active'); // Embiggen the new view button

		$('.control-box').css({display: 'none'}); // Hide the old control box
		$('#controls-' + newView).css({display: 'block'}); // Show the new one
	};

	pt.changePhaseTemp = function(newTemperature)
	{
		// TODO: determine a good step value for phase temps
		//  - lowest: 	H -272 C
		//  - highest: 	W  5660 (but also lots of unknowns)
		
		// FIXME: some elements have known melting point but unknown boiling point (96 Curium)
		//  - they show up as 'unknown'
		//  
		pt.phaseTemp = newTemperature;

		for (var elemNumber = 1; elemNumber <= 104; elemNumber++)
		{ // Loop through only the first 104 elements, since the rest are unknown
			var phaseState = 'unknown';
			var meltingPoint = periodicElements[elemNumber].meltingPoint;
			var boilingPoint = periodicElements[elemNumber].boilingPoint;
			if (pt.phaseTemp <= meltingPoint)
				phaseState = 'solid';
			if ((pt.phaseTemp > meltingPoint) && (pt.phaseTemp < boilingPoint))
				phaseState = 'liquid';
			if (pt.phaseTemp >= boilingPoint)
				phaseState = 'gas';
			$('#element-' + elemNumber).attr('data-phase', phaseState);
		}
		$('#phase-temp').text(pt.phaseTemp);
	};

	pt.changeDiscoveryYear = function(newYear)
	{
		// First discovery: P	1669
		// Last discovery: 	Uuo	2002
		pt.discoveryYear = newYear;

		for (var elemNumber = 1; elemNumber <= 118; elemNumber++)
		{
			var discovered = 'false';
			if (periodicElements[elemNumber].yearDiscovered < pt.discoveryYear)
				discovered = 'true'
			$('#element-' + elemNumber).attr('data-discovered', discovered);
		}
		$('#discovery-year').text(pt.discoveryYear);
	};

	return pt;
}(jQuery));