/**
	atomic-radii-graph.js
	
	An interactive graph to view the atomic radii of the elements
*/

var AtomicRadiiGraph = {
	lowestRadius: 35, // Hydrogen is 37.1
	highestRadius: 270, // Caesium is 265

	// Initialize the graph	
	init: function()
	{
		this.createCanvas();
		this.draw();
	},

	// Create a new canvas to draw on
	createCanvas: function()
	{
		this.width = $('#atomic-radii-graph').width();
		this.height = $('#atomic-radii-graph').height();

		this.canvas = $('<canvas />');
		this.ctx = this.canvas.get(0).getContext('2d');
		this.ctx.save();

		this.canvas.attr('width', this.width * 2);
		this.canvas.attr('height', this.height * 2);
		this.canvas.css(
		{
			width: this.width + 'px',
			height: this.height + 'px'
		});
		$('#atomic-radii-graph').append(this.canvas);

		$('#controls-atomic-radii').bind('mousedown mousemove touchstart touchmove', this.onTouch);
	},
	
	// Draw the graph
	draw: function()
	{
		var ctx = this.ctx;
		ctx.save();
		ctx.scale(2, 2);
		ctx.clearRect(0, 0, this.width, this.height);
		
		var unitWidth = this.width / 107; // 99 known elements + 4 more for the highlighted element + 2 for each of the adjacent elements

		var xPos = 0;
		var currentElementXpos = 0;
		var currentElementBarHeight = 0;

		if (Table.currentAtomicRadiusElement == 1)
			xPos = unitWidth * 2;

		for (var i = 1; i <= 99; i++)
		{
			ctx.beginPath();

			var atomicRadius = periodicElements[i].atomicRadius;
			if (atomicRadius == 'unknown')
				atomicRadius = 0;
			else
				atomicRadius = parseInt(atomicRadius, 10);

			var barWidth = unitWidth;
			var barHeight = Math.ceil((atomicRadius / this.highestRadius) * this.height);
			
			ctx.fillStyle = '#ddc301'; // Default background color
			if ((i == Table.currentAtomicRadiusElement - 1) || (i == Table.currentAtomicRadiusElement + 1))
			{ // Adjacent to the currently selected element
				barWidth = unitWidth * 3; // 3x wider
				ctx.fillStyle = '#e28957';
			}			
			if (i == Table.currentAtomicRadiusElement)
			{ // The currently selected element
				currentElementXpos = xPos;
				currentElementBarHeight = barHeight;
				barWidth = unitWidth * 5; // 5x wider
				ctx.fillStyle = '#e03c3d';
			}


			ctx.rect(xPos, this.height - barHeight, barWidth, barHeight);
			ctx.fill();

			xPos += barWidth;

			ctx.closePath();
		}

		// Label the currently selected element
		var fontSize = unitWidth * 4;
		ctx.font = fontSize + 'px sans-serif';
		ctx.textAlign = 'center';
		if (this.height - currentElementBarHeight > fontSize) // There is enough room to display the text at the top
			ctx.textBaseline = 'middle';
		else // Move it down below
			ctx.textBaseline = 'top';
		if (currentElementBarHeight < fontSize) /// It sits below the bottom of the graph
			ctx.textBaseline = 'bottom';
		
		ctx.strokeStyle = 'rgba(212, 237, 241, 0.7)'; // This is the body bg color
		ctx.lineWidth = unitWidth;
		ctx.strokeText(periodicElements[Table.currentAtomicRadiusElement].atomicRadius, currentElementXpos + (unitWidth * 2.5), this.height - currentElementBarHeight);
		ctx.fillStyle = '#223';
		ctx.fillText(periodicElements[Table.currentAtomicRadiusElement].atomicRadius, currentElementXpos + (unitWidth * 2.5), this.height - currentElementBarHeight);

		ctx.restore();
	},

	// Update the currently displayed element
	onTouch: function(e)
	{
		if ((e.type == 'mousemove') && (e.which != 1)) // The mouse is moving, but we're not dragging
			return;
		var posX = $('#atomic-radii-graph').offset().left;
		if (typeof(e.pageX) == 'undefined') // We are using a touch device
			e.pageX = e.originalEvent.changedTouches[0].clientX;
		var position = (e.pageX - posX) / DiscoveryGraph.width; // Normalized percentage of click position
		var newElement = Math.ceil(99 * position) + 1;

		Table.changeAtomicRadiusElement(newElement);
	}
};
