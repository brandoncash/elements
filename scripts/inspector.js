/**
	inspector.js
	
	The element inspector.
*/

var Inspector = {
	currentView: 'inspect',
	currentElement: 24,

	// Initialize the inspector view
	init: function()
	{
		// Pressing the previous/next element buttons
		$('#previous-element, #next-element').fastClick(function()
		{
			var elementNumber = $(this).attr('data-number');
			Inspector.loadElement(elementNumber);

			if (Inspector.currentView == 'wikipedia')
				Inspector.launchWikipedia();
			else
				$('#wikipedia-portal').attr('src', 'about:blank'); // Save some resources
		});

		// The different view buttons
		$('#inspect-button').fastClick(function() {
			Inspector.changeView('inspect');
		});
		$('#sources-button').fastClick(function() {
			Inspector.changeView('sources');
		});
		$('#wikipedia-button').fastClick(function() {
			Inspector.launchWikipedia();
			Inspector.changeView('wikipedia');
		});

		// Pressing the close button
		$('#close-inspector').fastClick(function() {
			Application.changeView('table');

			$('#wikipedia-portal').attr('src', 'about:blank'); // Save some resources
		});

		// Using the mousewheel on the toolbar
		$('#inspector .toolbar').bind('mousewheel', function(event)
		{
			event.preventDefault();
			delta = event.originalEvent.wheelDelta;
			if (delta < 0)
				Inspector.loadElement(Inspector.currentElement - 1);
			else
				Inspector.loadElement(Inspector.currentElement + 1);
		});
	},

	// Load the the info into the inspector
	loadElement: function(elementNumber)
	{
		var element = periodicElements[elementNumber];
		Inspector.currentElement = parseInt(elementNumber, 10);

		$('#inspector .title').text(element.fullName);

		if (element.atomicNumber > 1)
		{
			$('#previous-element').removeClass('disappeared');
			$('#previous-element').attr('data-number', element.atomicNumber - 1);
			$('#previous-element .number').text(element.atomicNumber - 1);
			$('#previous-element .symbol').text(periodicElements[element.atomicNumber - 1].atomicSymbol);
			$('#previous-element').attr('class', 'element ' + periodicElements[element.atomicNumber - 1].category);
		}
		else
			$('#previous-element').addClass('disappeared');

		$('#current-element .number').text(element.atomicNumber);
		$('#current-element .symbol').text(element.atomicSymbol);
		$('#current-element').attr('class', 'element ' + element.category);

		if (element.atomicNumber < 118)
		{
			$('#next-element').removeClass('disappeared');
			$('#next-element').attr('data-number', element.atomicNumber + 1);
			$('#next-element .number').text(element.atomicNumber + 1);
			$('#next-element .symbol').text(periodicElements[element.atomicNumber + 1].atomicSymbol);
			$('#next-element').attr('class', 'element ' + periodicElements[element.atomicNumber + 1].category);
		}
		else
			$('#next-element').addClass('disappeared');
		
		// General properties
		$('#num-of-protons').text(element.atomicNumber);
		if (element.atomicNumber == 1)
			$('#label-protons-and-electrons').html('proton &amp; electron');
		else
			$('#label-protons-and-electrons').html('protons &amp; electrons');
		$('#num-of-neutrons').text(Math.round(element.atomicWeight) - element.atomicNumber);
		var numOfElectronShells = element.electronOrbits.split(',').length;
		$('#num-of-electron-shells').text(numOfElectronShells);
		if (numOfElectronShells == 1)
			$('#label-electron-shells').html('electron shell');
		else
			$('#label-electron-shells').html('electron shells');
		$('#wikipedia-link').fastClick(function()
		{
			Application.openWikipedia('Neon');
		});
		
		var categories = [];
		categories['nonmetals'] = 'nonmetals';
		categories['alkali'] = 'alkali metals';
		categories['alkaline'] = 'alkaline earth metals';
		categories['noble'] = 'noble gases';
		categories['halogens'] = 'halogens';
		categories['metalloids'] = 'metalloids';
		categories['transition'] = 'transition metals';
		categories['posttransition'] = 'post-transition metals';
		categories['innertransition'] = 'inner transition metals';
		categories['lanthanides'] = 'lanthanides';
		categories['actinides'] = 'actinides';
		$('#category').text(categories[element.category]);
		
		// Physical properties
		var stateAtRT = element.stateAtRT;
		if (stateAtRT == 's') stateAtRT = 'solid';
		if (stateAtRT == 'g') stateAtRT = 'gas';
		if (stateAtRT == 'l') stateAtRT = 'liquid';
		if (stateAtRT == '' || stateAtRT == 'u') stateAtRT = 'unknown';
		$('#state-at-rt').text(stateAtRT);
		$('#melting-point').html((element.meltingPoint != '')?(element.meltingPoint + '&deg; C'):'unknown');
		$('#boiling-point').html((element.boilingPoint != '')?(element.boilingPoint + '&deg; C'):'unknown');
		$('#density').text(element.density);
		$('#electron-configuration').text(element.electronConf);
		
		// Atomic properties
		$('#atomic-weight').text(element.atomicWeight);
		$('#electronegativity').text(element.electronegativity);
		$('#atomic-radius').text(element.atomicRadius);
		$('#covalent-radius').text(element.covalentRadius);
		$('#ionic-radius').text(element.ionicRadius);

		// Discovery
		if (element.yearDiscovered > 0)
			$('#year-discovered').text(element.yearDiscovered);
		else
			$('#year-discovered').text((-1 * element.yearDiscovered) + ' BC');	

		$('#discovered-by').html('A. Ghiorso<br />J. Nitschke<br />J. Alonso<br />C. Alonso<br />M. Nurmia<br />G. T. Seaborg<br />K. Hulet<br />W. Lougheed'); // FIXME: this is just a fill-in value from Cr
		
		// Miscellanea
		$('#crystal-structure').text((element.crystalStructure=='')?'unknown':element.crystalStructure);
		$('#uses').text(element.uses);

		// TODO: do this replacement in the markup to begin with?
		$('#hydrides').html(element.hydrides.replace(/ /g, '<br />'));
		$('#oxides').html(element.oxides.replace(/ /g, '<br />').replace('+non-stoich', '<small>non stoich</small>'));
		$('#chlorides').html(element.chlorides.replace(/ /g, '<br />'));
		
		// Abundance
		$('#in-earths-crust').html(element.inEarthsCrust);
		$('#in-seawater').html(element.inSeawater);
		$('#in-humans').html(element.inHumans + '%');
		$('#source').text(element.source);
		
		// Picture
		if (elementNumber <= 103)
		{ // An image is available
			// FIXME: afterloading this would be better - it seems to slow it down quite a bit!
			$('#picture').attr('src', 'images/elements/' + element.fullName.toLowerCase() + '.jpg');
		}
		else
		{ // No image available
			$('#picture').attr('src', 'images/elements/transactinoid.png');
		}
		var randRotate = Math.random() * 6 - 3;
		$('#picture').css('transform', 'rotate(' + randRotate + 'deg)');
		
		// Bohr model
		BohrModel.load(element);
	},

	// Change the inspector view
	changeView: function(newView)
	{
		Inspector.currentView = newView;

		$('#inspect-button, #sources-button, #wikipedia-button').removeClass('active');
		$('#' + newView + '-button').addClass('active');

		$('#inspector .page').removeClass('active');
		$('#' + newView + '-view').addClass('active');
	},

	launchWikipedia: function()
	{
		var newSource = 'http://en.m.wikipedia.org/wiki/' + periodicElements[Inspector.currentElement].fullName;
		if ($('#wikipedia-portal').attr('src') != newSource)
			$('#wikipedia-portal').attr('src', newSource);
	}
}
