var Inspector = {

	init: function()
	{
		// Adjust the viewport height to match screen space
		$('#inspector .viewport .track > div').height($('#inspector .viewport').height());
		
		// Set up menu tabs
		$('#inspector .viewport .track > div').each(function()
		{
			var menu = $('#inspector').children('.menu');
			menu.append('<div class="tab">' + $(this).attr('data-name') + '</div>');
		});
		$('#inspector .menu div:first-child').addClass('active');

		// Pressing a menu tab
		$('#inspector .menu > div').click(function()
		{ // Switch to a new section
			var menu = $('#inspector').children('.menu');
			var which = menu.children().index(this);
			var viewport = $('#inspector').children('.viewport');
			
			$(this).addClass('active');
			viewport.jScroll('run', function(iScroll)
			{
				iScroll.scrollToPage(0, which);
			});
		});

		// Set up scrolling for the viewport
		$('#inspector .viewport').jScroll({
			useTransform: true,
			useTransition: true,
			vScrollbar: false,
			snap: true,
			onScrollEnd: function()
			{ // Adjust the tab to match our current position
				var menuItems = $(this.wrapper.parentElement).children('.menu').children();
				menuItems.removeClass('active');
				menuItems.eq(this.currPageY).addClass('active');
			}
		});

		// Pressing the previous/next element buttons
		$('#previous-element, #next-element').click(function() { window.location.hash = $(this).attr('data-number'); });

		// Pressing the close button
		$('#close-inspector').click(function() { window.location.hash = ''; });
	},

	loadElement: function(elementNumber)
	{
		var element = periodicElements[elementNumber];
		
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
		var category = element.category;
		if (category == 'nonmetals') category = 'nonmetals';
		if (category == 'alkali') category = 'alkali metals';
		if (category == 'alkaline') category = 'alkaline earth metals';
		if (category == 'noble') category = 'noble gases';
		if (category == 'halogens') category = 'halogens';
		if (category == 'metalloids') category = 'metalloids';
		if (category == 'transition') category = 'transition metals';
		if (category == 'posttransition') category = 'post-transition metals';
		if (category == 'innertransition') category = 'inner transition metals';
		if (category == 'lanthanides') category = 'lanthanides';
		if (category == 'actinides') category = 'actinides';
		$('#category').text(category);
		$('#crystal-structure').text((element.crystalStructure=='')?'unknown':element.crystalStructure);
		
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
		
		// Miscellanea
		if (element.yearDiscovered > 0)
			$('#year-discovered').text(element.yearDiscovered);
		else
			$('#year-discovered').html((-1 * element.yearDiscovered) + ' BC');
		$('#uses').text(element.uses);
		$('#hydrides').html(element.hydrides);
		$('#oxides').html(element.oxides);
		$('#chlorides').html(element.chlorides);
		
		// Reactions
		$('#react-air').html(element.reactAir);
		$('#react-water').html(element.reactWater);
		$('#react-HCl').html(element.reactHCl);
		$('#react-HNO3').html(element.reactHNO3);
		$('#react-NaOH').html(element.reactNaOH);
		
		// Abundance
		$('#in-earths-crust').html(element.inEarthsCrust);
		$('#in-seawater').html(element.inSeawater);
		$('#in-humans').html(element.inHumans + '%');
		$('#source').text(element.source);
		
		// Picture
		if (elementNumber <= 103)
		{ // An image is available
			// FIXME: afterloading this would be better - it seems to slow it down quite a bit!
			$('#picture-img').attr('src', 'images/elements/' + element.fullName.toLowerCase() + '.jpg');
		}
		else
		{ // No image available
			$('#picture-img').attr('src', 'images/elements/transactinoid.png');
		}
		$('#picture-caption').text(element.fullName);
		var randRotate = Math.random() * 6 - 3;
		$('#picture').css('transform', 'rotate(' + randRotate + 'deg)');
		
		// Bohr model
		BohrModel.load(element);
	}
}
